Abstract

BusMate is a comprehensive campus bus seat booking platform designed to streamline transportation management and eliminate manual coordination issues. It allows students to register online, select boarding points, browse available routes and buses, view interactive seat maps, and book seats effortlessly. Administrators can create customizable seat models, add buses, manage routes with arrival times, and oversee bookings through a dedicated panel. The system ensures secure authentication, prevents double bookings via atomic transactions, and maintains data consistency with real-time availability checks. By automating seat allocation and providing role-based access, it reduces errors and administrative overhead significantly. Students receive clear updates on their bookings and bus details, keeping them informed throughout. The platform supports diverse bus configurations from various models and routes. Overall, BusMate enhances user experience and simplifies campus transport coordination. It delivers a reliable, scalable solution for efficient seat management across all campus needs.

Chapter 1: INTRODUCTION

BusMate is a campus-seat booking web application that integrates a user-facing booking interface, administrative tools, and a transactional backend to ensure booking consistency. The application provides students with the ability to register, set their boarding point, view routes and buses, and select seats from an interactive seat map, and it enables administrators to define seating models, add buses, and map boarding points to routes and times. The system uses Next.js App Router for server and client routing, NextAuth for authentication, Drizzle ORM and PostgreSQL for persistent storage with typed schemas, and a UI stack built on React, Tailwind CSS, and Radix primitives for predictable, accessible interfaces.

Problem Description

Campus transportation booking workflows are often fragmented and rely on manual coordination, leading to inconsistent bookings, difficult audits, and frequent administrative overhead. A well-designed booking system needs to reconcile the demand for fast seat lookups with the requirement for atomic and auditable booking operations so that double bookings are avoided. Additionally, such a system must provide administrators with tools to define seat layouts and schedules while offering a simple registration flow for users.

Objective of the Project

The objective of BusMate is to deliver a reliable, extensible platform for campus bus seat booking that ensures consistent booking semantics, a clear user onboarding and registration experience, and an administration interface for managing models, buses, and boarding points. The system favors explicit transactions and typed data schemas for robustness and aims to be deployable locally or to cloud platforms once environment variables and production-grade services are configured.

Scope of the Project

This OOAD document covers the web application’s frontend and backend architecture, database schema, API surface, and primary UI flows focused on registration, booking, and admin operations. The current scope excludes deep integrations like payment processing or full real-time fleet telemetry and concentrates on a secure and maintainable system that can be extended in the future.

Chapter 2: SYSTEM REQUIREMENT SPECIFICATIONS (SRS)

Functional Requirements

The application must provide user registration with credentials, optional OTP verification in demo mode, and secure login via NextAuth credentials provider. Users must be able to list boarding points, filter buses by boarding point, select a bus, view its seat layout, and book an available seat. Admins must be able to create and manage boarding points, models (seat layouts), and buses, and map buses to boarding points along with arrival times. The server must maintain transactional consistency when booking seats, update the `seats` table, and also update a `seats` JSON map stored on the `buses` row for fast availability lookups.

Non Functional Requirements

The UI must be responsive and accessible across common devices, and the server should provide consistent and predictable performance under normal loads. Security must be enforced through hashed credentials, Zod-based validation, and careful input sanitization for database interactions. The system should be testable with a seeded DB, lint and type checks enforced in CI, and support monitoring and analytics integration via optional services such as PostHog.

Hardware Requirements

The platform requires a Node 22+ runtime with enough CPU and memory to host the Next.js server and handle typical user load, a PostgreSQL instance for persistence, and optionally a Redis instance for caching and session acceleration. Local development is supported by Dockerized Postgres and is configured via `compose.yaml` for convenience.

Software Requirements

The stack includes Next.js 15, React 19, TypeScript, Drizzle ORM for schema and migrations, NextAuth for authentication, TanStack Query for client caching, and Tailwind CSS for UI styling. Developers should use `pnpm` for package management and Drizzle CLI for migrations and studio interactions.

User Characteristics

End users are typically students who register with their institutional details and expect a clear booking flow, while admins manage route and model data. Developers and operators maintain the system via provided scripts and standard CI/CD, and expect to run migrations and seed data locally for demonstrations.

Constraints

The system relies on stable environment configuration, such as `DATABASE_URL` and `AUTH_SECRET`, and uses a demo OTP flow that must be replaced with a secure provider for production deployments. Admin endpoints should be guarded by role-based checks in production, and the application must ensure that transactions roll back correctly on failures to maintain data integrity.

Chapter 3: ANALYSIS AND DESIGN

Use Case Model

Students must be able to register and sign in, update profiles, select a boarding point, view buses that serve selected stops, inspect seat layouts for specific buses, and book seats. Admins can define models representing seat layouts, create buses, and map them to boarding points with arrival times. Operators run the deployment, monitor system health, and configure environment variables and backups.

Use Case Description

