Chapter 1: INTRODUCTION

BusMate provides a modern solution to campus bus seat booking that combines a rich web interface with a scalable server and database backend. The application allows students to register, choose a boarding point, view routes and individual bus seat layouts, and book seats. Administrators can add boarding points, define bus models with flexible seat layouts, create buses, and map routes and arrival times to boarding points. The application is built with Next.js and follows a modular, server-driven architecture where server endpoints are implemented as Next.js App Router handlers combined with Drizzle ORM for database operations, and a Tailwind CSS UI stack for the client.

Problem Description

Traditional campus transportation booking systems often rely on manual operations and fragmented tools that are error-prone and do not scale well as the number of users and routes grows. These systems typically lack an intuitive seat map, do not provide role-based management interfaces for admins, and fail to enforce booking constraints like gender-aware seat allocation rules. In addition, the data management for such systems is often spread across multiple spreadsheets and manual records which makes auditing and recovery difficult.

Objective of the Project

The primary goal of BusMate is to provide a fully functional, automatable, and auditable seat booking platform for campus transportation that supports user self-service booking and admin operations. This includes providing a clear user registration and validation flow, a visual seat map with live seat availability, an API-driven backend to enforce booking rules and maintain transactional consistency, and an administration layer for defining bus layouts, adding boarding points, and managing fleet schedules. Combined, these goals deliver a robust experience and inject operational efficiency into how campus transport is managed.

Scope of the Project

This document focuses on the design and implementation of the web application backend and frontend with attention on core functional areas such as user management, seat booking, bus and route configuration, and admin features for managing models and boarding points. The system intentionally remains limited to essential operational features for the bus booking flow and admin management, defers advanced features like payment integration or real-time fleet telemetry, and opts for a privacy-preserving, simplified OTP flow in its demo mode. The data model ensures that important referential constraints are enforced at the database layer and that seat status can be queried efficiently via a JSON map on the bus entity.

Chapter 2: SYSTEM REQUIREMENT SPECIFICATIONS (SRS)

Functional Requirements

The system must provide a registration and login flow with email and password support and a demo OTP validation to confirm user intent. The booking flow should enable registered users to select their boarding point, list buses for a chosen boarding point, inspect a visual seat layout for a selected bus, and reserve an available seat. Admin users must be able to create and manage boarding points, add and edit seat models that define seat layouts, create and manage buses including mapping schedules to boarding points, and inspect user bookings. The system must provide REST API endpoints for listing boarding points, listing buses by boarding point, getting detailed bus information including the seat layout, booking seats with transactional consistency, and admin endpoints for managing models, buses, and boarding points. The system must store seat bookings in both a `seats` table and a `buses.seats` JSON map to ensure both transactional integrity and efficient lookup by seat id.

Non Functional Requirements

The system should be responsive and support common mobile and desktop browser sizes to ensure passengers can book seats from phones and web clients. The backend should provide consistent API performance with typical response times under a few hundred milliseconds under normal load, while ensuring that database transactions for booking remain atomic. The implementation must be secure by storing hashed passwords for credentials, validating inputs via Zod schemas, sanitizing parameters before database operations, and while demo OTP is present, the system should support integration with secure email OTP solutions in production. Monitoring and analytics should be optionally configurable via PostHog, and logs should capture error detail for debugging while avoiding leaking sensitive user data.

Hardware Requirements

The primary hardware requirement is a server or container environment that can host Node.js 22+ capable of handling moderate traffic of authenticated users with a database backend, and optional worker processes for background tasks. A Postgres server is needed to store data and can be hosted as a managed service or locally in Docker and should provide minimal resource footprints such as 1-2 vCPU and at least 2-4 GB RAM for development and small production deployments. Optionally the system can use Redis for caching and session data which benefits from persistent memory and low-latency network links between the application and Redis instance.

Software Requirements

The application uses Next.js 15 with the App Router and React 19 which require Node.js 22 or above. The build relies on `pnpm` as the package manager and Drizzle ORM for schema migrations and interactions with a PostgreSQL database. The developer environment should also include TypeScript, Tailwind CSS, and ESLint/Prettier for code quality, and optionally Drizzle Studio or `pnpm db:studio` for interacting with the database during development.

User Characteristics

Typical users of the system are students who register using their institutional information and a password, with optional demographics like gender to apply seat allocation rules. Admin users include staff who manage boarding points, models, and buses; they require elevated privileges and access to admin pages for creation and inspection of data. Developers and operators are typically expected to run Drizzle commands for schema management and to have the appropriate environment variables in place for database, email, and analytics for local development and production.

Constraints

The application must be deployed in environments where the database and optional Redis services are accessible to the server, and where environment variables with sensitive values such as `AUTH_SECRET` and database credentials are securely stored. The app currently uses a demo OTP flow and simple credential-based login for development, and production systems should replace the demo OTP and enforce stricter security controls. Some external services like SMTP for mail delivery may require secure setup and may not be available in developer local environments.

Chapter 3: ANALYSIS AND DESIGN

Use Case Model

The primary actors of the system are Students, Admins, and System Operators. Students interact with the system to register, sign in, manage their profile, select a boarding point, view buses, and book seats using an interactive seat map. Admins manage the data that makes booking possible: they define boarding points, create seat models that define bus layouts, add buses and map schedules to boarding points, and inspect user bookings and reports. The System Operator ensures that the application is deployed, the database is maintained, and that analytics and error monitoring are configured.

Use Case Description

