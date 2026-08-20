# Dev Environment Manager (DEM)

Dev Environment Manager (DEM) is a production-ready, modular, Bash-based environment provisioning framework targeting **Debian 13 (Trixie)**. It empowers Lead Architects, Release Engineers, and DevOps developers to provision consistent developer, desktop, and server workspaces in an automated, secure, and idempotent manner.

---

## 📖 Table of Contents
- [Project Overview](#-project-overview)
- [Project Architecture](#-project-architecture)
- [Installation](#-installation)
- [Available Profiles](#-available-profiles)
- [Available Modules](#-available-modules)
- [CLI Command Interface](#-cli-command-interface)
- [Development Workflow](#-development-workflow)
- [Windows Development & Transfer Recommendations](#-windows-development--transfer-recommendations)
- [Troubleshooting](#-troubleshooting)
- [Uninstall Process](#-uninstall-process)

---

## 🌟 Project Overview

DEM simplifies system initialization and package management by wrapping Debian's native package manager (`apt`) and other setup mechanisms in a declarative, predictable profile structure. Rather than relying on custom, fragile curl-to-bash installation scripts, DEM organizes package modules into a strict 12-category architecture where every package manages its own installation, configuration, verification, and uninstallation lifecycle.

### Key Principles:
* **Debian 13 Native Primary Suite**: Designed from the ground up for Debian `trixie`.
* **APT-First & Signed-By Security**: Third-party package GPG keys are imported cleanly under `/etc/apt/keyrings/` and specified in sources list files with modern `signed-by` constraints. We completely avoid legacy, deprecated commands like `apt-key` and global `trusted.gpg` directories.
* **Full Idempotency**: Run any script twice without duplicate side-effects or corrupting system state. Return codes strictly adhere to standards (0: Success, 1: Error, 2: Missing Prerequisite, 3: Skip / Already Installed).
* **No Unfinished Work**: Production-grade scripts without legacy compatibility code, obsolete commands, or unfinished templates.

---

## 🏗️ Project Architecture

DEM follows a highly organized, decoupled architecture where code execution flows sequentially from root scripts to controllers, then into profile definitions, and finally down into individual module scripts.

```
DEM Root/
├── dem.sh                  # Main entrypoint wrapper
├── bootstrap.sh            # Global environmental setup
├── config.sh               # Global configurations
├── commands/               # Controller flow commands
│   ├── profile.sh          # Profile orchestrator controller
│   ├── verify.sh           # Unified scanner verification controller
│   ├── doctor.sh           # System health diagnostics controller
│   ├── validate.sh         # Static repository validator controller
│   └── ...
├── lib/                    # Reusable library scripts (sourced)
│   ├── packages.sh         # Wrapper around apt/dpkg & dry-run handling
│   ├── services.sh         # Wrapper around systemd/systemctl abstraction
│   └── ...
├── profiles/               # Profile declarative lists (e.g. minimal.profile)
├── DOCS/                   # Comprehensive developer documentation
│   └── MODULE_GUIDE.md     # Module creation & contract architecture guide
└── packages/               # The 12-category module scripts
    ├── core/
    ├── development/
    ├── docker/
    ├── languages/
    └── ...
```

For a detailed walkthrough, see [ARCHITECTURE.md](ARCHITECTURE.md) and [DOCS/MODULE_GUIDE.md](DOCS/MODULE_GUIDE.md).

---

## 📥 Installation

Clone the DEM repository onto your Debian 13 system:

```bash
git clone https://github.com/your-username/dem.git
cd dem
```

Verify that your system meets the basic requirements and that the diagnostics pass using the **doctor** command:

```bash
./dem.sh doctor
```

---

## 📋 Available Profiles

DEM configures system components dynamically according to **Profiles**. A profile acts as a blueprint containing a specific ordered list of modules.

| Profile Name | Target Audience / Environment | Core Modules Installed |
| :--- | :--- | :--- |
| **`minimal`** | Base containers, minimal CLI-only VPS | `core`, `system` |
| **`server`** | Core production or staging Debian servers | `core`, `system`, `docker`, `databases`, `languages`, `databases-engines`, `tools`, `server` |
| **`desktop`** | Local workstation / development laptops | *Full Stack:* `core`, `system`, `development`, `docker`, `databases`, `languages`, `databases-engines`, `frameworks`, `office`, `tools`, `desktop` |

---

## 📦 Available Modules

All DEM scripts inside `packages/` belong to one of the strict architectural modules:

1. **`core`**: Essential compilation tools, certificates, base build utilities (`ca-certificates`, `gnupg`, `build-essential`, `wget`, `curl`, `git`, `unzip`, etc.).
2. **`system`**: Standard host configurations including system clock/timezone, hostname validation, locales generator, and `sudo` access.
3. **`development`**: Developer convenience tools like `jq`, `tree`, `less`, and system-wide `bash-completion`.
4. **`docker`**: Modern Docker Engine stack, including `docker-ce`, `containerd`, and `docker-compose-plugin`.
5. **`languages`**: Compilers and runtimes for Node.js (LTS), Go, PHP, and Rust (`cargo`, `rustc`).
6. **`databases`**: Common database client utilities (`mariadb-client`, `redis-tools`, `sqlite3`).
7. **`databases-engines`**: Fully decoupled production-grade database services including ScyllaDB, DragonflyDB, Redpanda, and Vespa.
8. **`frameworks`**: Modern lightweight development stacks (Laravel Composer setups, WordPress CLI, and React Native/Expo supporting OpenJDK, adb, and fastboot).
9. **`tools`**: Command line utilities (`gh`, `kubectl`, `helm`, `terraform`, `htop`, `btop`, `ripgrep`, `fzf`, `bat`, `eza`, `fastfetch`).
10. **`desktop`**: VS Code installation, Fira Code / Hack Nerd fonts.
11. **`office`**: Document and productivity suite (`libreoffice`, `evince`).
12. **`server`**: Host monitoring and security tools (`ufw`, `fail2ban`, `prometheus-node-exporter`).

---

## 💻 CLI Command Interface

The `dem.sh` executable provides a standardized, unified CLI interface supporting full profile orchestration, verification, diagnostics, dry-run simulation, and repository maintenance.

### Key CLI Commands

#### 1. Profile Application (`profile apply`)
Orchestrates the complete lifecycle (**Install** $\rightarrow$ **Configure** $\rightarrow$ **Verify**) sequentially across all modules defined in a given profile.
```bash
# Apply desktop profile
sudo ./dem.sh profile apply desktop

# Apply minimal profile with dry-run simulation
sudo ./dem.sh profile apply minimal --dry-run
```

#### 2. Health & Dependency Diagnostics (`doctor`)
Runs comprehensive system-level checks to verify OS compatibility (Debian 13 Trixie requirement), internet connectivity, APT, systemd, and installed optional runtimes.
```bash
./dem.sh doctor
```

#### 3. Repository Static Validation (`validate`)
Executes static code audits including line ending checks (CRLF prevention), Shebang headers, executable file mode verification, Bash compilation syntax checks (`bash -n`), profile/controller consistency, and 12-category 4-script lifecycle integrity.
```bash
./dem.sh validate
```

#### 4. Environment Verification & Unified Scanner (`verify`)
Runs verification checks for all installed modules or for a specific profile/module without modifying system configuration.
```bash
# Verify entire system
./dem.sh verify

# Verify specific profile
./dem.sh verify desktop

# Verify with dry-run mode
sudo ./dem.sh verify desktop --dry-run
```

#### 5. System Status Check (`status`)
Scans all installed services and module binaries, outputting a structured status report (`[OK]`, `[WARN]`, `[FAIL]`).
```bash
./dem.sh status
```

#### 6. System Workspace Repair (`repair`)
Safe, automated workspace maintenance command that normalizes line endings (LF), fixes Shebang headers, strips executable bits from sourced library files under `lib/`, and sets correct permissions (`0755`) for executable controllers.
```bash
sudo ./dem.sh repair
```

#### 7. System Cleanup (`cleanup`)
Cleans temporary APT caches, orphaned packages, and build debris.
```bash
sudo ./dem.sh cleanup
```

#### 8. Backup & Restore Configuration (`backup`, `restore`)
Compresses and backs up system configuration files, or restores from an existing archive.
```bash
# Create backup archive
sudo ./dem.sh backup

# Restore from backup archive
sudo ./dem.sh restore /path/to/dem-backup.tar.gz
```

#### 9. Dry-Run Simulation (`--dry-run`)
Pass `--dry-run` to any execution command to simulate execution, verify prerequisites, and log actions without installing packages or modifying disk state.
```bash
sudo ./dem.sh profile apply server --dry-run
```

---

## 🛠️ Development Workflow

We enforce a strict architectural standard for module development. Refer to [DEVELOPMENT.md](DEVELOPMENT.md), [CONTRIBUTING.md](CONTRIBUTING.md), and [DOCS/MODULE_GUIDE.md](DOCS/MODULE_GUIDE.md) for detailed guidelines.

* **Exactly 4 Scripts**: Every sub-module under `packages/` must contain exactly four scripts:
  - `install.sh`: Installs required packages and binaries.
  - `configure.sh`: Applies configurations, directory structures, users, and starts services.
  - `verify.sh`: Validates binaries exist, services respond, and configurations are active.
  - `uninstall.sh`: Completely purges directories, users, packages, repos, and keys.
* **Standardized Return Exit Codes**:
  - `0` (`DEM_EXIT_SUCCESS`): Operation completed successfully.
  - `1` (`DEM_EXIT_ERROR`): General error / unexpected failure.
  - `2` (`DEM_EXIT_PREREQ_MISSING`): Missing prerequisite or non-Debian platform.
  - `3` (`DEM_EXIT_SKIP_ALREADY_INSTALLED`): Idempotency check passed; component already installed/configured.
* **Strict Mode**: Every runnable script must start with:
  ```bash
  #!/usr/bin/env bash
  set -euo pipefail
  ```
* **No Direct systemctl Calls**: Always call service managers via the DEM wrapper `dem_service_*` defined in `lib/services.sh`.

---

## 💻 Windows Development & Transfer Recommendations

DEM supports cross-platform development on Windows and deployment on Debian 13. Observe the following guidelines to ensure an optimal environment free of line ending or permissions errors:

### 1. Git Configuration
Configure Git to check out and store standard Unix line endings (LF) globally on your host:
```bash
git config --global core.autocrlf false
```
The repository includes a strict `.gitattributes` file which guarantees that Git checkouts on any operating system are automatically normalized to LF line endings.

### 2. Editor Configuration
An `.editorconfig` file is included in the root directory. Compatible editors automatically enforce:
- UTF-8 encoding
- Unix Line Endings (LF)
- Final newline
- 4-space indentation

### 3. Transferring Repository to Debian 13
When copying the repository from Windows to Debian 13, avoid drag-and-drop actions that strip metadata or alter line endings. Instead, archive as a ZIP file, transfer, and extract:
```bash
unzip dem.zip -d dem
cd dem
sudo ./dem.sh repair
```

---

## 🔍 Troubleshooting

1. **Windows line endings error (`env: 'bash\r': No such file or directory`)**:
   Run the automated repair controller on Debian to normalize line endings across all files:
   ```bash
   sudo ./dem.sh repair
   ```
2. **Missing Executable Permissions**:
   If a script refuses to execute due to permission errors, run:
   ```bash
   sudo ./dem.sh repair
   ```
3. **Missing CPU Instruction Sets for ScyllaDB**:
   ScyllaDB requires modern x86-64 CPU vector instructions. In basic VM environments, `scylla-server` may fail to start. The installer gracefully logs a warning during verification.
4. **Keyring Failures / Keyservers Offline**:
   If HKP keyservers are unreachable, DEM automatically falls back to fetching keyrings over HTTPS using secure fallback endpoints.
5. **Broken APT State**:
   Run repair to fix unfinished installations or broken dependencies:
   ```bash
   sudo ./dem.sh repair
   ```

---

## 🗑️ Uninstall Process

To completely clean your environment and remove everything installed by a given profile, run the uninstall flow. This is executed in **reverse architectural order** to ensure dependent modules are uninstalled cleanly:

```bash
sudo ./dem.sh uninstall desktop
```

This cleans up system packages, custom APT keyrings, and third-party sources files, restoring the system to a clean state.

---

## 📄 License

DEM is open-source software licensed under the [MIT License](LICENSE). Developed with care by Hossein Eftekharrad.