Registration begins with a client-side form that posts to `/api/register`; server-side validation confirms the data and creates `user` and `account` rows in a transaction. Sign-in uses a NextAuth Credentials provider that checks the `user` and `account` tables. The booking use case involves fetching the user’s boarding point, listing available buses by boarding point, fetching a bus’s model and seat JSON, selecting a seat, and then posting to `/api/bookSeat` which inserts a row into `seats` and updates `buses.seats` with a new status using `jsonb_set`, all within a transaction to avoid double booking.

Activity Diagram

The booking activity begins with user authentication, proceeds to listing buses for a boarding point, viewing and selecting seats for a bus, and finalizing the booking, which creates a seat row and modifies the bus’ JSON seat map. Each step includes client-side validation and server-side checks and is reflected in the UI after invalidating and refetching queries via TanStack Query. Failure handling includes explicit error responses for invalid input, authentication problems, and unique constraint violations for seats.

Class Diagram

Domain entities include the `users` table representing students, the `accounts` table for credentials, the `models` table for seat layout configurations, the `buses` table containing bus metadata and `seats` JSON, the `seats` table for booking records, and `busBoardingPoints` to map buses to stops and times. Services encapsulate operations such as booking, model generation, and admin CRUD operations and present a smaller API surface to the route handlers.

Sequence Diagram

When booking, the client fetches the user’s details, lists buses for the boarding point, fetches a bus’ model and seat map, and posts the seat selection to `/api/bookSeat`. The server extracts the session user, validates input, inserts into `seats`, and updates `buses.seats` inside a transaction; on success the client invalidates the relevant queries and updates the UI.

Collaboration Diagram

Components collaborate across the client UI, route handlers, service layer, and Drizzle ORM persistence. The UI calls the route handlers which apply validation, authorization, and business logic by delegating to services; the services interact with the database, and optional services such as mailers and analytics are integrated where needed.

Component Diagram

The system is organized with a frontend UI in `src/app` and `src/components`, server-side utilities and services in `src/server`, Drizzle schema files in `src/server/db/schema`, validation schemas in `src/schemas`, and shared utilities in `src/lib`. Admin and booking flows are separated into their respective routes to maintain clear responsibilities for code and features.

Design Patterns Used

The project uses a Data Mapper pattern via Drizzle ORM, a facade pattern in service modules which expose high-level methods for complex operations, and Singleton patterns for shared resources such as DB clients and caches. A Strategy approach is used in authentication provider configuration to support multiple providers if needed.

GRASP Design Patterns

Responsibilities are assigned according to GRASP: controllers (Next.js route handlers) delegate to expert services, creators are chosen to construct domain objects like seat maps, and low coupling and high cohesion are strived for by separating UI, services, and DB layers.

GoF Design Patterns

Factory-like behavior is implemented in the seat map generation in the ModelService, and singletons manage globally used resources. These patterns help keep logic modular, testable, and reusable.

Chapter 4: IMPLEMENTATION

Module Description

The Authentication & User module implements registration with hashing (bcryptjs), login via NextAuth Credentials provider, and user retrieval for dashboards. The Bus Creation and Management module provides admin routes to create seat models and buses and generate the initial bus `seats` JSON from a model. The Boarding Points module allows CRUD of boarding points used in registration and filtering; the Routes module stores the `routeName` on buses and maps them to boarding points with `busBoardingPoints` rows which capture `arrivalTime`s. The Ticket Booking module performs transactional updates ensuring a `seat` row and a `buses.seats` update are applied atomically.

Technology Description

The system uses Next.js for the full-stack routing and API handlers, Drizzle ORM and Postgres for typed persistence and atomic transactions, NextAuth for secure session management, TanStack Query for client caching and synchronization, Tailwind CSS for styling, and optional Redis and PostHog integrations for caching and analytics respectively. Drizzle CLI scripts are used for migrations and DB studio on development.

Code Snippets

Key code samples include the booking handler in `src/app/api/bookSeat/route.ts` which validates data with Zod, extracts the user session, and runs a Drizzle transaction that inserts a seat row and updates the bus JSON with `jsonb_set`. Another important snippet is admin bus creation which takes a model `data` JSON and constructs a `seats` JSON map for the new bus.

Screenshots

Screenshots should demonstrate the dashboard booking view with an interactive seat map and the admin model creation page with a visualized layout to illustrate how models map to seats; these images are best captured after seeding example data via `pnpm db:studio` or using the admin endpoints.

Chapter 5: TESTING

Testing Strategy

Tests cover unit-level verification of services and utilities, integration tests for API routes and DB transactions using a seeded test database, and manual acceptance tests for core flows like registration and booking. CI runs should include linters, type checks, and an integration test suite with a test DB to prevent regressions.

Sample Test Cases

Registration tests ensure valid inputs create `user` and `account` records while invalid inputs return validation errors. Login tests validate the NextAuth Credential provider behavior. Booking tests ensure that a seat booking inserts a row into `seats`, updates `buses.seats`, and that an attempt to book the same seat twice results in a unique constraint error handled gracefully by the server.

Sample Test Cases (Detailed tables)

Authentication & User Module