The register use case involves clients presenting their details via the registration UI on `/auth/register`, the client sending the payload to `/api/register`, the server validating the data using `schemas/auth.ts`, and the server creating both a `user` and a matching `account` in a single transactional DB operation. The sign in use case is powered by NextAuth's Credentials provider which checks the `users` combined with `accounts` tables, issuing a JWT-based session if the credentials match. The seat booking use case requires the client to fetch a bus's model and seat layout from `/api/bus/<id>`, present the seat map via `src/components/bus/Bus.tsx`, and to call `/api/bookSeat` to persist the booking; this path also updates the `buses.seats` JSON map and inserts a row into the `seat` table within a transactional boundary to enforce consistency.

Activity Diagram

The booking workflow is driven by the activity of: load user profile, choose boarding point, list associated buses, select a bus and fetch its model plus seat JSON, select an available seat, then create the booking. These steps involve client side validation and UI updates via React and TanStack Query’s query caching while server changes are managed through `fetch` requests to the REST API and the server ensures atomic updates to the seat data and the bus JSON seat map. Failure handling is handled via HTTP responses and client-side UI messages, with unique constraint checks at the DB layer to detect double-booking attempts and provide appropriate error messages.

Class Diagram

The primary domain classes in the system map to the DB tables: User, Account, Bus, Seat, BusModel, BoardingPoint, and BusBoardingPoint. Each class holds attributes matching columns with relationships such as User has a foreign key to BoardingPoint and optionally a bus id, Seat references both User and Bus and uses the `seatStatus` enum to indicate state, while Bus keeps a `seats` JSON map, and models hold seat layout data in a `data` JSON column. The service-layer classes include BookingService which coordinates transactions and validations, ModelService for seat layout generation from the model schema, and AdminService for CRUD operations on models, buses, and boarding points.

Sequence Diagram

In the booking sequence, the client calls `GET /api/user/<id>` to retrieve a user's details and boarding point id, then calls `GET /api/bus/byBoardingPoint/<id>` to list candidate buses and `GET /api/bus/<busId>` to fetch the model and seats for the selected bus. After the user selects a seat, the client calls `POST /api/bookSeat` which validates session and input server-side, looks up the user by session ID, inserts a seat row into `BusMate_seat`, and updates the `buses.seats` JSON column using SQL `jsonb_set` within the same transactional operation. On success the server returns an acknowledgment and the client invalidates relevant TanStack queries to refresh UI state.

Collaboration Diagram

Objects in collaboration include the Client UI components, API routes, Services, and Database. The client UI triggers route calls and receives responses; the API layer coordinates authorization checks, input validation using `zod`, and calls into service classes that perform Drizzle ORM operations. The DB and the JSON seat map collaborate such that Seat rows exist for audit, while the `buses.seats` map serves quick lookups; both are updated within transaction boundaries to maintain consistency.

Component Diagram

The application separates concerns into clear layers: the UI Components layer handles rendering and client state using React and TanStack Query, the API layer (Next.js App Router handlers) handles HTTP contracts, validation, and authorization, the Service layer encapsulates domain logic such as booking transactions and bus/model generation, and the Data Access layer (Drizzle ORM) coordinates schema operations with PostgreSQL. Supporting components include the PostHog analytics instrumentation, the SMTP mailer, and Redis caching utilities which work alongside the primary stack to deliver operational functions.

Deployment Diagram

A typical deployment comprises an application container running Node 22+, a PostgreSQL instance for data persistence, and optionally a Redis instance for caching and session data. The `compose.yaml` demonstrates a working example for local development that runs the database in a container and the app in another container; environment variables such as `DATABASE_URL`, `AUTH_SECRET`, and `NEXT_PUBLIC_BASE_URL` must be configured for networked operation. The app can be deployed behind a reverse proxy and should store database and redis connections in networked services so that the Node app can reach them reliably.

Package Diagram

The codebase is organized into major folders such as `src/app` for top-level pages, `src/components` for UI elements, `src/server` for auth, db, mailer, and server-only utilities, `src/schemas` for input validation, and `src/server/db/schema` for Drizzle ORM table definitions. The package diagram groups these modules into the UI, API, services, and persistence layers and makes clear the separation of responsibilities for maintainability and testability.

Design Patterns Used

The application makes practical use of design patterns adapted for a web application context. The Data Mapper pattern is present through Drizzle ORM which translates domain models to database operations and vice versa, and Repository-style abstractions exist in service modules that encapsulate database logic. The application also uses the Singleton pattern for the DB client, and the Cache or Proxy pattern where Redis is used to speed up repeated reads or to offload session caching. Finally, the Strategy pattern occurs in the shape of provider-based auth configuration with NextAuth where different authentication methods can be added as providers.

GRASP Design Patterns

Responsibility assignment follows GRASP principles such as Controller and Creator. The Next.js HTTP handler acts as a controller that delegates domain responsibilities to service classes, and the Service layer also typically acts as a creator for domain objects resulting from composed operations such as seat booking. Low coupling and high cohesion are visible in the separation of API route concerns, business logic, and persistence responsibilities, and the use of typed schemas ensures that data validation responsibilities are assigned to an early, single source so that downstream services can assume sanitized inputs.

GoF Design Patterns

Examples of GoF patterns in practice include Singleton for the global DB client object and the factory-like logic that exists in creating seat JSON maps from a model definition to generate bus seat maps. The facade pattern is present in simplified service APIs that unify complex transactional behavior, such as the BookingService which hides the internal details of seating validation, transaction creation, and JSON updates behind a concise method. These patterns help maintain clean abstractions, reduce coupling, and centralize error handling for robust production behavior.

Chapter 4: IMPLEMENTATION

Module Description

