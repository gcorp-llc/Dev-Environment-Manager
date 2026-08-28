# Cardiani Local Development Environment & Developer Onboarding Guide

Welcome to the **Cardiani** project! This comprehensive guide provides step-by-step instructions, directory breakdowns, tooling specifications, and troubleshooting runbooks for setting up, running, and debugging the local development environment.

---

## Table of Contents

1. [Dev Environment Directory Structure](#1-dev-environment-directory-structure)
   - [Directory Tree](#directory-tree)
   - [Tool Responsibilities & Operating System Requirements](#tool-responsibilities-operating-system-requirements)
2. [Scripts & Tooling Breakdown](#2-scripts-tooling-breakdown)
   - [Automation Scripts (`scripts/`)](#automation-scripts-scripts)
   - [Docker Compose Configuration (`infra/docker-compose.yml`)](#docker-compose-configuration-infradocker-composeyml)
   - [Bruno API Collections & Test Suites (`bruno/`)](#bruno-api-collections-test-suites-bruno)
   - [CLI Dependencies & Developer Tools](#cli-dependencies-developer-tools)
3. [Step-by-Step Setup & Troubleshooting Runbooks](#3-step-by-step-setup-troubleshooting-runbooks)
   - [Developer Onboarding Runbook](#developer-onboarding-runbook)
   - [Troubleshooting & Error Resolution Matrix](#troubleshooting-error-resolution-matrix)

---

## 1. Dev Environment Directory Structure

### Directory Tree

The local development setup for Cardiani relies on a structured workspace layout containing scripts, infrastructure configurations, API testing collections, and environment templates:

```text
cardiani/
├── .env.example                  # Template for local environment variables
├── Makefile                      # Standardized automation command shortcuts
├── Justfile                      # Modern task runner alternative for local workflows
├── infra/
│   └── docker-compose.yml        # Multi-container local infrastructure stack
├── scripts/
│   ├── setup_db.sh               # Database initialization script
│   ├── seed_db.py                # Python test data seeder
│   ├── proxy_manager.sh          # Proxy setup & network routing manager
│   ├── ip_cache_refresh.py       # IP caching & DNS refresh automation
│   └── local_server_config.sh    # Local environment network & host configuration
├── bruno/
│   ├── bruno.json                # Bruno workspace configuration
│   ├── environments/
│   │   ├── local.bru             # Local environment variables for Bruno
│   │   └── staging.bru           # Staging environment variables for Bruno
│   ├── auth/                     # Authentication & Token API tests
│   ├── feature_flags/            # Feature Flag management & evaluation tests
│   ├── logistics/                # Dispatch, routing, & logistics domain tests
│   └── production_verification/  # E2E health check & sanity assertion suites
└── docs/
    ├── fa/
    │   └── DEV_ENVIRONMENT_GUIDE.md  # Persian Developer Onboarding Guide
    └── en/
        └── DEV_ENVIRONMENT_GUIDE.md  # English Developer Onboarding Guide
```

---

### Tool Responsibilities & Operating System Requirements

#### Core Operating System Compatibility Matrix

| Operating System | Support Level | Prerequisites / Notes |
|---|---|---|
| **Debian 13 (Trixie)** | **Primary / Native Target** | Native APT suite, systemd integration, primary target platform. |
| **Ubuntu / Linux (22.04+)** | Supported | Docker Engine, `build-essential`, `pkg-config`, `libssl-dev`. |
| **macOS (Apple Silicon / Intel)** | Supported via Docker | macOS 13+, Docker Desktop / OrbStack, Homebrew for CLI tools. |
| **Windows 11 (WSL2)** | Supported via WSL2 | WSL2 with Ubuntu/Debian distro. Docker Desktop with WSL2 integration enabled. |

#### System Tooling Responsibilities

* **Docker & Docker Compose v2**: Container orchestration for database engines (ScyllaDB, PostgreSQL, DragonflyDB) and messaging middleware (Redpanda/NATS, Vespa).
* **pnpm**: Fast, disk-space-efficient package manager for frontend dependencies and Node.js microservices.
* **Cargo / cargo-watch**: Rust compiler toolchain and live-reloading watcher for high-performance backend microservices.
* **Bruno CLI (`@usebruno/cli`)**: Headless API assertion engine for running functional and integration test suites against local microservices.
* **cqlsh**: Command-line interface for interacting with ScyllaDB / Cassandra clusters.
* **nats-cli**: CLI tool for inspecting and managing NATS / Redpanda event streams and topics.

---

## 2. Scripts & Tooling Breakdown

### Automation Scripts (`scripts/`)

#### 1. `scripts/setup_db.sh`
* **Purpose**: Initializes database schemas, keyspaces, and table structures across ScyllaDB and PostgreSQL.
* **Switches / Inputs**:
  * `--drop-existing`: Drops existing schemas prior to creation.
  * `--env-file <path>`: Specifies custom `.env` path (default: `.env`).
* **Outputs**: Formatted console logs highlighting schema migration status.
* **Side Effects**: Creates keyspaces `cardiani_core` in ScyllaDB and tables in PostgreSQL.

#### 2. `scripts/seed_db.py`
* **Purpose**: Populates local database tables with mock test data (users, logistics nodes, feature flags).
* **Switches / Inputs**:
  * `--records <number>`: Number of mock records per entity (default: `100`).
  * `--clean`: Truncates existing mock records before seeding.
* **Outputs**: JSON summary report of generated entities.
* **Side Effects**: Writes synthetic data directly into ScyllaDB and PostgreSQL.

#### 3. `scripts/proxy_manager.sh`
* **Purpose**: Configures local reverse proxy routes, domain aliases, and SSL certificates for local testing.
* **Switches / Inputs**:
  * `enable`: Activates local proxy routes.
  * `disable`: Restores system networking defaults.
  * `--domain <name>`: Custom local domain binding (default: `cardiani.local`).
* **Outputs**: Status logs and updated `/etc/hosts` entries.
* **Side Effects**: Modifies local network routing and host file entries (requires `sudo`).

#### 4. `scripts/ip_cache_refresh.py`
* **Purpose**: Fetches, parses, and updates IP geolocation/caching tables inside DragonflyDB/Redis.
* **Switches / Inputs**:
  * `--flush`: Flushes existing IP cache keys before refresh.
  * `--source <url>`: Custom IP range feed URL.
* **Outputs**: Cache update counter and performance telemetry.
* **Side Effects**: Updates key-value stores inside DragonflyDB.

#### 5. `scripts/local_server_config.sh`
* **Purpose**: Validates system ports, environment variables, and system permissions before starting services.
* **Switches / Inputs**:
  * `--check-only`: Runs diagnostics without changing configuration.
  * `--fix`: Automatically resolves port conflicts by terminating orphaned processes.
* **Outputs**: Diagnostic checklist output.
* **Side Effects**: May terminate process listeners on conflicting ports if `--fix` is passed.

---

### Docker Compose Configuration (`infra/docker-compose.yml`)

The infrastructure layout orchestrates local databases, key-value stores, and message queues:

```yaml
version: '3.8'

services:
  scylladb:
    image: scylladb/scylla:5.4
    container_name: cardiani-scylladb
    ports:
      - "9042:9042"
    volumes:
      - scylla-data:/var/lib/scylla
    environment:
      - SMP=1
    healthcheck:
      test: ["CMD-SHELL", "cqlsh -e 'SHOW HOST' || exit 1"]
      interval: 10s
      timeout: 5s
      retries: 5

  postgres:
    image: postgres:16-alpine
    container_name: cardiani-postgres
    ports:
      - "5432:5432"
    environment:
      POSTGRES_DB: cardiani_dev
      POSTGRES_USER: cardiani
      POSTGRES_PASSWORD: dev_password_123
    volumes:
      - postgres-data:/var/lib/postgresql/data

  dragonfly:
    image: docker.dragonflydb.io/dragonflydb/dragonfly:v1.14.0
    container_name: cardiani-dragonfly
    ports:
      - "6379:6379"
    ulimits:
      memlock: -1

  redpanda:
    image: docker.redpanda.com/redpandadata/redpanda:v23.3.3
    container_name: cardiani-redpanda
    ports:
      - "9092:9092"
      - "19644:19644"
    command:
      - redpanda start
      - --smp 1
      - --memory 1G
      - --reserve-memory 0M
      - --overprovisioned
      - --node-id 0

  vespa:
    image: vespaengine/vespa:8.280.56
    container_name: cardiani-vespa
    ports:
      - "8080:8080"
      - "19071:19071"

volumes:
  scylla-data:
  postgres-data:
```

#### Dependent Service Startup Sequence

1. **Storage Infrastructure**: `scylladb`, `postgres`, `dragonfly` spin up in parallel.
2. **Messaging & Search**: `redpanda` and `vespa` initiate once base storage ports are reachable.
3. **Application Services**: Microservices connect once healthchecks pass for `scylladb` (port `9042`) and `postgres` (port `5432`).

---

### Bruno API Collections & Test Suites (`bruno/`)

Bruno is used for local API testing, contract validation, and automated assertion execution.

#### Collection Structure & Domain Modules

* `bruno/auth/`:
  * `login.bru`: Endpoint POST `/api/v1/auth/login`. Accepts JSON credentials, returns Bearer token.
  * `refresh.bru`: Endpoint POST `/api/v1/auth/refresh`. Renews access tokens.
* `bruno/feature_flags/`:
  * `get_flags.bru`: Endpoint GET `/api/v1/flags`. Evaluates active feature flags for target context.
  * `toggle_flag.bru`: Endpoint PUT `/api/v1/flags/:id`. Toggles feature flag state.
* `bruno/logistics/`:
  * `calculate_route.bru`: Endpoint POST `/api/v1/logistics/route`. Calculates optimal distribution routes.
  * `track_shipment.bru`: Endpoint GET `/api/v1/logistics/shipments/:id`. Returns live shipment status.
* `bruno/production_verification/`:
  * `health_check.bru`: Endpoint GET `/health`. Validates overall system status (`200 OK`).
  * `readiness.bru`: Endpoint GET `/ready`. Validates connection to ScyllaDB, PostgreSQL, and Redpanda.

#### Automated Assertions Example (`.bru` file structure)

```hcl
meta {
  name: Auth - Login
  type: http
  seq: 1
}

post {
  url: {{baseUrl}}/api/v1/auth/login
  body: json
  auth: none
}

headers {
  Content-Type: application/json
  Accept: application/json
}

body:json {
  {
    "username": "dev_admin",
    "password": "{{devPassword}}"
  }
}

tests {
  test("Status code is 200", function() {
    expect(res.getStatus()).to.equal(200);
  });

  test("Token is present in response", function() {
    expect(res.getBody().token).to.be.a('string');
  });
}
```

---

### CLI Dependencies & Developer Tools

1. **pnpm**
   - Installation: `npm install -g pnpm` or `corepack enable pnpm`
   - Usage: `pnpm install`, `pnpm run dev`, `pnpm run build`
2. **cargo-watch**
   - Installation: `cargo install cargo-watch`
   - Usage: `cargo watch -x run -w src` (auto-recompiles Rust backend services on file changes)
3. **Bruno CLI**
   - Installation: `npm install -g @usebruno/cli`
   - Usage: `bru run bruno/ --env local` (runs headless test suite against local environment)
4. **cqlsh**
   - Installation: Installed via `scylladb` container or `pip install cqlsh`
   - Usage: `docker exec -it cardiani-scylladb cqlsh`
5. **nats-cli**
   - Installation: `go install github.com/nats-io/natscli/nats@latest` or APT package
   - Usage: `nats sub "cardiani.>"`
6. **Git Submodules**
   - Usage: `git submodule update --init --recursive` (syncs shared schemas or proto definitions if required)

---

## 3. Step-by-Step Setup & Troubleshooting Runbooks

### Developer Onboarding Runbook

Follow these steps sequentially to set up your local development environment from scratch:

#### Step 1: Clone Repository & Submodules
```bash
git clone https://github.com/cardiani/cardiani.git
cd cardiani
git submodule update --init --recursive
```

#### Step 2: Configure Environment Variables
Copy the template `.env.example` file to create your active local configuration:
```bash
cp .env.example .env
```
Inspect `.env` to verify database connection credentials, proxy settings, and port allocations.

#### Step 3: Launch Local Infrastructure Services
Start all databases, caches, and messaging containers via Docker Compose:
```bash
docker compose -f infra/docker-compose.yml up -d
```
Verify container health status:
```bash
docker compose -f infra/docker-compose.yml ps
```

#### Step 4: Run Database Initialization & Data Seeding
Initialize schemas and populate test data:
```bash
./scripts/setup_db.sh
python3 ./scripts/seed_db.py --records 50
```

#### Step 5: Start Microservices & Frontend Dashboard
* **Backend Microservices (Rust)**:
  ```bash
  cargo watch -x run
  ```
* **Frontend Dashboard (Next.js / Node)**:
  ```bash
  cd web
  pnpm install
  pnpm run dev
  ```

#### Step 6: Verify Environment Health via Bruno CLI
Execute automated integration test suites to confirm local end-to-end functionality:
```bash
bru run bruno/production_verification --env local
```

---

### Troubleshooting & Error Resolution Matrix

| Issue / Symptom | Possible Cause | Resolution Steps |
|---|---|---|
| **ScyllaDB connection failure on WSL2** | WSL2 network bridge / memory limits or cgroups v2 mismatch. | 1. Ensure `SMP=1` environment variable is set in `docker-compose.yml`.<br>2. Add `memory=4GB` to `~/.wslconfig`.<br>3. Restart WSL using `wsl --shutdown` in PowerShell. |
| **Port occupied (`bind: address already in use`)** | Port 9042, 5432, 6379, or 8080 is in use by a host service or orphaned container. | 1. Run `./scripts/local_server_config.sh --fix`.<br>2. Manually identify process: `lsof -i :<port>` or `netstat -tulpn \| grep <port>`.<br>3. Terminate process: `kill -9 <PID>`. |
| **`pnpm install` lockfile mismatch or peer dependency errors** | Corrupted node_modules or outdated pnpm lockfile. | 1. Clear node_modules: `rm -rf web/node_modules web/pnpm-lock.yaml`.<br>2. Run `pnpm store prune`.<br>3. Reinstall with `pnpm install --no-frozen-lockfile`. |
| **`cargo watch` compilation lock / disk space error** | Locked `target/` directory or out-of-space build cache. | 1. Clean build artifacts: `cargo clean`.<br>2. Verify free disk space: `df -h`.<br>3. Re-run `cargo watch -x check`. |
| **JWT Token expired in Bruno API tests** | Stale local token in Bruno `local.bru` environment file. | 1. Execute `bruno/auth/login.bru` to fetch a new JWT token.<br>2. Ensure environment variable `{{accessToken}}` is updated automatically in local workspace environment. |
| **Redpanda / NATS stream connection timeout** | Redpanda container restarted with different IP in Docker bridge network. | 1. Restart Redpanda: `docker compose -f infra/docker-compose.yml restart redpanda`.<br>2. Verify port `9092` accessibility: `nc -zv 127.0.0.1 9092`. |

---
