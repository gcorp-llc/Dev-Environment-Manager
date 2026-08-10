# DEM v1.0 Architectural Design Specification

This document details the software architecture, design patterns, and systemic execution flows of the Dev Environment Manager (DEM).

---

## 🗺️ High-Level System Architecture

DEM is organized as a declarative framework split into distinct layers. This structure separates core provisioning execution from static profiles and individual package management.

```
+-------------------------------------------------------------+
|                      User / CI/CD (dem.sh)                  |
+-------------------------------------------------------------+
                               |
                               v
+-------------------------------------------------------------+
|               Controller Layer (commands/*.sh)              |
|        - Sourced dynamically; implements execution verbs     |
+-------------------------------------------------------------+
                               |
                               v
+-------------------------------------------------------------+
|            Sourced Library Abstractions (lib/*.sh)          |
|    - packages.sh (APT wrappers)                             |
|    - services.sh (Systemd wrappers)                         |
|    - ui.sh / validation.sh                                  |
+-------------------------------------------------------------+
                               |
                               v
+-------------------------------------------------------------+
|              Profile Configuration Layer (profiles/*)       |
|            - Declarative array of DEM_MODULES               |
+-------------------------------------------------------------+
                               |
                               v
+-------------------------------------------------------------+
|              Package Module Layer (packages/*)              |
|   - Strictly decoupled submodules with 4-script contracts   |
+-------------------------------------------------------------+
```

---

## 📦 Package Hierarchy and Directory Mapping

DEM structures its modules into a strict 12-category architecture under the `packages/` directory. Each of these categories manages specific components of the final environment.

### 1. Root-Level Categories:
* `core`: Prepares Debian, installs certificates, curl/wget, build toolchains.
* `system`: Configures system clock/timezones, hostname files, locale generation, and sudo privileges.
* `development`: Common text/data/archive manipulation packages (`jq`, `tree`, `less`, `bash-completion`).
* `docker`: Installs and configures Docker Engine with standard plugins.
* `languages`: Compiler/runtime environments for modern languages (Node, Go, Rust, PHP).
* `databases`: CLI clients for common databases (`mariadb-client`, `sqlite3`, etc.).
* `databases-engines`: Sourced database servers (ScyllaDB, DragonflyDB, Redpanda, Vespa).
* `frameworks`: Sourced framework engines and development environments (WP-CLI, Composer, React Native & Expo).
* `office`: Productivity tools (`libreoffice`, `evince`).
* `tools`: Production CLI utilities (`gh`, `kubectl`, `helm`, `terraform`, `eza`, `ripgrep`, etc.).
* `desktop`: Graphical desktop setup including VS Code and system fonts.
* `server`: Security and performance monitoring utilities (`ufw`, `fail2ban`, `node-exporter`).

---

## 📜 Sourced Lifecycle Script Contract

Every active module or sub-module folder MUST maintain exactly four scripts matching the Lifecycle Contract:

1. **`install.sh`**:
   - Downloads Debian packages or fetches remote binary artifacts.
   - Sets up required keyrings inside `/etc/apt/keyrings/` and registers repositories in `/etc/apt/sources.list.d/`.
   - Never enables or starts services.
2. **`configure.sh`**:
   - Creates required system directories and configuration files.
   - Adds users/groups to the host system.
   - Standardizes service management by calling `dem_service_enable` and `dem_service_start`.
3. **`verify.sh`**:
   - Proactively verifies that binaries exist in the executable path (`PATH`).
   - Asserts that ports are listening or health endpoints are responding (e.g. Vespa HTTP health checks).
   - Confirms systemd services are in a running state.
4. **`uninstall.sh`**:
   - Purges configuration files and system paths.
   - Safely removes system users/groups.
   - Cleans up APT repositories and deleted GPG files.
   - Restores the system to its original state.

---

## ⚡ Execution and Sourcing Flow

All system flows start in `dem.sh`. A standard run follows this path:

1. **Entrypoint Execution (`dem.sh <command> <profile>`)**:
   - Sources `bootstrap.sh`.
   - `bootstrap.sh` imports general library scripts from `lib/` and reads global settings in `config.sh`.
2. **Command Sourcing (`load_command <command>`)**:
   - Sources the corresponding command script from the `commands/` directory. For example, `commands/install.sh`.
3. **Profile Loading (`dem_profile_load <profile>`)**:
   - Verifies the requested profile (e.g., `desktop.profile`) exists under `profiles/`.
   - Sources the file to read the `DEM_MODULES` bash array.
4. **Sequential Sourcing Loop**:
   - For every module string listed in `DEM_MODULES`, the controller sources the relevant module lifecycle scripts in order:
     - Sourcing `packages/<module>/install.sh`
     - Sourcing `packages/<module>/configure.sh`
     - Sourcing `packages/<module>/verify.sh`

### Uninstallation Reverse Sourcing:
To avoid dependency issues, the `uninstall.sh` command reads `DEM_MODULES` and walks it **backwards** (from the last element to the first), executing the corresponding `uninstall.sh` scripts sequentially.

---

## 🏛️ Standardized Service Management

All background processes are registered as systemd units and controlled uniformly via wrapper methods in `lib/services.sh`. This isolates the execution of commands away from direct calling files:

* `dem_service_enable` -> `systemctl enable "$1"`
* `dem_service_disable` -> `systemctl disable "$1"`
* `dem_service_start` -> `systemctl start "$1"`
* `dem_service_stop` -> `systemctl stop "$1"`
* `dem_service_running` -> `systemctl is-active --quiet "$1"`
* `dem_service_status` -> `systemctl status "$1"`

This ensures error control and consistent state logging across both server and workstation provisionings.