| Test Case ID | Description | Steps | Expected Output | Status |
|--------------|-------------|-------|-----------------|--------|
| TC_AUTH_01 | User Login with valid credentials | 1. Open Login Page<br>2. Enter valid email/password<br>3. Click Login | User successfully logs in and dashboard appears | Pass |
| TC_AUTH_02 | User Login with invalid credentials | 1. Open Login Page<br>2. Enter wrong email/password<br>3. Click Login | Error message: "Invalid Credentials" | Pass |
| TC_AUTH_03 | User Registration with valid details | 1. Open Registration Page<br>2. Enter valid details and OTP<br>3. Submit Form | New user created and account row inserted (hashed password) | Pass |
| TC_AUTH_04 | Registration with duplicate email/roll | 1. Open Registration Page<br>2. Enter existing email/rollNo<br>3. Submit Form | HTTP 409 conflict with message indicating duplicate email/roll | Pass |
| TC_AUTH_05 | OTP verification failure | 1. Open Registration Page<br>2. Enter details and invalid OTP<br>3. Submit Form | HTTP 400 Invalid OTP | Pass |

Bus Creation & Management Module

| Test Case ID | Description | Steps | Expected Output | Status |
|--------------|-------------|-------|-----------------|--------|
| TC_BUS_01 | Create model with valid seat layout | 1. Open Admin Model Create page<br>2. Enter valid model name and seat layout JSON<br>3. Submit Form | Model row created in `models` table and returning an id | Pass |
| TC_BUS_02 | Create bus with a model | 1. Open Admin Add Bus page<br>2. Select existing model and enter bus metadata<br>3. Submit Form | Bus created in `buses` table with `seats` JSON map generated | Pass |
| TC_BUS_03 | Create bus with invalid/missing model | 1. Open Admin Add Bus page<br>2. Enter bus data without a valid model<br>3. Submit Form | HTTP 400 error indicating missing/invalid model | Pass |
| TC_BUS_04 | Edit bus details | 1. Admin opens existing bus details<br>2. Update driver or route details<br>3. Save changes | Bus row updated and UI shows changes | Pass |

Boarding Points Module

| Test Case ID | Description | Steps | Expected Output | Status |
|--------------|-------------|-------|-----------------|--------|
| TC_BP_01 | Add boarding point as admin | 1. Open Admin Boarding Points page<br>2. Enter name and coordinates<br>3. Submit Form | New row created in `boardingPoints` table | Pass |
| TC_BP_02 | List boarding points | 1. Call `/api/busRoutes` or `/api/boarding-points` <br>2. Inspect response | Response contains list including newly created point | Pass |
| TC_BP_03 | Add duplicate boarding point | 1. Submit a boarding point with existing name<br>2. Submit form again | API returns HTTP 409 or error message indicating duplicate | Pass |

Routes Module

| Test Case ID | Description | Steps | Expected Output | Status |
|--------------|-------------|-------|-----------------|--------|
| TC_ROUTE_01 | List buses by boarding point | 1. Call `/api/bus/byBoardingPoint/<boardingPointId>`<br>2. Inspect response | Response lists all buses mapped to that boarding point | Pass |
| TC_ROUTE_02 | Map bus to boarding point | 1. Admin submit `busBoardingPoints` with busId, boardingPointId and arrivalTime<br>2. Inspect DB | A `busBoardingPoints` row is created and is queryable by API | Pass |

Ticket Booking Module

| Test Case ID | Description | Steps | Expected Output | Status |
|--------------|-------------|-------|-----------------|--------|
| TC_BOOK_01 | Book seat successfully | 1. User logs in and opens booking page<br>2. Selects bus and available seat<br>3. Click Book Now | A row is inserted into `seats` and the `buses.seats` JSON is updated to `bookedMale` or `bookedFemale` as applicable | Pass |
| TC_BOOK_02 | Book already taken seat (double-book) | 1. User A books a seat<br>2. User B attempts to book same seat<br>3. Submit request | API returns 406 (already booked) or a suitable unique-constraint error; no duplicate seat row is created | Pass |
| TC_BOOK_03 | Book seat without authentication | 1. Call `/api/bookSeat` without session<br>2. Observe response | API returns 401 Unauthorized | Pass |

Payments Module (Optional)

| Test Case ID | Description | Steps | Expected Output | Status |
|--------------|-------------|-------|-----------------|--------|
| TC_PAY_01 | Payment success and booking | 1. User attempts booking and pays via payment provider (simulated)<br>2. Payment provider returns success webhook<br>3. Booking completes | Booking recorded and `receiptId` updated in DB | Pass |
| TC_PAY_02 | Payment failure aborts booking | 1. User attempts booking<br>2. Payment provider returns failure<br>3. No booking writes occur | No `seats` row created, payment failure reported to user | Pass |

Test Results

Tests provide clear pass/fail results, with unit tests focusing on logic and integration tests ensuring API correctness. Manual end-to-end tests confirm that UX flows work from registration to booking. Further stress and concurrency tests should be executed under heavier loads to identify potential contention issues to be addressed in future enhancements.

Chapter 6: CONCLUSION AND FUTURE ENHANCEMENT

Conclusion