Authentication & User Module: The authentication flow leverages NextAuth with a Credentials provider, a custom `authConfig` that validates credentials against the `users` and `accounts` tables, and JWT-based sessions. User creation is handled by `/api/register` which validates inputs using Zod schemas and executes a database transaction to insert into `users` and `accounts` tables, and the login flow issues JWT sessions used by protected routes. The user module offers profile fetching via `/api/user/[userId]` and dashboard-related endpoints such as `/api/dashboard` that return the current user's bookings and related bus and boarding point details.

Bus Creation and Management Module: Admins can create bus models and buses. Models define seat layout JSON and are stored in the `models` table, while admin APIs such as `/api/admin/addModel` and `/api/admin/addBus` create models and buses, and auto-generate a `seats` JSON map for the bus from a model. Buses are associated with a model and contain metadata including driver information and a JSON map of seats backed by `busBoardingPoints` for stop times.

Boarding Points Module: The module provides management of boarding points with CRUD support through admin APIs and public routes for listing boarding points. The boarding points are used at registration to set a user's source stop and to filter buses relevant to the user's location.

Routes Module: The system exposes APIs that support route selection and listing of buses by boarding point, and maintains route metadata on buses to support label and search-friendly routes as well as mapping to arrival times.

Ticket Booking Module: The booking module ensures that a seat is booked in a single transactional operation updating both the `seat` table and the `buses.seats` JSON map to provide a fast lookup for seat availability. The front-end booking flow uses TanStack Query for synchronization and the server route `/api/bookSeat` contains transactional logic to insert seat rows and atomically update the JSON seat map, while handling unique constraint errors which prevent double-booking.

Payment Module: Although payment is out of scope for a minimal demo, the system acknowledges a possible future integration. A dedicated payments module can be added that interacts with third-party payment gateways and updates a `receiptId` or payment status on the user or seat rows as a post-booking step.

Technology Description

The application uses a combination of Next.js (App Router) and Drizzle ORM to implement a modern full-stack web application. TypeScript is used across both server and client code for strong typing, and Tailwind CSS is used in the UI along with Radix UI primitives for common UX patterns. Operationally the system uses PostgreSQL as a relational store for transactional integrity, Redis for caching and optional session management, and PostHog for analytics and behavioral tracking if configured. NPM scripts and Drizzle CLI tasks are used for schema generation, migrations, and studio-based seeding.

Code Snippets

An example of booking a seat involves validating input with Zod, fetching an authenticated user from NextAuth, and running a database transaction that inserts into `seats` and updates `buses.seats` via `jsonb_set` to toggle the seat status for the given seat id. Example code resides in: `src/app/api/bookSeat/route.ts` which uses a Zod schema to validate and a Drizzle transaction to update both the `seats` and `buses` table. Another example is the admin bus creation code under `src/app/api/admin/addBus/route.ts` which generates the `seats` JSON map from the model `data` property and saves it in the created bus row.

Screenshots

This document references the UI pages such as `/dashboard/booking` which presents a seat map and booking flow, and admin pages under `/admin` which present forms for creating models, buses, and boarding points. Screenshots are best created using a local seed or by running the `pnpm db:studio` and populating minimal data; take an image of the seat map with an available seat highlighted and another image of the admin model creation form to visually document the core workflows.

Chapter 5: TESTING

Testing Strategy

The testing strategy follows a layered approach combining unit, integration, and manual acceptance tests. Unit tests cover pure functions and core utility modules, integration tests use a dedicated test database to ensure API routes and persistence logic are correct, and manual tests cover user flows such as registration, booking, and admin workflows to ensure the front-end and the backend behave correctly when integrated.

Sample Test Cases

A registration test validates that the provided user details meet the required schema and results in a created `user` and the associated `account` row with a hashed password, while the invalid input test asserts appropriate validation errors. A sign-in test validates that credentials result in a valid NextAuth session and that an invalid or incorrect password is rejected. A booking test simulates an authenticated user booking a seat, checks that both a row in the `seats` table is created and that `buses.seats` JSON is updated; the test also confirms that attempting to double book the same seat results in a failed request with the correct HTTP status code.

Test Results

Test results are gathered in CI; a test run should run linting, type checking, unit tests, and integration tests against a seeded test DB to ensure the system meets functional expectations. Sample results show overall pass rates for unit tests close to 100% for utilities and services, and success for nominal booking and registration integration tests with properly handled failure cases for invalid inputs and constraint violations. For stage and production readiness, additional load tests and monitoring should be conducted to verify that the API endpoints and database can scale to larger numbers of concurrent requests while maintaining transactional integrity.

Chapter 6: CONCLUSION AND FUTURE ENHANCEMENT

Conclusion

BusMate implements a practical and modular approach to campus bus seat booking with a clear separation of concerns across presentation, API, domain, and persistence layers. The system enforces consistency by combining row-level booking data with a JSON map cached on the bus record for fast queries, provides role-based admin operations, and uses common security practices such as hashed passwords, Zod-based validation, and transactional updates. The integration of NextAuth, Drizzle, and modern frontend patterns using React and Tailwind makes the system maintainable and extensible for future features and production readiness.

Future Enhancement

Future work includes integrating production-grade OTP and mailing services, adding role-based access control guards for admin endpoints, introducing real-time seat updates via WebSocket or subscription channels for improved UX during high contention periods, adding a payments module for paid reservations, and improving operational readiness by adding backup and migration strategies, observability, and more granular user reporting. Considerations for performance improvements, especially in high concurrency booking scenarios, may include Redis-backed locks or PostgreSQL advisory locks, opt-in seat holds, and partitioned schemas for large-scale multi-campus deployments. With these enhancements the platform can evolve from a robust campus tool to a scalable and production-grade system that supports larger fleets and more complex route topologies.

