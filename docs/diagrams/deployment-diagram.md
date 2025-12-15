```mermaid
%% Deployment diagram for BusMate
%% Shows common deployment topology (Docker Compose, external services, CI/CD)
flowchart TB

  user["User<br/>(Browser/Mobile)"]
  proxy["CDN / Reverse Proxy / Load Balancer"]

  subgraph host["Server / Host (VPS, Cloud VM)"]
    subgraph compose["Docker Compose" ]
      app["Next.js App (server)\nDocker container"]
      postgres["Postgres (postgres:17.*)\ncontainer / volume busmate-pg-data"]
      redis["Redis (redis:7-alpine)\ncontainer / volume busmate-redis-data"]
    end
    volumes["Docker volumes\n(busmate-pg-data, busmate-redis-data)"]
  end

  subgraph external["External / Hosted Services"]
    neon[("Neon / Hosted Postgres")]
    rediscloud[("Redis Cloud / Managed Redis")]
    smtp[("SMTP Provider\n(Gmail, SES, etc.)")]
    posthog[("PostHog (analytics)")]
    registry[("Image Registry\nDocker Hub / GHCR")]
    ci[("CI/CD\nGitHub Actions / Other")]
  end

  %% Connections
  user -->|HTTPS| proxy
  proxy -->|HTTP/HTTPS| app
  app -->|DB connection (DATABASE_URL)| postgres
  app -->|cache| redis
  app -->|email| smtp
  app -->|analytics| posthog
  ci -->|build & push image| registry
  registry -->|deploy image / pull| host

  %% Option: use hosted DB/Redis instead of local containers
  app -->|optional| neon
  app -->|optional| rediscloud

  %% Styling
  classDef cloud fill:#f0f9ff,stroke:#b6e0fe
  class external neon,rediscloud,smtp,posthog,registry,ci cloud

```

Notes

- The project's `Dockerfile` and `compose.yaml` show a simple Docker Compose deployment with services: `server`, `postgres-container`, and `redis`.
- For production you might: use managed DB (Neon/RDS), managed Redis, hosted PostHog, and deploy the Next.js app to a container orchestrator (K8s) or serverless platform (Vercel).
- If you'd like, I can also generate a Kubernetes variant or a GitHub Actions workflow that builds, pushes, and deploys the container.
