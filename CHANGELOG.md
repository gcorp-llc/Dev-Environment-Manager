# Changelog

All notable changes to the Dev Environment Manager (DEM) will be documented in this file.

## [1.0.0] - 2025-08-04

### Added
- **Unified Command Framework**: Introduced `dem.sh` controller supporting installation, configuration, verification, uninstallation, diagnostics (`doctor`), status, repair, cleanup, and backup/restore actions.
- **Strict 12-Category Module Structure**: Organised provisioning scripts under standard root packages (`core`, `system`, `development`, `docker`, `languages`, `databases`, `databases-engines`, `frameworks`, `office`, `tools`, `desktop`, `server`).
- **Complete Decoupled DB Engine Lifecycle**: Implemented fully production-ready services for PostgreSQL, ScyllaDB, DragonflyDB, and Meilisearch, each maintaining modular installation, configuration, verification, and uninstallation.
- **Modern Debian 13 APT Standards**: Decoupled all third-party APT configurations, utilizing modern GPG keyring setups under `/etc/apt/keyrings/` with specified `signed-by` sources list configurations. Completely deprecated obsolete `apt-key` usage.
- **Lightweight React Native Workflow**: Added an Expo and React Native workflow supporting physical Android devices via adb, fastboot, and OpenJDK, strictly avoiding heavy Android Studio installations.
- **Full Life-cycle Idempotence**: Added safety guards (`getent`, `grep`, `ln -sf`, check files) ensuring that all scripts are safely repeatable without system state corruption.
- **Comprehensive Technical Documentation**: Created comprehensive guides including `ARCHITECTURE.md`, `DEVELOPMENT.md`, and `CONTRIBUTING.md` detailing codebase flows and standards.

### Changed
- **Refactored Service Layer**: Modified all service management inside modules to run through consistent custom abstractions `dem_service_*` defined in `lib/services.sh` rather than calling `systemctl` directly.
- **Enforced Strict Bash Mode**: Added `set -euo pipefail` to all executable scripts across commands, root wrappers, and profiles, ensuring robust error tracking and environment stability. Sourced library scripts remain clean and source-safe.
- **GitHub CLI Keyring Fix**: Cleaned up the dearmor pipe for GitHub CLI to prevent corrupting its GPG key during installations.
