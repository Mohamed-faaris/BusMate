Abstract

BusMate is a comprehensive campus bus seat booking platform designed to streamline transportation management and eliminate manual coordination issues. It allows students to register online, select boarding points, browse available routes and buses, view interactive seat maps, and book seats effortlessly. Administrators can create customizable seat models, add buses, manage routes with arrival times, and oversee bookings through a dedicated panel. The system ensures secure authentication, prevents double bookings via atomic transactions, and maintains data consistency with real-time availability checks. By automating seat allocation and providing role-based access, it reduces errors and administrative overhead significantly. Students receive clear updates on their bookings and bus details, keeping them informed throughout. The platform supports diverse bus configurations from various models and routes. Overall, BusMate enhances user experience and simplifies campus transport coordination. It delivers a reliable, scalable solution for efficient seat management across all campus needs.

Chapter 1: INTRODUCTION

Overview

BusMate is a campus seat-booking web application that integrates a user-facing booking interface, administrative tools, and a transactional backend to ensure booking consistency. The system is designed for clarity and practicality: students register and specify a boarding point, browse routes and buses that serve that point, view interactive seat maps rendered from model definitions, and reserve seats. Administrators can define seat models that capture diverse bus layouts, create buses based on those models, and map buses to boarding points with arrival times and metadata. The architecture emphasizes typed schemas, explicit validation, and clear service boundaries so that front-end interactions map predictably to server APIs and persisted state.

Additional Context and Deployment Scenarios

BusMate is intended to be deployable to typical Node.js hosting environments and container platforms. For small-scale campus deployments, a single Node instance with a managed Postgres database suffices. For larger campuses, deployment patterns include container orchestration with multiple Node replicas behind a load balancer, a managed Postgres cluster with read replicas for scaling read-heavy endpoints, and an optional Redis cache layer. The document assumes a CI/CD pipeline which runs linting, type checks, and integration tests against a throwaway test database before promoting releases.

User Personas and Priorities

Primary personas include students prioritizing quick, mobile-friendly booking flows; administrators prioritizing data accuracy and ability to model complex buses; and operators prioritizing deployability and observability. Each persona drives different trade-offs: students need responsive client reads, admins need strong validation for model and bus creation, and operators need clear logs and migration practices. The design choices in BusMate aim to balance these priorities while keeping the codebase approachable for contributors.

Motivation and Context

Campus transportation systems typically suffer from fragmentation: maintenance of spreadsheets, ad-hoc phone reservations, and manual seat allocations result in lost records and booking conflicts. BusMate was conceived to solve these issues by offering a lightweight but robust system that enforces booking constraints, tracks every booking as an auditable record, and provides administrative tools to configure fleet and routes. The platform is intended for university or large-campus deployments, but its modular design makes it adaptable for other private fleet operations.

Problem Description

The problem space involves balancing fast read operations for interactive seat maps with strict transactional writes that prevent double booking. Users expect immediate visual feedback about seat availability, while administrators require a reliable audit trail and the ability to model complex seat arrangements. The system must handle concurrent booking attempts without returning inconsistent state or allowing duplicates, while also remaining responsive to normal user loads. Additionally, management requires administrative workflows that are simple and resilient to human error when defining models and buses.

Objective of the Project

The objective of BusMate is to provide a maintainable, extensible platform that delivers: reliable user registration and session management, a visually intuitive seat selection experience, transactional booking semantics that preserve data integrity, and admin tools to manage models, buses, and boarding points. The system should be runnable locally for development and deployable to standard cloud platforms with minimal changes, ensuring that migration and operational workflows are straightforward.

Scope of the Document

This OOAD document covers the system architecture, functional and non-functional requirements, analysis and design artifacts, implementation overviews, and a testing strategy. It is targeted at developers, testers, and maintainers who need a clear map of the system’s components and behavior. It does not contain detailed operational runbooks for production nor does it include the full set of migration scripts; those artifacts are maintained in the repository and can be referenced for operational details.

Chapter 2: SYSTEM REQUIREMENT SPECIFICATIONS (SRS)

Functional Requirements

The system shall support user registration and sign-in, including an optional demo OTP flow for non-production use. It shall permit users to select boarding points during onboarding and to view buses that serve those points. For each bus, the system shall provide a detailed seat layout and allow the user to reserve an available seat. Administrators shall be able to create and manage boarding points, define seat models as JSON structures describing rows and seats, create buses based on models, and map buses to boarding points with arrival times. The system shall persist bookings in a dedicated seats table and shall maintain a seats JSON map on each bus row for fast lookups and display generation. Booking operations must be atomic: the insert into the seats table and the update of the bus seats map must occur within the same transaction to prevent race conditions.

Use Scenarios and API Contracts