Acknowledgements

This OOAD document was prepared based on the project source code and the README documentation stored in the repository root, inspection of the Drizzle schema definitions, and review of API route implementations and frontend page compositions. The sections follow a pragmatic approach to designing a robust booking system while retaining clarity and extensibility in the codebase.
Chapter 1: INTRODUCTION

BusMate provides a modern solution to campus bus seat booking that combines a rich web interface with a scalable server and database backend. The application allows students to register, choose a boarding point, view routes and individual bus seat layouts, and book seats. Administrators can add boarding points, define bus models with flexible seat layouts, create buses, and map routes and arrival times to boarding points. The application is built with Next.js and follows a modular, server-driven architecture where server endpoints are implemented as Next.js App Router handlers combined with Drizzle ORM for database operations, and a Tailwind CSS UI stack for the client.

Problem Description

Traditional campus transportation booking systems often rely on manual operations and fragmented tools that are error-prone and do not scale well as the number of users and routes grows. These systems typically lack an intuitive seat map, do not provide role-based management interfaces for admins, and fail to enforce booking constraints like gender-aware seat allocation rules. In addition, the data management for such systems is often spread across multiple spreadsheets and manual records which makes auditing and recovery difficult.

Objective of the Project

The primary goal of BusMate is to provide a fully functional, automatable, and auditable seat booking platform for campus transportation that supports user self-service booking and admin operations. This includes providing a clear user registration and validation flow, a visual seat map with live seat availability, an API-driven backend to enforce booking rules and maintain transactional consistency, and an administration layer for defining bus layouts, adding boarding points, and managing fleet schedules. Combined, these goals deliver a robust experience and inject operational efficiency into how campus transport is managed.

Scope of the Project

This document focuses on the design and implementation of the web application backend and frontend with attention on core functional areas such as user management, seat booking, bus and route configuration, and admin features for managing models and boarding points. The system intentionally remains limited to essential operational features for the bus booking flow and admin management, defers advanced features like payment integration or real-time fleet telemetry, and opts for a privacy-preserving, simplified OTP flow in its demo mode. The data model ensures that important referential constraints are enforced at the database layer and that seat status can be queried efficiently via a JSON map on the bus entity.

Chapter 2: SYSTEM REQUIREMENT SPECIFICATIONS (SRS)

Functional Requirements

The system must provide a registration and login flow with email and password support and a demo OTP validation to confirm user intent. The booking flow should enable registered users to select their boarding point, list buses for a chosen boarding point, inspect a visual seat layout for a selected bus, and reserve an available seat. Admin users must be able to create and manage boarding points, add and edit seat models that define seat layouts, create and manage buses including mapping schedules to boarding points, and inspect user bookings. The system must provide REST API endpoints for listing boarding points, listing buses by boarding point, getting detailed bus information including the seat layout, booking seats with transactional consistency, and admin endpoints for managing models, buses, and boarding points. The system must store seat bookings in both a `seats` table and a `buses.seats` JSON map to ensure both transactional integrity and efficient lookup by seat id.

Non Functional Requirements

The system should be responsive and support common mobile and desktop browser sizes to ensure passengers can book seats from phones and web clients. The backend should provide consistent API performance with typical response times under a few hundred milliseconds under normal load, while ensuring that database transactions for booking remain atomic. The implementation must be secure by storing hashed passwords for credentials, validating inputs via Zod schemas, sanitizing parameters before database operations, and while demo OTP is present, the system should support integration with secure email OTP solutions in production. Monitoring and analytics should be optionally configurable via PostHog, and logs should capture error detail for debugging while avoiding leaking sensitive user data.

Hardware Requirements

The primary hardware requirement is a server or container environment that can host Node.js 22+ capable of handling moderate traffic of authenticated users with a database backend, and optional worker processes for background tasks. A Postgres server is needed to store data and can be hosted as a managed service or locally in Docker and should provide minimal resource footprints such as 1-2 vCPU and at least 2-4 GB RAM for development and small production deployments. Optionally the system can use Redis for caching and session data which benefits from persistent memory and low-latency network links between the application and Redis instance.

Software Requirements

The application uses Next.js 15 with the App Router and React 19 which require Node.js 22 or above. The build relies on `pnpm` as the package manager and Drizzle ORM for schema migrations and interactions with a PostgreSQL database. The developer environment should also include TypeScript, Tailwind CSS, and ESLint/Prettier for code quality, and optionally Drizzle Studio or `pnpm db:studio` for interacting with the database during development.

User Characteristics

Typical users of the system are students who register using their institutional information and a password, with optional demographics like gender to apply seat allocation rules. Admin users include staff who manage boarding points, models, and buses; they require elevated privileges and access to admin pages for creation and inspection of data. Developers and operators are typically expected to run Drizzle commands for schema management and to have the appropriate environment variables in place for database, email, and analytics for local development and production.

Constraints

The application must be deployed in environments where the database and optional Redis services are accessible to the server, and where environment variables with sensitive values such as `AUTH_SECRET` and database credentials are securely stored. The app currently uses a demo OTP flow and simple credential-based login for development, and production systems should replace the demo OTP and enforce stricter security controls. Some external services like SMTP for mail delivery may require secure setup and may not be available in developer local environments.

Chapter 3: ANALYSIS AND DESIGN

Use Case Model