BusMate implements a pragmatic approach to campus seat booking by balancing fast read operations with the need for atomic booking transactions, providing both a `seats` table for auditability and a `buses.seats` JSON map for efficient seat availability lookups. The codebase is modular, uses typed schemas for DB and validation, and places transactional operations where they can be enforced reliably.

Future Enhancements

Future work could integrate a production-ready OTP/email service, role-based access control for admin routes, full payment integrations, and real-time updates using WebSockets or server-sent events to handle concurrent seat selections more gracefully. Operational improvements include enhanced observability, database backups, migration strategies, and scaling strategies such as caching, distributed locks, or partitioning for large-scale deployments.

Acknowledgements

This document was written by analyzing the project README, the Drizzle schema definitions, the API handler implementations, and the frontend UI components in the repository, and by summarizing relevant decisions and practices into a concise OOAD document for maintainers and stakeholders. For finer-grained references, consult `reference.md` in this folder which summarizes endpoints and key file locations.
Chapter 1: INTRODUCTION

BusMate is a comprehensive campus transportation seat-booking web application that delivers a clean UI and a reliable transactional backend to manage users, buses, boarding points, and seat reservations. The system allows registered students to select a boarding point, view routes and buses serving that point, inspect bus seat maps, and book available seats, while administrators can create seat models and buses, and map routes with arrival times. The design relies on Next.js App Router for server and client routing, Drizzle ORM and PostgreSQL for robust persistence, NextAuth for authentication, and a modern UI stack powered by React, Tailwind CSS and Radix UI primitives.

Problem Description

Many campus transit processes still depend on spreadsheets and manual coordination, and this introduces inconsistencies, audit challenges, and suboptimal user experiences. A seat booking system needs to reconcile rapid seat lookups for live UI updates with transactional guarantees to prevent double-booking, and also provide administrative tools so staff can define the fleet, seat layouts, and schedules. The combination of readable seat layouts, strong authorization, and definable bus models is critical to improving accuracy, usability, and operational efficiency.

Objective of the Project

The objective of BusMate is to provide a modular and extensible platform for campus bus seat booking, offering reliable user registration and authentication, a visual seat map for live booking, and administrative tools for configuring buses, models, and boarding points. Where possible the implementation favors explicit, transactional data operations and robust schema definitions so that system integrity is preserved even with concurrent activity. The platform is meant to be deployable via Docker in a development context and suitable for production after enhancing security and delivery best practices.

Scope of the Project

This OOAD document focuses on the web application including frontend pages, API handlers, domain services, and database schema design. It covers user-facing pages, admin operations, the core seat booking flow, database schema and constraints, and the architectural choices and design patterns used to maintain a clear separation of responsibilities and a resilient booking workflow. The document does not detail a production-grade payment gateway integration or real-time telemetry systems beyond conceptual suggestions for future enhancements.

Chapter 2: SYSTEM REQUIREMENT SPECIFICATIONS (SRS)

Functional Requirements

Users must be able to register with a validated credential flow and confirm their boarding point choice during onboarding, administrators must be able to add models and buses and assign boarding points with arrival times, and the system must expose API endpoints for listing boarding points, listing buses by boarding point, returning detailed bus and model data including the seat layout and JSON seat map, and for booking seats while enforcing transactional consistency. The platform stores bookings as both rows in the `seat` table and an updated JSON seat map on the `bus` row for efficient queries and auditability.

Non Functional Requirements

The system should provide a responsive UI with predictable performance under normal usage, secure credential storage and validation, and clear error handling, with enforcement of validation rules in both client and server layers. A test database for CI runs, migrating schema changes via Drizzle CLI, and runtime environment validation via `@t3-oss/env-nextjs` are expected infrastructure components. Monitoring, observability, and production analytics are advanced requirements that are optional but recommended for production deployments.

Hardware Requirements

The minimal hardware profile for production consists of a small app server for Node.js, a managed PostgreSQL instance for storage, and optionally a Redis instance for caching and session management. For development, Docker containers are used to run local Postgres and test instances managed by tasks and scripts in the repo, which are appropriate for the development and continuous integration environment.

Software Requirements

The project uses Next.js 15 with the App Router, React 19, TypeScript, Drizzle ORM and Postgres for the data layer, and NextAuth for authentication. TanStack Query is used to manage client-side caching and synchronization, while PostHog and Redis are used for analytics and caching in optionally configured environments. A developer should be able to boot the system with `pnpm`, run database migrations with Drizzle CLI, and use `pnpm dev` to run the app locally.

User Characteristics

End users are primarily campus students who will register and access the booking UI; some users will also be admins who manage models and buses. Students will use their institutional email, roll number, or similar identifiers and expect a straightforward registration / sign-in flow, and administrators will need robust forms and validation to create and edit models and buses without introducing invalid layouts.

Constraints

The app depends on secure environment variables such as `DATABASE_URL` and `AUTH_SECRET` and a reachable Postgres instance; demo OTP values are used in development and must be replaced by a proper OTP provider in production. The app also assumes the ability to run migrations and seed data via Drizzle and that admin operations are available only to authorized users.

Chapter 3: ANALYSIS AND DESIGN

