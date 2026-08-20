# Module Development Guide

Welcome to the Dev Environment Manager (DEM) Module Development Guide. This document provides a comprehensive guide for developers creating new package modules or extending existing ones within the DEM framework.

---

## 📖 Table of Contents
- [Architecture & Category Structure](#-architecture--category-structure)
- [The 4-Script Lifecycle Contract](#-the-4-script-lifecycle-contract)
- [Standard Exit Return Codes](#-standard-exit-return-codes)
- [Strict Script Headers & Execution Environment](#-strict-script-headers--execution-environment)
- [Shared Framework Libraries & Helpers](#-shared-framework-libraries--helpers)
- [Idempotency & Safety Requirements](#-idempotency--safety-requirements)
- [Dry-Run Simulation Mode](#-dry-run-simulation-mode)
- [Service Management Abstraction](#-service-management-abstraction)
- [Step-by-Step Module Creation Example](#-step-by-step-module-creation-example)
- [Validation & Verification](#-validation--verification)

---

## 🏗️ Architecture & Category Structure

All modules in DEM reside under the `packages/` directory and must belong strictly to one of the **12 architectural categories**:

1. **`core`**: Base compilation tools, GPG keyrings, and system dependencies (`ca-certificates`, `gnupg`, `build-essential`, `curl`, `git`, etc.).
2. **`system`**: Host configuration (timezone, locales, hostname, sudoers).
3. **`development`**: General developer tools (`jq`, `tree`, `less`, `bash-completion`).
4. **`docker`**: Containerization stack (`docker-ce`, `containerd`, `docker-compose-plugin`).
5. **`languages`**: Runtimes and language compilers (Node.js LTS, Go, PHP, Rust/Cargo).
6. **`databases`**: Database client CLI utilities (`psql`, `mariadb-client`, `redis-tools`, `sqlite3`).
7. **`databases-engines`**: Decoupled production database services (ScyllaDB, DragonflyDB, Redpanda, Vespa).
8. **`frameworks`**: Web & application frameworks (Laravel, WordPress CLI, React Native / Expo with OpenJDK & adb, Flutter).
9. **`tools`**: CLI developer utilities (`gh`, `kubectl`, `helm`, `terraform`, `htop`, `btop`, `ripgrep`, `fzf`, `bat`, `fastfetch`).
10. **`desktop`**: Workstation GUI tools and fonts (VS Code, Fira Code / Hack Nerd fonts).
11. **`office`**: Document productivity applications (`libreoffice`, `evince`).
12. **`server`**: Host security and monitoring daemons (`ufw`, `fail2ban`, `prometheus-node-exporter`).

---

## 📜 The 4-Script Lifecycle Contract

Every single module directory under `packages/<category>/<module-name>` **must contain exactly four executable Bash scripts**. No extra scripts or missing lifecycle files are allowed.

| Script Name | Responsibility | Key Requirements |
| :--- | :--- | :--- |
| **`install.sh`** | Downloads & installs APT packages, keyrings, or vendor binaries. | Check if already installed before downloading (idempotency). Support `--dry-run`. |
| **`configure.sh`** | Sets up directory structures, permissions, configuration files, users, and enables services. | Idempotent updates (e.g. `mkdir -p`, `ln -sf`, atomic file writes). |
| **`verify.sh`** | Validates binary presence, version checks, service active status, and network ports. | Output structured status indicators (`[OK]`, `[WARN]`, `[FAIL]`). |
| **`uninstall.sh`** | Purges installed binaries, user accounts, configuration files, APT sources, and GPG keyrings. | Safely clean without removing shared host system dependencies. |

---

## 🔢 Standard Exit Return Codes

All lifecycle scripts and library functions must enforce standardized return codes as defined in `config.sh`:

* **`0` (`DEM_EXIT_SUCCESS`)**: The lifecycle action completed successfully.
* **`1` (`DEM_EXIT_ERROR`)**: An unhandled runtime error or validation failure occurred.
* **`2` (`DEM_EXIT_PREREQ_MISSING`)**: Prerequisite check failed (e.g., missing critical tool, unsupported OS platform non-Debian 13).
* **`3` (`DEM_EXIT_SKIP_ALREADY_INSTALLED`)**: Idempotency check passed; component is already installed/configured and was skipped without state alteration.

---

## ⚡ Strict Script Headers & Execution Environment

All executable scripts in `packages/` must start with exact shebang and strict shell directives without any leading blank lines or UTF-8 BOM:

```bash
#!/usr/bin/env bash
set -euo pipefail
```

* **`set -e`**: Exit immediately if a command exits with a non-zero status.
* **`set -u`**: Treat unset variables as an error when expanding.
* **`set -o pipefail`**: Return value of a pipeline is the status of the last command to exit with a non-zero status.

*Note: Sourced scripts inside `lib/` and `config.sh` must remain shebang-free to preserve the caller context.*

---

## 🛠️ Shared Framework Libraries & Helpers

DEM provides central helper functions in `lib/` that should be used across all module scripts:

### Logging Helpers (`lib/logger.sh`)
* `dem_info "message"`: Prints formatted info message (`[INFO]`).
* `dem_success "message"`: Prints formatted success message (`[ OK ]`).
* `dem_warning "message"`: Prints formatted warning message (`[WARN]`).
* `dem_error "message"`: Prints formatted error message (`[FAIL]`).
* `dem_fatal "message"`: Logs fatal error and exits with code `1`.
* `dem_fatal_code "message" code`: Logs fatal error and exits with the specified code.

### Package & Dry-Run Helpers (`lib/packages.sh`)
* `dem_package_installed "package-name"`: Returns `0` if package is installed via `dpkg-query`, else `1`.
* `dem_install_package "package-name"`: Idempotently installs an APT package. Respects `DEM_DRY_RUN`.
* `dem_is_dry_run`: Returns `0` if `DEM_DRY_RUN` is set to `true`.
* `dem_dry_run_log "action"`: Logs a dry-run action (`[DRY ]`).

---

## 🔁 Idempotency & Safety Requirements

Every script must be safe to execute multiple times on the same system without producing adverse side-effects or corrupting configurations:

1. **Check before install**: Verify if the target binary exists (`dem_command_exists <binary>`) or APT package is installed (`dem_package_installed <pkg>`). If present during initial installation check, exit cleanly with code `3` or skip downloading.
2. **Atomic Configuration Updates**: Use `mkdir -p` for directories, `ln -sf` for symlinks, and avoid appending duplicate lines to system files (use `grep -q` before appending).
3. **APT Repository & Key Safety**: Store custom GPG keys strictly under `/etc/apt/keyrings/<name>.gpg` and sources list files under `/etc/apt/sources.list.d/<name>.sources` using standard `signed-by` attributes. Never use deprecated `apt-key`.

---

## 🧪 Dry-Run Simulation Mode

DEM supports dry-run mode via the `--dry-run` CLI flag or `DEM_DRY_RUN=true` environment variable.

When writing lifecycle scripts:
* Wrap system-modifying operations (such as `apt update`, `curl`, `systemctl`, `useradd`, `rm -rf`) with `dem_is_dry_run` checks or call framework wrappers (`dem_install_package`, `dem_service_start`, etc.).
* Output dry-run simulation logs using `dem_dry_run_log "Simulated action description"`.

---

## ⚙️ Service Management Abstraction

Do **NOT** execute raw `systemctl` commands directly inside module scripts. Always use the service abstraction helpers defined in `lib/services.sh`:

```bash
dem_service_enable "service-name"
dem_service_start "service-name"
dem_service_restart "service-name"
dem_service_stop "service-name"
dem_service_disable "service-name"
dem_service_status "service-name"
dem_service_running "service-name"
```

---

## 📝 Step-by-Step Module Creation Example

Suppose you want to add a new tool named `example-tool` under `packages/tools`:

### 1. Create Directory Hierarchy
```bash
mkdir -p packages/tools
```

### 2. `install.sh`
```bash
#!/usr/bin/env bash
set -euo pipefail

# Idempotency check
if dem_command_exists example-tool; then
    dem_success "example-tool is already installed"
    exit 3
fi

dem_info "Installing example-tool..."

if dem_is_dry_run; then
    dem_dry_run_log "apt install -y example-tool"
    exit 0
fi

dem_install_package "example-tool"
```

### 3. `configure.sh`
```bash
#!/usr/bin/env bash
set -euo pipefail

dem_info "Configuring example-tool..."

if dem_is_dry_run; then
    dem_dry_run_log "Creating /etc/example-tool/config.conf"
    exit 0
fi

mkdir -p /etc/example-tool
if [[ ! -f /etc/example-tool/config.conf ]]; then
    echo "default_setting=enabled" > /etc/example-tool/config.conf
fi
```

### 4. `verify.sh`
```bash
#!/usr/bin/env bash
set -euo pipefail

dem_info "Verifying example-tool..."

if dem_is_dry_run; then
    dem_dry_run_log "Verifying example-tool binary presence"
    dem_success "example-tool verification simulated"
    exit 0
fi

if dem_command_exists example-tool; then
    dem_success "example-tool binary found: $(example-tool --version || echo 'OK')"
else
    dem_error "example-tool binary not found"
    exit 1
fi
```

### 5. `uninstall.sh`
```bash
#!/usr/bin/env bash
set -euo pipefail

dem_info "Uninstalling example-tool..."

if dem_is_dry_run; then
    dem_dry_run_log "Purging package example-tool and deleting /etc/example-tool"
    exit 0
fi

dem_remove_package "example-tool"
rm -rf /etc/example-tool
dem_success "example-tool uninstalled successfully"
```

---

## 🔍 Validation & Verification

After creating or modifying a module, run the DEM repository static validator to confirm compliance:

```bash
./dem.sh validate
```

The validator will check Shebang headers, file execution permissions, Bash syntax (`bash -n`), profile integrity, and 4-script lifecycle contract completeness.