The main API endpoints include registration, sign-in, listing boarding points, listing buses by boarding point, fetching a bus’s detailed information (including model and seats map), and booking a seat. Admin APIs expose model creation, bus creation, and boarding point CRUD. Each endpoint must validate input data using a typed schema library to ensure predictable behavior. Responses should be structured with clear status codes and helpful error messages to allow the client to present actionable feedback to users.

Non-functional Requirements

Performance: The system should provide sub-second responses on read-heavy endpoints under normal physi-cal loads for campus deployments. Read endpoints for bus and seats should be optimized for quick client-rendering, leveraging JSON maps on the bus row to avoid expensive joins. Security: Passwords must be hashed, sensitive environment variables must be stored securely, and all inputs must be validated and sanitized. Observability: The system should expose meaningful logs and metrics integrated with optional analytics such as PostHog. Maintainability: Code must be typed and linted, and database migrations managed via Drizzle CLI.

Hardware and Software Requirements

Hardware: A Node.js 22+ runtime with moderate CPU and memory is required to host the Next.js application. A PostgreSQL instance provides persistent storage and should be sized according to expected concurrent users; Redis can be used optionally for caching. Software: Next.js App Router, React, TypeScript, Drizzle ORM, NextAuth for authentication, and Tailwind CSS for UI are core dependencies. The repository uses pnpm and Drizzle CLI to manage packages and migrations respectively.

User Characteristics and Accessibility

Primary users are students and administrative staff. The UI should be accessible and responsive; common accessibility standards (keyboard navigation, ARIA roles) must be respected in the interactive seat maps and admin forms. Admin users require higher privileges and a more information-dense interface, with form validation and preview features for models and seat layouts.

Constraints and Assumptions

The system relies on a functioning Postgres database and assumes the ability to run migrations and seed data in development. Demo OTP behavior is assumed for non-production deployments; a production system must integrate a secure SMTP or OTP provider. Admin endpoints must be protected by role-based checks in production environments.

Chapter 3: ANALYSIS AND DESIGN

Use Case Model and Actors

Actors: Student, Administrator, System Operator. Students register, select boarding points, view buses and seat maps, and book seats. Administrators create models, buses, and boarding points and manage bookings. System Operators are responsible for deployment, monitoring, database backups and migration strategies.

Use Case Details

Registration: Students fill a registration form, possibly choose a boarding point, and submit. The server validates input, creates a user record and an account record in a single transaction, and optionally sends an OTP for demo validation. Sign-in: Credentials are checked via a credential provider, which verifies the hashed password and produces a session token. Booking: The user selects a bus and seat; the client posts to a booking endpoint which checks session and seat availability, and then runs a transaction that inserts a booking record and updates the bus seats JSON map. Admin flows: Admins can preview a generated seat map after constructing a model and can create a bus which receives a generated seats map at creation time.

Activity Flows and Failure Modes

Activity flows must anticipate concurrency and failure modes. For booking, the common failure is a race where two users attempt the same seat nearly simultaneously. The server must rely on unique constraints and a transactional update to prevent duplicate seat rows; the API should map database constraint errors into meaningful HTTP responses indicating the seat is no longer available. Other failures include malformed input, expired sessions, or missing model references during bus creation; each maps to specific response codes and client-facing messages.

Domain Model and Class Responsibilities

Key domain entities include User, Account, BoardingPoint, Model, Bus, Seat, and BusBoardingPoint. Bus encapsulates the seats JSON field, which stores a mapping from seat identifiers to seat metadata including status and seat type. Models store a seat layout schema that can be transformed into a bus seats map by ModelService. BookingService coordinates the transactional creation of seat rows and JSON updates. AdminService handles CRUD for models, buses, and boarding points.

Sequence Diagram Narratives

Detailed sequences include the booking transaction, admin bus creation, and registration flows. Each sequence highlights the role of validation layers, service delegation, and transaction boundaries. For example, the booking sequence checks the user session, loads the bus and seats map, validates requested seat state, and executes a transaction that inserts a seat record then updates the bus seats map using jsonb_set operations in Postgres.

Component Decomposition

The application organizes code into a presentation layer (React, UI components), API routes (Next.js App Router endpoint handlers), service layer (domain logic and transactions), and persistence layer (Drizzle ORM schemas and queries). Supporting utilities include PostHog instrumentation, an SMTP mailer module used for OTP in production, and Redis-based caching helpers in environments where caching is beneficial. The separation helps testing and maintainability.

Design Patterns and Principles

The system uses Data Mapper (Drizzle ORM) to translate domain objects to database rows, falls back to a facade pattern in services to expose concise API methods for complex operations, and uses a Singleton pattern for DB connection management. GRASP principles inform responsibility assignment: controllers delegate to services, creators construct domain composites, and experts encapsulate operations that require specific knowledge. Patterns are applied pragmatically to balance clarity with developer ergonomics.

Chapter 4: IMPLEMENTATION

High-level Module Descriptions

Authentication and User Module: Implements registration, OTP verification (demo), password hashing, and NextAuth Credentials integration. Registration endpoint validates inputs, hashes passwords, creates user and account rows, and returns a session. The module supplies user data to dashboard endpoints and provides profile management views.