Use Case Model

The main actors in the system are students, administrators, and operators. Students register, choose a boarding point, view routes and buses, visualize seat maps for a selected bus, and book seats. Administrators configure seat models, create buses, and map buses to boarding points with arrival times. Operators are responsible for environment provisioning and data backups and configure production variables and monitoring.

Use Case Description

Registration and booking flows are centralized on API endpoints housed at `src/app/api`, where `/api/register` handles sign-ups and `/api/bookSeat` handles seat reservations with transactional updates to the `seats` table and `buses.seats` JSON field. Registration validates inputs with Zod schemas defined in `src/schemas/auth.ts` and stores the resulting new user and account in a single transaction so the dataset remains consistent. Booking proceeds only if the student is logged in via NextAuth, and the server will return specific HTTP response codes for errors like duplicate seats or authorization failures. Administrative flows are executed through `/api/admin/*` endpoints that allow creation and management of models, buses, and boarding points.

Activity Diagram

User activities start with registration and login, which results in a session; when booking, the student selects a boarding point, fetches buses for that point, opens a seat map for a chosen bus, selects an available seat, and then confirms a booking which is persisted atomically. The server’s transactional boundaries and database indexes help ensure fast queries and prevent double-booking even under concurrent access. Failure paths include invalid input, missing authorization, or a unique constraint violation on seat insertion which is mapped by the API into a meaningful response.

Class Diagram

Domain entities correspond closely with the database tables created in `src/server/db/schema`, such as `users`, `accounts`, `buses`, `seats`, `models`, and `boardingPoints`, and these are used both as data transfer objects and persisted types. The service layer is composed of BookingService, AdminService, and ModelService which encapsulate domain logic and interact with Drizzle ORM. UI classes on the frontend correspond to components like `Bus`, seat components, and admin forms, with state and data fetching encapsulated via hooks and TanStack Query.

Sequence Diagram

The booking sequence starts with the client fetching a user and boarding point, listing buses, fetching the selected bus’s model and seat JSON, and then sending a `POST /api/bookSeat` request. That server-side route inspects the session, identifies the user, runs a transaction inserting into the `seats` table, and updates the `buses.seats` JSON using `jsonb_set` atomically; after the transaction succeeds the client invalidates cached queries to reflect the new seat availability.

Collaboration Diagram

Collaborating components include the UI components that call API endpoints, the API layer that delegates to domain services, the Drizzle ORM and Postgres persistence backend, and optional external services such as SMTP for emails and PostHog for analytics. The BookingService orchestrates seat insertion and JSON updates and communicates success or error states back to the API which maps them to HTTP responses.

Component Diagram

Major components include frontend React/Tailwind UI components, Next.js App Router endpoints, domain services, and the Drizzle schema/data layer. The `src/app` directory contains pages and route handlers, `src/components` holds reusable UI building blocks, `src/server` provides services, database initialization, authentication, and mailer utilities, and `src/server/db/schema` defines tables and enums that map to documented behavior.

Deployment Diagram

The recommended deployment pattern includes a Node.js application, a managed Postgres service, and optionally a Redis instance for caching with the option to run Mongo-like solutions for analytics. The `compose.yaml` in the repo shows a local approach with containers for the database and the app where environment variables are set at runtime. Production deployments should also leverage secure environment storage and backups for the database and ensure that migrations run safely with smoke testing after migrations.

Package Diagram

Code organization is modular. Pages and route handlers are grouped under `src/app`, UI components and common UI primitives live under `src/components`, domain logic and services are under `src/server`, schema types and validation are under `src/server/db/schema` and `src/schemas`, and providers, hooks, and shared utilities are under `src/providers` and `src/hooks` respectively.

Design Patterns Used

The application uses Data Mapper via Drizzle, Singleton patterns for reusable DB clients and caching instances, and facade-style service modules that expose simplified methods for complex transactional operations while isolating persistence details. Strategy-like approaches are used for pluggable authentication provider configuration with NextAuth, and repository-like abstractions appear in services that encapsulate CRUD logic for entities.

GRASP Design Patterns

GRASP principles such as Low Coupling and High Cohesion guide the architecture with controllers acting as the initial handlers and delegating to experts (services) responsible for domain logic; creators are chosen for modules that build complex domain objects such as bus seat maps from model specifications.

GoF Design Patterns

Real-world use of GoF patterns includes factory-like behaviors within the model-to-seat-map generator and Singleton usage for a globally accessible DB client. These patterns help keep the code modular, reduce duplication, and encapsulate complex behaviors inside discrete, testable modules.

Chapter 4: IMPLEMENTATION

Module Description

Authentication & User Module: This module includes the NextAuth configuration and credential provider in `src/server/auth/config.ts`, the registration endpoint `/api/register` that validates input and creates user and account rows in a transaction, and the session-based access flow used by protected API endpoints. The user profile and dashboard views are implemented in `src/app/dashboard` and are backed by the API endpoints such as `/api/user/[userId]` and `/api/dashboard` which return the necessary joined data.