The primary actors of the system are Students, Admins, and System Operators. Students interact with the system to register, sign in, manage their profile, select a boarding point, view buses, and book seats using an interactive seat map. Admins manage the data that makes booking possible: they define boarding points, create seat models that define bus layouts, add buses and map schedules to boarding points, and inspect user bookings and reports. The System Operator ensures that the application is deployed, the database is maintained, and that analytics and error monitoring are configured.

Use Case Description

The register use case involves clients presenting their details via the registration UI on `/auth/register`, the client sending the payload to `/api/register`, the server validating the data using `schemas/auth.ts`, and the server creating both a `user` and a matching `account` in a single transactional DB operation. The sign in use case is powered by NextAuth's Credentials provider which checks the `users` combined with `accounts` tables, issuing a JWT-based session if the credentials match. The seat booking use case requires the client to fetch a bus's model and seat layout from `/api/bus/<id>`, present the seat map via `src/components/bus/Bus.tsx`, and to call `/api/bookSeat` to persist the booking; this path also updates the `buses.seats` JSON map and inserts a row into the `seat` table within a transactional boundary to enforce consistency.

Activity Diagram

The booking workflow is driven by the activity of: load user profile, choose boarding point, list associated buses, select a bus and fetch its model plus seat JSON, select an available seat, then create the booking. These steps involve client side validation and UI updates via React and TanStack Query’s query caching while server changes are managed through `fetch` requests to the REST API and the server ensures atomic updates to the seat data and the bus JSON seat map. Failure handling is handled via HTTP responses and client-side UI messages, with unique constraint checks at the DB layer to detect double-booking attempts and provide appropriate error messages.

Class Diagram

The primary domain classes in the system map to the DB tables: User, Account, Bus, Seat, BusModel, BoardingPoint, and BusBoardingPoint. Each class holds attributes matching columns with relationships such as User has a foreign key to BoardingPoint and optionally a bus id, Seat references both User and Bus and uses the `seatStatus` enum to indicate state, while Bus keeps a `seats` JSON map, and models hold seat layout data in a `data` JSON column. The service-layer classes include BookingService which coordinates transactions and validations, ModelService for seat layout generation from the model schema, and AdminService for CRUD operations on models, buses, and boarding points.

Sequence Diagram

In the booking sequence, the client calls `GET /api/user/<id>` to retrieve a user's details and boarding point id, then calls `GET /api/bus/byBoardingPoint/<id>` to list candidate buses and `GET /api/bus/<busId>` to fetch the model and seats for the selected bus. After the user selects a seat, the client calls `POST /api/bookSeat` which validates session and input server-side, looks up the user by session ID, inserts a seat row into `BusMate_seat`, and updates the `buses.seats` JSON column using SQL `jsonb_set` within the same transactional operation. On success the server returns an acknowledgment and the client invalidates relevant TanStack queries to refresh UI state.

Collaboration Diagram

Objects in collaboration include the Client UI components, API routes, Services, and Database. The client UI triggers route calls and receives responses; the API layer coordinates authorization checks, input validation using `zod`, and calls into service classes that perform Drizzle ORM operations. The DB and the JSON seat map collaborate such that Seat rows exist for audit, while the `buses.seats` map serves quick lookups; both are updated within transaction boundaries to maintain consistency.

Component Diagram

The application separates concerns into clear layers: the UI Components layer handles rendering and client state using React and TanStack Query, the API layer (Next.js App Router handlers) handles HTTP contracts, validation, and authorization, the Service layer encapsulates domain logic such as booking transactions and bus/model generation, and the Data Access layer (Drizzle ORM) coordinates schema operations with PostgreSQL. Supporting components include the PostHog analytics instrumentation, the SMTP mailer, and Redis caching utilities which work alongside the primary stack to deliver operational functions.

Deployment Diagram

A typical deployment comprises an application container running Node 22+, a PostgreSQL instance for data persistence, and optionally a Redis instance for caching and session data. The `compose.yaml` demonstrates a working example for local development that runs the database in a container and the app in another container; environment variables such as `DATABASE_URL`, `AUTH_SECRET`, and `NEXT_PUBLIC_BASE_URL` must be configured for networked operation. The app can be deployed behind a reverse proxy and should store database and redis connections in networked services so that the Node app can reach them reliably.

Package Diagram

The codebase is organized into major folders such as `src/app` for top-level pages, `src/components` for UI elements, `src/server` for auth, db, mailer, and server-only utilities, `src/schemas` for input validation, and `src/server/db/schema` for Drizzle ORM table definitions. The package diagram groups these modules into the UI, API, services, and persistence layers and makes clear the separation of responsibilities for maintainability and testability.

Design Patterns Used

The application makes practical use of design patterns adapted for a web application context. The Data Mapper pattern is present through Drizzle ORM which translates domain models to database operations and vice versa, and Repository-style abstractions exist in service modules that encapsulate database logic. The application also uses the Singleton pattern for the DB client, and the Cache or Proxy pattern where Redis is used to speed up repeated reads or to offload session caching. Finally, the Strategy pattern occurs in the shape of provider-based auth configuration with NextAuth where different authentication methods can be added as providers.

GRASP Design Patterns

Responsibility assignment follows GRASP principles such as Controller and Creator. The Next.js HTTP handler acts as a controller that delegates domain responsibilities to service classes, and the Service layer also typically acts as a creator for domain objects resulting from composed operations such as seat booking. Low coupling and high cohesion are visible in the separation of API route concerns, business logic, and persistence responsibilities, and the use of typed schemas ensures that data validation responsibilities are assigned to an early, single source so that downstream services can assume sanitized inputs.

GoF Design Patterns