Model and Bus Management Module: Models define seat layouts in JSON including rows, seat positions, and metadata such as gender preferences or seat types. The admin UI allows previewing the generated seat map from a model. When a bus is created, the system generates the initial seats JSON map from the model and stores it in the bus row. Bus rows also have metadata like routeName, driverInfo, and references to busBoardingPoints.

Boarding Points and Routes Module: Boarding points are simple entities with a name and coordinates; busBoardingPoints map buses to boarding points with arrival times and a stop order. These mappings support listing buses by boarding point and enabling users to filter by their preferred stop.

Ticket Booking Module: The booking API validates the session, verifies seat availability, and performs a transactional update where a row is inserted into seats and the bus seats JSON map is updated. The server handles unique constraint violations and maps them to clear client responses to indicate the seat is no longer available.

Auxiliary Modules: Mailer, Analytics, and Cache

Mailer: A modular mailer component sends OTP and notification emails and can be swapped between a dev stub and a production SMTP provider. Analytics: PostHog integration emits events for key user interactions. Cache: A Redis-backed cache is available for high-read endpoints such as lists of boarding points or route summaries to reduce DB load.

Technology Stack Rationale

Next.js provides a modern full-stack framework with server-side routes that align with the service-oriented design. Drizzle ORM offers typed schema definitions and a migration toolchain which is important for reliable database evolution. TanStack Query on the client simplifies synchronization and caching of server state for an interactive UI. Tailwind CSS allows consistent, accessible styling with low friction for UI iteration.

Representative Code Examples

Booking code patterns show Zod validation, session extraction via the auth utilities, and a Drizzle transaction that both inserts a seat row and updates the bus seats JSON field via a jsonb_set expression. Admin code for bus creation demonstrates reading a model, generating the seats map, and writing the new bus row with the seats field initialized.

Chapter 5: TESTING

Testing Strategy and Environment

Testing spans unit tests for utility functions and services, integration tests for API endpoints against a seeded test database, and manual acceptance tests for end-to-end flows. Tests are run in CI with environment variables configured for a disposable test database; Drizzle migrations are applied and seeds are loaded before integration tests execute. Linting and type checks run as part of the pipeline to maintain code health.

Detailed Test Cases and Matrices

The test suite covers authentication, model and bus management, boarding point operations, route mapping, booking workflows including concurrency scenarios, and optional payment flows. Each test case includes a concise description, step-by-step actions, expected outcomes, and initial status. Automated tests can be driven by a Playwright or Cypress harness for the UI and Jest with SuperTest for API endpoints.

Sample Test Case Tables (Summary)

Authentication and User Tests: login success and failure, registration success and duplicate checks, OTP validation behavior.

Model and Bus Tests: model creation, bus creation using a model, bus editing, invalid model handling.

Boarding Points and Routes Tests: add/list boarding points, map bus to boarding point, list buses by boarding point.

Booking Tests: successful booking, double-book prevention, booking without authentication, booking under concurrency.

Payment Flow Tests (Optional): payment success leading to booking confirmation, payment failure resulting in no booking.

Testing Notes on Concurrency and Isolation

Concurrency tests should simulate multiple parallel booking attempts for the same seat to validate database-level protections. Recommended techniques include using database transactions with explicit retries for transient errors, applying optimistic concurrency checks on the seats JSON, or leveraging advisory locks for critical sections in higher-contention scenarios. Tests should assert that only one seat booking succeeds and that the system returns a clear conflict response for other attempts.

Chapter 6: CONCLUSION AND FUTURE ENHANCEMENTS

Conclusion and Summary

BusMate provides a balanced architecture that supports interactive seat booking while preserving strong transactional integrity. By combining a seat audit table with a seats JSON map on bus rows, the system delivers efficient reads for the UI and a robust audit trail for administrative and legal compliance. The modular services and typed schemas make the codebase easier to maintain, extend, and test.

Planned Enhancements and Roadmap

Short-term: integrate a production-grade OTP provider and a configurable SMTP service, add role-based access controls for admin endpoints, and improve test coverage around concurrency scenarios.

Medium-term: add an optional payment integration that ties a payment transaction to booking confirmation and implement real-time seat availability updates via WebSocket or server-sent events to reduce user confusion during high contention.

Long-term: scale strategies for large campus or multi-campus deployments including read replicas, partitioning strategies for the seats table, and a policy for offline sync to handle temporary network outages in mobile-heavy deployments.

Acknowledgements and References

This long-form OOAD document was prepared by reviewing the project codebase, Drizzle ORM schemas, App Router endpoints under src/app/api, and the frontend components under src/components and src/app. For more granular references consult the project's README and the reference document in this folder which lists endpoints and key file locations. The document is intended to serve developers, reviewers, and maintainers who need a comprehensive single-file overview of the system design and implementation.