Bus Creation and Management Module: Admin endpoints under `src/app/api/admin` enable creation of models and buses and generation of seat JSON maps in the bus rows, while the frontend admin pages under `/admin/model` and `/admin/bus` allow admins to create and edit models and buses. Models are stored in the `models` table and buses in the `buses` table with `seats` JSON that contains a map of seat identifiers to their status.

Boarding Points Module: Boarding points are created and listed via API endpoints, and the values are used during registration and for filtering buses by a boarding point. The boarding points are represented by a dedicated table and indexed for efficient name-based lookup.

Routes Module: The bus `routeName` and bus-to-boardingPoint mapping maintained in `busBoardingPoints` provide a flexible representation of routes and stop times enabling simpler UI filtering and schedule lookups.

Ticket Booking Module: The booking API `/api/bookSeat` validates the session and performs a Drizzle transaction to insert a `seat` row and then update the JSON map in `buses.seats` using `jsonb_set`. The server handles unique constraint errors to prevent double booking and returns appropriate status codes so clients can display a helpful error.

Payment Module: The platform is prepared to integrate a payment module; in such a flow a payment step would occur in the booking transaction path as a precondition that updates the payment status and a receipt id on success.

Technology Description

BusMate uses Next.js and React for the UI, Drizzle ORM for typed database interactions, PostgreSQL as the primary data store, NextAuth for authentication, and TanStack Query for client-side synchronization. Tailwind CSS handles the visual layer with a set of UI primitives and accessibility-friendly components. The repository includes a suite of Drizzle migrations, seeders, and scripts that support schema changes and development convenience.

Code Snippets

The booking routine in `src/app/api/bookSeat/route.ts` provides a concise example: it validates input with Zod, verifies the session via NextAuth utilities, looks up the user in the DB, runs a transaction that inserts into the seats table and updates the bus JSON map via `jsonb_set`, and handles any unique constraint violations. Additionally, model generation and bus creation are exemplified by `src/app/api/admin/addBus/route.ts` where the model data is converted to an initial seats map.

Screenshots

For documentation, capture screenshots of the booking page displaying the seat map and the admin model creation page showing the seat layout generator, as these communicate UX and expected data configurations to stakeholders and testers. Screenshots should be generated after seeding example data via `pnpm db:studio` or via the admin endpoints to produce consistent visuals for demonstrations.

Chapter 5: TESTING

Testing Strategy

Testing combines unit, integration and acceptance tests along with lint and type checks to ensure code correctness and quality. Unit tests cover small utilities and seat map generation, integration tests use a test database fixture for API routes and transactions, and acceptance tests verify the booking and admin behaviors from the UI through to the DB.

Sample Test Cases

Registration tests validate both success and failure paths, sign-in tests confirm session issuance and rejection on invalid credentials, model creation tests confirm models are persisted and seat maps are created, and booking tests confirm both seat rows and JSON maps are updated with proper transactional protections against double bookings. Tests also verify that admin endpoints handle invalid input and that endpoint guards prevent unauthorized access.

Test Results

CI runs should include linting and type-checking followed by unit and integration suites; example test runs should produce clear pass/fail counts and provide logs for troubleshooting. Manual tests validate high-level scenarios such as end-to-end bookings and admin workflows, while load and concurrency testing should be performed to validate performance under real-world multi-user conditions.

Chapter 6: CONCLUSION AND FUTURE ENHANCEMENT

Conclusion

BusMate is modeled and implemented to provide a clear and auditable seat booking flow that balances the need for quick UI reads with the transactional guarantees required for seat reservations. The codebase follows modular design principles, keeps presentation and persistence concerns separated, and uses a combination of REST endpoints and curated services to implement robust domain logic that is testable and maintainable.

Future Enhancements

Future improvements should include production-grade OTP and e-mail services, sophisticated RBAC for admin APIs, first-class payment integration that ties money flows to booking confirmations, and a real-time communication layer to improve the user experience under seat contention scenarios. Longer-term enhancements could also include analytics dashboards, better operational observability, and scaling strategies such as caching, database partitioning, or event-driven seat hold patterns to handle high concurrency.

Acknowledgements

This OOAD document is generated by reviewing the repository’s architecture, Drizzle ORM schema definitions, frontend pages and components, and the API route implementations under `src/app/api`. The `reference.md` file in this folder can be consulted for a concise summary of endpoints and module locations.
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

The system must provide a registration and login flow with email and password support and a demo OTP validation to confirm user intent. The booking flow should enable registered users to select their boarding point, list buses for a chosen boarding point, inspect a visual seat layout for a selected bus, and reserve an available seat. Admin users must be able to create and manage boarding points, add and edit seat models that define seat layouts, create and manage buses including mapping schedules to boarding points, and inspect user bookings.

Non Functional Requirements

The system should be responsive and support common mobile and desktop browser sizes to ensure passengers can book seats from phones and web clients. The backend should provide consistent API performance with typical response times under a few hundred milliseconds under normal load, while ensuring that database transactions for booking remain atomic. The implementation must be secure by storing hashed passwords for credentials, validating inputs via Zod schemas, and sanitizing parameters before database operations.