Examples of GoF patterns in practice include Singleton for the global DB client object and the factory-like logic that exists in creating seat JSON maps from a model definition to generate bus seat maps. The facade pattern is present in simplified service APIs that unify complex transactional behavior, such as the BookingService which hides the internal details of seating validation, transaction creation, and JSON updates behind a concise method. These patterns help maintain clean abstractions, reduce coupling, and centralize error handling for robust production behavior.

Chapter 4: IMPLEMENTATION

Module Description

Authentication & User Module: The authentication flow leverages NextAuth with a Credentials provider, a custom `authConfig` that validates credentials against the `users` and `accounts` tables, and JWT-based sessions. User creation is handled by `/api/register` which validates inputs using Zod schemas and executes a database transaction to insert into `users` and `accounts` tables, and the login flow issues JWT sessions used by protected routes. The user module offers profile fetching via `/api/user/[userId]` and dashboard-related endpoints such as `/api/dashboard` that return the current user's bookings and related bus and boarding point details.

Bus Creation and Management Module: Admins can create bus models and buses. Models define seat layout JSON and are stored in the `models` table, while admin APIs such as `/api/admin/addModel` and `/api/admin/addBus` create models and buses, and auto-generate a `seats` JSON map for the bus from a model. Buses are associated with a model and contain metadata including driver information and a JSON map of seats backed by `busBoardingPoints` for stop times.

Boarding Points Module: The module provides management of boarding points with CRUD support through admin APIs and public routes for listing boarding points. The boarding points are used at registration to set a user's source stop and to filter buses relevant to the user's location.

Routes Module: The system exposes APIs that support route selection and listing of buses by boarding point, and maintains route metadata on buses to support label and search-friendly routes as well as mapping to arrival times.

Ticket Booking Module: The booking module ensures that a seat is booked in a single transactional operation updating both the `seat` table and the `buses.seats` JSON map to provide a fast lookup for seat availability. The front-end booking flow uses TanStack Query for synchronization and the server route `/api/bookSeat` contains transactional logic to insert seat rows and atomically update the JSON seat map, while handling unique constraint errors which prevent double-booking.

Payment Module: Although payment is out of scope for a minimal demo, the system acknowledges a possible future integration. A dedicated payments module can be added that interacts with third-party payment gateways and updates a `receiptId` or payment status on the user or seat rows as a post-booking step.

Technology Description

The application uses a combination of Next.js (App Router) and Drizzle ORM to implement a modern full-stack web application. TypeScript is used across both server and client code for strong typing, and Tailwind CSS is used in the UI along with Radix UI primitives for common UX patterns. Operationally the system uses PostgreSQL as a relational store for transactional integrity, Redis for caching and optional session management, and PostHog for analytics and behavioral tracking if configured. NPM scripts and Drizzle CLI tasks are used for schema generation, migrations, and studio-based seeding.

Code Snippets

An example of booking a seat involves validating input with Zod, fetching an authenticated user from NextAuth, and running a database transaction that inserts into `seats` and updates `buses.seats` via `jsonb_set` to toggle the seat status for the given seat id. Example code resides in: `src/app/api/bookSeat/route.ts` which uses a Zod schema to validate and a Drizzle transaction to update both the `seats` and `buses` table. Another example is the admin bus creation code under `src/app/api/admin/addBus/route.ts` which generates the `seats` JSON map from the model `data` property and saves it in the created bus row.

Screenshots

This document references the UI pages such as `/dashboard/booking` which presents a seat map and booking flow, and admin pages under `/admin` which present forms for creating models, buses, and boarding points. Screenshots are best created using a local seed or by running the `pnpm db:studio` and populating minimal data; take an image of the seat map with an available seat highlighted and another image of the admin model creation form to visually document the core workflows.

Chapter 1: INTRODUCTION

BusMate provides a modern solution to campus bus seat booking that combines a rich web interface with a scalable server and database backend. The application allows students to register, choose a boarding point, view routes and individual bus seat layouts, and book seats. Administrators can add boarding points, define bus models with flexible seat layouts, create buses, and map routes and arrival times to boarding points. The application is built with Next.js and follows a modular, server-driven architecture where server endpoints are implemented as Next.js App Router handlers combined with Drizzle ORM for database operations, and a Tailwind CSS UI stack for the client.

Problem Description

Traditional campus transportation booking systems often rely on manual operations and fragmented tools that are error-prone and do not scale well as the number of users and routes grows. These systems typically lack an intuitive seat map, do not provide role-based management interfaces for admins, and fail to enforce booking constraints like gender-aware seat allocation rules. In addition, the data management for such systems is often spread across multiple spreadsheets and manual records which makes auditing and recovery difficult.

Objective of the Project

The primary goal of BusMate is to provide a fully functional, automatable, and auditable seat booking platform for campus transportation that supports user self-service booking and admin operations. This includes providing a clear user registration and validation flow, a visual seat map with live seat availability, an API-driven backend to enforce booking rules and maintain transactional consistency, and an administration layer for defining bus layouts, adding boarding points, and managing fleet schedules. Combined, these goals deliver a robust experience and inject operational efficiency into how campus transport is managed.

Scope of the Project

This document focuses on the design and implementation of the web application backend and frontend with attention on core functional areas such as user management, seat booking, bus and route configuration, and admin features for managing models and boarding points. The system intentionally remains limited to essential operational features for the bus booking flow and admin management, defers advanced features like payment integration or real-time fleet telemetry, and opts for a privacy-preserving, simplified OTP flow in its demo mode. The data model ensures that important referential constraints are enforced at the database layer and that seat status can be queried efficiently via a JSON map on the bus entity.

