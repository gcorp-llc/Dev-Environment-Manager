# Changelog

All notable changes to the Dev Environment Manager (DEM) will be documented in this file.

## [v1.0.0]

### Added
- **Phase 1 (Core Framework & Foundation)**: Established root command dispatcher (`dem.sh`), global environment bootstrap (`bootstrap.sh`), central configuration (`config.sh`), and standard return codes (`0`: Success, `1`: Error, `2`: Missing Prerequisites, `3`: Skip / Already Installed).
- **Phase 2 (12-Category Module Architecture)**: Created strict 12-category package hierarchy (`core`, `system`, `development`, `docker`, `languages`, `databases`, `databases-engines`, `frameworks`, `office`, `tools`, `desktop`, `server`) enforcing the 4-script contract (`install.sh`, `configure.sh`, `verify.sh`, `uninstall.sh`).
- **Phase 3 (Debian 13 APT Security & Decoupled Repositories)**: Decoupled third-party APT setups directly into owning package modules, placing GPG keys under `/etc/apt/keyrings/` with modern `signed-by` sources list descriptors. Completely eliminated deprecated `apt-key` usage.
- **Phase 4 (Services Abstraction Layer & Production Database Engines)**: Implemented wrapper functions in `lib/services.sh` encapsulating systemd operations, integrated with native production database services (PostgreSQL, ScyllaDB, DragonflyDB, Redpanda, Vespa containerized stack).
- **Phase 5 (Unified Scanner, Profile Orchestration & Dry-Run Support)**: Integrated unified verification scanner in `commands/verify.sh`, declarative profile orchestrators (`minimal`, `server`, `desktop`), CLI standardization, and full `--dry-run` execution mode.
- **Phase 6 (Comprehensive Testing, Error Scenarios & Documentation)**: Completed E2E idempotency and dry-run testing, added developer documentation (`DOCS/MODULE_GUIDE.md`), updated `README.md` with CLI commands and flags, and finalized release readiness checklist.
- **Lightweight React Native Workflow**: Added Expo / React Native environment targeting physical Android devices via adb, fastboot, and OpenJDK without heavy IDE footprints.
- **Comprehensive Technical Documentation**: Produced complete system documentation including `README.md`, `ARCHITECTURE.md`, `DEVELOPMENT.md`, `CONTRIBUTING.md`, `DOCS/MODULE_GUIDE.md`, and `FINAL_ACCEPTANCE_REPORT.md`.

### Changed
- **Refactored Service Layer**: Modified all service management inside modules to run through custom abstractions (`dem_service_*`) defined in `lib/services.sh` rather than calling raw `systemctl` directly.
- **Enforced Strict Bash Mode**: Applied `#!/usr/bin/env bash` and `set -euo pipefail` across executable scripts while ensuring library scripts in `lib/` remain shebang-free.
- **Enhanced Workspace Repair & Validator**: Expanded `./dem.sh repair` and `./dem.sh validate` to audit shebang headers, line endings (LF), executable bits, profile mappings, and facts-based markdown documentation consistency.