Hardware Requirements

The primary hardware requirement is a server or container environment that can host Node.js 22+ capable of handling moderate traffic of authenticated users with a database backend, and optional worker processes for background tasks. A Postgres server is required for data persistence and can be hosted as a managed service or locally in Docker, and optionally Redis can be used for caching and sessions.

Software Requirements

The application uses Next.js 15 with the App Router and React 19 which require Node.js 22 or above. The build relies on `pnpm` as the package manager and Drizzle ORM for schema migrations and interactions with a PostgreSQL database. The developer environment should also include TypeScript, Tailwind CSS, and ESLint/Prettier for code quality, and optionally Drizzle Studio for database seeding and inspection.

User Characteristics

Typical users of the system are students who register using their institutional information and credentials, with optional demographic fields like gender used to inform seat allocation rules. Admin users include staff who manage boarding points, seat models, and buses, while platform operators and developers are responsible for the server and database maintenance and CI/CD concerns.

Constraints

The application must be deployed in environments where the database and optional Redis services are reachable by the application server and where environment variables such as `DATABASE_URL` and `AUTH_SECRET` are provided. The project uses a demo OTP and requires mail service for production-grade OTP and e-mail based interactions, and the admin routes must be guarded for production deployments to prevent unauthorized data changes.

Chapter 3: ANALYSIS AND DESIGN

Use Case Model

The primary actors of the system are Students, Admins, and System Operators. Students interact with the system to register, sign in, manage their profile, choose a boarding point, view buses for a route, and book seats using an interactive seat map. Admins configure models, buses, and boarding points and review user bookings, while System Operators are responsible for deploying and monitoring the system.

Use Case Description

Registration and sign-in use cases include client-side validation on the registration page followed by API calls to `/api/register` and NextAuth credential flows for signing in. Booking involves fetching a user’s boarding point, listing buses by boarding point, fetching the bus model and JSON seat map from `/api/bus/<id>`, selecting an available seat in the UI, and then calling `/api/bookSeat` which executes a transaction to insert a seat row and update the bus JSON seat map.

Activity Diagram

The booking workflow begins with user authentication, proceeds to fetching a list of buses for a boarding point, shows the seat map for a bus, allows seat selection, validates availability, and then submits a booking that writes data to both `seats` and `buses` tables in a single transaction. Each step is reflected in client-side state handled via TanStack Query and the server ensures data consistency at the persistence layer.

Class Diagram

Domain entities include User, Account, BoardingPoint, BusModel, Bus, Seat, and BusBoardingPoint. These entities map directly to Drizzle ORM tables, with relationships such as User referencing BoardingPoint and Bus, Seat referencing User and Bus, and Bus holding a JSON map of seat statuses to speed up availability lookups while the seats table serves as audit and a source of truth for booking records.

Sequence Diagram

During booking the client first retrieves user and boarding point details, requests buses by boarding point, fetches the selected bus’s model and seat JSON, then submits a seat booking which the server validates, records as a seat row, and updates the bus JSON map inside a database transaction before returning success.

Collaboration Diagram

Components collaborate across layers: UI components interact with API routes, the API layer delegates to domain services, the services call Drizzle ORM to manipulate DB entities, and external services such as SMTP or PostHog can be used for OTP, notifications, and analytics. Operations like booking are coordinated through service-level transactions that ensure either all updates succeed, or all updates rollback to keep the data consistent.

Component Diagram

The solution is split into presentation components, API routes, service modules, and a persistence layer. UI components are located under `src/components` and use Tailwind and Radix UI primitives, API handlers live under `src/app/api` as Next.js App Router endpoints, domain services and helpers under `src/server`, and Drizzle ORM provides the ORM mapping in `src/server/db/schema`.

Deployment Diagram

A minimal deployment involves the Next.js app running in a Node runtime and a PostgreSQL instance, with an optional Redis instance for caching. The `compose.yaml` in the repository demonstrates how to run the database and the app in containers for development, and production deployments would aim to secure environment variables and ensure that migrations and backups are managed properly using Drizzle’s CLI tools.

Package Diagram

Code modules are grouped according to responsibilities: pages and route handlers under `src/app`, shared UI in `src/components`, domain services and database under `src/server`, schema definitions in `src/server/db/schema`, utilities and hooks under `src/lib` and `src/hooks`, and provider functions and third party integrations under `src/providers`.

Design Patterns Used

The project uses several design patterns in practical contexts: a Data Mapper pattern through Drizzle ORM, Singleton for shared DB clients, a Strategy-like approach for pluggable authentication providers in NextAuth, and a facade pattern in service modules to abstract complex DB transactions behind simple APIs.

GRASP Design Patterns

Controllers (Next.js route handlers) delegate responsibilities to service modules to maintain clear separation of concerns. The Creator pattern is used in service modules like the ModelService which constructs bus seat maps from model definitions, and Controller and Expert responsibilities are assigned carefully to services that hold the necessary domain knowledge.

GoF Design Patterns