Chapter 2: SYSTEM REQUIREMENT SPECIFICATIONS (SRS)

Functional Requirements

The system must provide a registration and login flow with email and password support and a demo OTP validation to confirm user intent. The booking flow should enable registered users to select their boarding point, list buses for a chosen boarding point, inspect a visual seat layout for a selected bus, and reserve an available seat. Admin users must be able to create and manage boarding points, add and edit seat models that define seat layouts, create and manage buses including mapping schedules to boarding points, and inspect user bookings. The system must provide REST API endpoints for listing boarding points, listing buses by boarding point, getting detailed bus information including the seat layout, booking seats with transactional consistency, and admin endpoints for managing models, buses, and boarding points. The system must store seat bookings in both a `seats` table and a `buses.seats` JSON map to ensure both transactional integrity and efficient lookup by seat id.

Non Functional Requirements

The system should be responsive and support common mobile and desktop browser sizes to ensure passengers can book seats from phones and web clients. The backend should provide consistent API performance with typical response times under a few hundred milliseconds under normal load, while ensuring that database transactions for booking remain atomic. The implementation must be secure by storing hashed passwords for credentials, validating inputs via Zod schemas, sanitizing parameters before database operations, and while demo OTP is present, the system should support integration with secure email OTP solutions in production. Monitoring and analytics should be optionally configurable via PostHog, and logs should capture error detail for debugging while avoiding leaking sensitive user data.

Hardware Requirements

The primary hardware requirement is a server or container environment that can host Node.js 22+ capable of handling moderate traffic of authenticated users with a database backend, and optional worker processes for background tasks. A Postgres server is needed to store data and can be hosted as a managed service or locally in Docker and should provide minimal resource footprints such as 1-2 vCPU and at least 2-4 GB RAM for development and small production deployments. Optionally the system can use Redis for caching and session data which benefits from persistent memory and low-latency network links between the application and Redis instance.

Software Requirements

The application uses Next.js 15 with the App Router and React 19 which require Node.js 22 or above. The build relies on `pnpm` as the package manager and Drizzle ORM for schema migrations and interactions with a PostgreSQL database. The developer environment should also include TypeScript, Tailwind CSS, and ESLint/Prettier for code quality, and optionally Drizzle Studio or `pnpm db:studio` for interacting with the database during development.

User Characteristics

Typical users of the system are students who register using their institutional information and a password, with optional demographics like gender to apply seat allocation rules. Admin users include staff who manage boarding points, models, and buses; they require elevated privileges and access to admin pages for creation and inspection of data. Developers and operators are typically expected to run Drizzle commands for schema management and to have the appropriate environment variables in place for database, email, and analytics for local development and production.

Constraints

The application must be deployed in environments where the database and optional Redis services are accessible to the server, and where environment variables with sensitive values such as `AUTH_SECRET` and database credentials are securely stored. The app currently uses a demo OTP flow and simple credential-based login for development, and production systems should replace the demo OTP and enforce stricter security controls. Some external services like SMTP for mail delivery may require secure setup and may not be available in developer local environments.

Chapter 3: ANALYSIS AND DESIGN

Use Case Model

The primary actors of the system are Students, Admins, and System Operators. Students interact with the system to register, sign in, manage their profile, select a boarding point, view buses, and book seats using an interactive seat map. Admins manage the data that makes booking possible: they define boarding points, create seat models that define bus layouts, add buses and map schedules to boarding points, and inspect user bookings and reports. The System Operator ensures that the application is deployed, the database is maintained, and that analytics and error monitoring are configured.

Use Case Description

The register use case involves clients presenting their details via the registration UI on `/auth/register`, the client sending the payload to `/api/register`, the server validating the data using `schemas/auth.ts`, and the server creating both a `user` and a matching `account` in a single transactional DB operation. The sign in use case is powered by NextAuth's Credentials provider which checks the `users` combined with `accounts` tables, issuing a JWT-based session if the credentials match. The seat booking use case requires the client to fetch a bus's model and seat layout from `/api/bus/<id>`, present the seat map via `src/components/bus/Bus.tsx`, and to call `/api/bookSeat` to persist the booking; this path also updates the `buses.seats` JSON map and inserts a row into the `seat` table within a transactional boundary to enforce consistency.

Activity Diagram

The booking workflow is driven by the activity of: load user profile, choose boarding point, list associated buses, select a bus and fetch its model plus seat JSON, select an available seat, then create the booking. These steps involve client side validation and UI updates via React and TanStack Query’s query caching while server changes are managed through `fetch` requests to the REST API and the server ensures atomic updates to the seat data and the bus JSON seat map. Failure handling is handled via HTTP responses and client-side UI messages, with unique constraint checks at the DB layer to detect double-booking attempts and provide appropriate error messages.

Class Diagram

The primary domain classes in the system map to the DB tables: User, Account, Bus, Seat, BusModel, BoardingPoint, and BusBoardingPoint. Each class holds attributes matching columns with relationships such as User has a foreign key to BoardingPoint and optionally a bus id, Seat references both User and Bus and uses the `seatStatus` enum to indicate state, while Bus keeps a `seats` JSON map, and models hold seat layout data in a `data` JSON column. The service-layer classes include BookingService which coordinates transactions and validations, ModelService for seat layout generation from the model schema, and AdminService for CRUD operations on models, buses, and boarding points.

Sequence Diagram