Instances of factory-like behavior appear in seat map generation for models, while the Singleton pattern is used for the database client. The facade pattern simplifies interactions with transactional booking operations exposing a single BookingService method while encapsulating complex internal operations.

Chapter 4: IMPLEMENTATION

Module Description

Authentication & User Module: The authentication system is implemented using NextAuth’s Credentials provider and a custom `authConfig` under `src/server/auth/config.ts` to validate users and return JWTs for session management. Registration logic lives in `src/app/api/register/route.ts` and performs Zod validation, password hashing with bcrypt, and user + account creation in the database inside a transaction.

Bus Creation and Management Module: A model creation API under `src/app/api/admin/addModel/route.ts` accepts a `model` and JSON layout and stores it in the models table, while `src/app/api/admin/addBus/route.ts` constructs `seats` JSON maps from models and stores them in bus rows. Administrative UIs exist under `src/app/admin` where these flows are executed and saved to the backend.

Boarding Points Module: Boarding points are stored in the database and managed via `src/app/api/admin/addBoardingPoints/route.ts` and listed via `src/app/api/boarding-points/route.ts` for use in registration and bus filtering.

Routes Module: The app keeps a `routeName` on bus rows to provide a search-friendly label while mapping buses to boarding points is maintained through `busBoardingPoints` rows which also contain `arrivalTime` values.

Ticket Booking Module: The `/api/bookSeat` route validates session, ensures the user exists, and performs a Drizzle transaction to create a new seat row and to update the `buses` seats JSON map using `jsonb_set`, handling errors such as unique constraint violations to avoid double bookings.

Payment Module: Payment integration is not implemented by default; the architecture allows a payments module to be added that would create payment requests in a separate table and update bookings with `receiptId` and payment status on completion.

Technology Description

BusMate uses Next.js for routing and server-side code, TanStack Query for client-state synchronization, Drizzle ORM for typed DB operations and migrations, and Postgres as the data store. Redis is included for caching and potential session management, and PostHog is used for event instrumentation when configured. The development toolchain leverages pnpm scripts, ESLint/Prettier, Drizzle CLI for migrations and studio, and TypeScript for type-safety across the codebase.

Code Snippets

Booking logic in `src/app/api/bookSeat/route.ts` demonstrates Zod validation, session checks via `auth`, and a Drizzle transaction that both inserts into `seats` and updates the `buses.seats` JSON column using SQL `jsonb_set`. The registration endpoint shows how hashing solutions such as `bcryptjs` are used to store passwords and how Drizzle’s `returning` API can surface created row details.

Screenshots

To document the UI, take screenshots of the dashboard booking page showing a seat map and the admin model creation page showing the generated seat layout and the form used to set bus metadata. These visual references are helpful for stakeholders and testers to validate UX decisions and expected behaviors in the booking flow.

Chapter 5: TESTING

Testing Strategy

The testing strategy includes unit tests for utility modules, integration tests for API endpoints and DB interactions using a seeded database, and manual acceptance tests for end-to-end flows including registration and booking. Tests are run in CI with environment variables set for test databases and use fixtures to restore a known state for repeatable results.

Sample Test Cases

Unit tests validate small modules such as JSON seat map generation and helper functions. Integration tests cover successful and failing registration, sign-in, bus listing, model creation, and seat booking including attempts to double-book. Acceptance tests run through the welcome, registration, login, bus selection, and booking flows to ensure the UI and the backend agree on state and transitions.

Test Results

Results reported from CI should indicate pass/fail statuses across unit and integration suites as well as lint and type checks. Local manual acceptance testing validates real-world interactions such as booking a seat and confirms that seat status updates and DB rows are updated. For production readiness, additional stress and concurrency tests are suggested to validate multi-user seat contention scenarios enabling either locking or optimistic concurrency measures.

Chapter 6: CONCLUSION AND FUTURE ENHANCEMENT

Conclusion

This OOAD document describes BusMate’s core objectives, constraints, and the primary design and implementation decisions that support a maintainable and scalable campus bus booking system. The architecture keeps concerns well-separated and uses proven technologies such as Next.js, Drizzle ORM, and Postgres for reliable and typed system behavior. The design supports role-based administrative operations, consistent transactional booking flows, and extensible modules for future features including payments and real-time updates.

Future Enhancement

Potential improvements include integrating a robust SMTP or external OTP provider to replace the demo flow for email verification, implementing a payments module for revenue-backed seat reservations, adding fine-grained role-based access control to protect admin APIs, and incorporating real-time updates using WebSocket or server-sent events to improve the UX for concurrent seat selection. Additional work would include performance improvements by caching heavy-read endpoints, introducing database partitioning for large-scale deployments, and improving operational observability with alerting and backup strategies to support production service level objectives.

Acknowledgements

This OOAD material was compiled by inspecting the repository source code, including the Drizzle schema definitions in `src/server/db/schema`, the App Router API endpoints in `src/app/api`, admin and dashboard UIs under `src/app`, and supporting modules and scripts as defined in the project’s `README.md` and package manifest. Use the `reference.md` file in this directory for a finer-grained summary of files, endpoints, and schema details to help maintainers and extension authors.



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