In the booking sequence, the client calls `GET /api/user/<id>` to retrieve a user's details and boarding point id, then calls `GET /api/bus/byBoardingPoint/<id>` to list candidate buses and `GET /api/bus/<busId>` to fetch the model and seats for the selected bus. After the user selects a seat, the client calls `POST /api/bookSeat` which validates session and input server-side, looks up the user by session ID, inserts a seat row into `BusMate_seat`, and updates the `buses.seats` JSON column using SQL `jsonb_set` within the same transactional operation. On success the server returns an acknowledgment and the client invalidates relevant TanStack queries to refresh UI state.

Collaboration Diagram

Objects in collaboration include the Client UI components, API routes, Services, and Database. The client UI triggers route calls and receives responses; the API layer coordinates authorization checks, input validation using `zod`, and calls into service classes that perform Drizzle ORM operations. The DB and the JSON seat map collaborate such that Seat rows exist for audit, while the `buses.seats` map serves quick lookups; both are updated within transaction boundaries to maintain consistency.

Component Diagram

The application separates concerns into clear layers: the UI Components layer handles rendering and client state using React and TanStack Query, the API layer (Next.js App Router handlers) handles HTTP contracts, validation, and authorization, the Service layer encapsulates domain logic such as booking transactions and bus/model generation, and the Data Access layer (Drizzle ORM) coordinates schema operations with PostgreSQL. Supporting components include the PostHog analytics instrumentation, the SMTP mailer, and Redis caching utilities which work alongside the primary stack to deliver operational functions.

Deployment Diagram

A typical deployment comprises an application container running Node 22+, a PostgreSQL instance for data persistence, and optionally a Redis instance for caching and session data. The `compose.yaml` demonstrates a working example for local development that runs the database in a container and the app in another container; environment variables such as `DATABASE_URL`, `AUTH_SECRET`, and `NEXT_PUBLIC_BASE_URL` must be configured for networked operation. The app can be deployed behind a reverse proxy and should store database and redis connections in networked services so that the Node app can reach them reliably.

Package Diagram

The codebase is organized into major folders such as `src/app` for top-level pages, `src/components` for UI elements, `src/server` for auth, db, mailer, and server-only utilities, `src/schemas` for input validation, and `src/server/db/schema` for Drizzle ORM table definitions. The package diagram groups these modules into the UI, API, services, and persistence layers and makes clear the separation of responsibilities for maintainability and testability.

Design Patterns Used

The application makes practical use of design patterns adapted for a web application context. The Data Mapper pattern is present through Drizzle ORM which translates domain models to database operations and vice versa, and Repository-style abstractions exist in service modules that encapsulate database logic. The application also uses the Singleton pattern for the DB client, and the Cache or Proxy pattern where Redis is used to speed up repeated reads or to offload session caching. Finally, the Strategy pattern occurs in the shape of provider-based auth configuration with NextAuth where different authentication methods can be added as providers.

GRASP Design Patterns

Responsibility assignment follows GRASP principles such as Controller and Creator. The Next.js HTTP handler acts as a controller that delegates domain responsibilities to service classes, and the Service layer also typically acts as a creator for domain objects resulting from composed operations such as seat booking. Low coupling and high cohesion are visible in the separation of API route concerns, business logic, and persistence responsibilities, and the use of typed schemas ensures that data validation responsibilities are assigned to an early, single source so that downstream services can assume sanitized inputs.

GoF Design Patterns

Examples of GoF patterns in practice include Singleton for the global DB client object and the factory-like logic that exists in creating seat JSON maps from a model definition to generate bus seat maps. The facade pattern is present in simplified service APIs that unify complex transactional behavior, such as the BookingService which hides the internal details of seating validation, transaction creation, and JSON updates behind a concise method. These patterns help maintain clean abstractions, reduce coupling, and centralize error handling for robust production behavior.


Chapter 1: INTRODUCTION

BusMate provides a modern solution to campus bus seat booking that combines a rich web interface with a scalable server and database backend. The application allows students to register, choose a boarding point, view routes and individual bus seat layouts, and book seats. Administrators can add boarding points, define bus models with flexible seat layouts, create buses, and map routes and arrival times to boarding points. The application is built with Next.js and follows a modular, server-driven architecture where server endpoints are implemented as Next.js App Router handlers combined with Drizzle ORM for database operations, and a Tailwind CSS UI stack for the client.

Problem Description

Traditional campus transportation booking systems often rely on manual operations and fragmented tools that are error-prone and do not scale well as the number of users and routes grows. These systems typically lack an intuitive seat map, do not provide role-based management interfaces for admins, and fail to enforce booking constraints like gender-aware seat allocation rules. In addition, the data management for such systems is often spread across multiple spreadsheets and manual records which makes auditing and recovery difficult.

Objective of the Project

The primary goal of BusMate is to provide a fully functional, automatable, and auditable seat booking platform for campus transportation that supports user self-service booking and admin operations. This includes providing a clear user registration and validation flow, a visual seat map with live seat availability, an API-driven backend to enforce booking rules and maintain transactional consistency, and an administration layer for defining bus layouts, adding boarding points, and managing fleet schedules. Combined, these goals deliver a robust experience and inject operational efficiency into how campus transport is managed.

Scope of the Project

This document focuses on the design and implementation of the web application backend and frontend with attention on core functional areas such as user management, seat booking, bus and route configuration, and admin features for managing models and boarding points. The system intentionally remains limited to essential operational features for the bus booking flow and admin management, defers advanced features like payment integration or real-time fleet telemetry, and opts for a privacy-preserving, simplified OTP flow in its demo mode. The data model ensures that important referential constraints are enforced at the database layer and that seat status can be queried efficiently via a JSON map on the bus entity.
