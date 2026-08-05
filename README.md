# Dev Environment Manager (DEM)

Dev Environment Manager (DEM) is a production-ready, modular, Bash-based environment provisioning framework targeting **Debian 13 (Trixie)**. It empowers Lead Architects, Release Engineers, and DevOps developers to provision consistent developer, desktop, and server workspaces in an automated, secure, and idempotent manner.

---

## 📖 Table of Contents
- [Project Overview](#-project-overview)
- [Project Architecture](#-project-architecture)
- [Installation](#-installation)
- [Available Profiles](#-available-profiles)
- [Available Modules](#-available-modules)
- [Command Examples](#-command-examples)
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
* **Full Idempotency**: Run any script twice without duplicate side-effects or corrupting system state.
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
│   ├── install.sh
│   ├── configure.sh
│   ├── verify.sh
│   └── ...
├── lib/                    # Reusable library scripts (sourced)
│   ├── packages.sh         # Wrapper around apt/dpkg
│   ├── services.sh         # Wrapper around systemd/systemctl
│   └── ...
├── profiles/               # Profile declarative lists (e.g. minimal.profile)
└── packages/               # The 12-category module scripts
    ├── core/
    ├── development/
    ├── docker/
    ├── languages/
    └── ...
```

For a detailed walkthrough, see our [ARCHITECTURE.md](ARCHITECTURE.md).

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
4. **`docker`**: Modern Docker Engine stack, including the `docker-ce`, `containerd`, and the modern `docker-compose-plugin`.
5. **`languages`**: Compilers and runtimes for Node.js (LTS), Go, PHP, and Rust (`cargo`, `rustc`).
6. **`databases`**: Common database client utilities (`psql`, `mariadb-client`, `redis-tools`, `sqlite3`).
7. **`databases-engines`**: Fully decoupled production-grade database services including PostgreSQL, ScyllaDB, DragonflyDB, and Meilisearch.
8. **`frameworks`**: Modern lightweight development stacks (Laravel Composer setups, WordPress CLI, and React Native/Expo supporting OpenJDK, adb, and fastboot).
9. **`tools`**: Command line utilities (`gh`, `kubectl`, `helm`, `terraform`, `htop`, `btop`, `ripgrep`, `fzf`, `bat`, `eza`, `fastfetch`).
10. **`desktop`**: VS Code installation, Fira Code / Hack Nerd fonts.
11. **`office`**: Document and productivity suite (`libreoffice`, `evince`).
12. **`server`**: Host monitoring and security tools (`ufw`, `fail2ban`, `prometheus-node-exporter`).

---

## 💻 Command Examples

The interface of `dem.sh` is straightforward, supporting all release commands.

### 1. Perform System Health Check
Check connectivity, APT configuration, systemd availability, and pre-installed dependencies:
```bash
./dem.sh doctor
```

### 2. Install a Profile (e.g. Desktop)
Runs the `install.sh`, `configure.sh`, and `verify.sh` scripts sequentially for all modules registered inside the desktop profile:
```bash
sudo ./dem.sh install desktop
```

### 3. Check System Status
Verify whether languages, tools, databases, and Docker are up and running:
```bash
./dem.sh status
```

### 4. Re-run Verification Only
Quickly runs all verify scripts to validate that current configuration is correct and active:
```bash
./dem.sh verify desktop
```

### 5. Backup Current Configuration
Compress and backup configuration files:
```bash
sudo ./dem.sh backup
```

---

## 🛠️ Development Workflow

We enforce an extremely strict engineering style to keep DEM maintainable. Refer to [DEVELOPMENT.md](DEVELOPMENT.md) and [CONTRIBUTING.md](CONTRIBUTING.md) for deeper instructions.

* **Exactly 4 Scripts**: Every sub-module in `packages/` must contain exactly four files:
  - `install.sh`: Downloads/installs packages.
  - `configure.sh`: Sets up configurations, directories, users, and starts systemd services.
  - `verify.sh`: Asserts binaries exist, configurations are valid, and endpoints respond.
  - `uninstall.sh`: Completely purges directories, users, packages, repositories, and keys.
* **Strict Mode**: Every runnable script must start with:
  ```bash
  #!/usr/bin/env bash
  set -euo pipefail
  ```
* **No Direct systemctl**: Call service managers via the DEM wrapper `dem_service_*` to remain consistent.

---

## 💻 Windows Development & Transfer Recommendations

DEM fully supports cross-platform development on Windows and deployment on Debian 13. To ensure an optimal, production-ready environment free of line ending or permissions errors, please observe the following guidelines:

### 1. Git Configuration
Configure Git to check out and store standard Unix line endings (LF) globally on your Windows host:
```bash
git config --global core.autocrlf false
```
The repository includes a strict `.gitattributes` file which guarantees that Git checkouts on any operating system are automatically normalized to LF line endings for all scripts, service descriptors, and documentation.

### 2. Editor Configuration
An `.editorconfig` file is included in the root directory. VS Code and other common editors will automatically load these settings, ensuring that files are saved with:
- UTF-8 encoding
- Unix Line Endings (LF)
- A final newline
- 4-space indentations

### 3. Transferring Repository to Debian 13
When copying the repository from Windows to a Debian 13 system, avoid drag-and-drop actions which can strip file metadata or alter endings. Instead, package the directory as a ZIP file, copy it, and extract it:
```bash
unzip dem.zip -d dem
cd dem
```
Then run the automated repair controller to safely normalize and verify all workspace properties:
```bash
./dem.sh repair
```

---

## 🔍 Troubleshooting

1. **Windows line endings error (`env: 'bash\r': No such file or directory`)**:
   This occurs when files are checked out or transferred with CRLF line endings. To resolve this, run the automated repair command on Debian:
   ```bash
   ./dem.sh repair
   ```
2. **Missing Executable Permissions**:
   If some script is not running because of a permission error, let the repair tool safely set correct permissions for all executable scripts:
   ```bash
   ./dem.sh repair
   ```
3. **Missing CPU Features for ScyllaDB**:
   ScyllaDB is highly performant and requires modern CPU instruction sets. If running in basic VMs or sandboxes, the `scylla-server` service may refuse to start. The installer gracefully reports this warning during verify.
4. **Keyring Failures / Keyservers Offline**:
   If port 80/HKP keyserver is blocked on your network, DEM automatically falls back to fetching keyrings over HTTPS using standard secure URLs.
5. **Broken APT State**:
   Run the repair command to fix unfinished installations or broken dependencies:
   ```bash
   sudo ./dem.sh repair
   ```

---

## 🗑️ Uninstall Process

To completely clean your environment and remove everything installed by a given profile, run the uninstall flow. This is executed in **reverse architecture order** to ensure dependent modules are uninstalled cleanly:

```bash
sudo ./dem.sh uninstall desktop
```

This cleans up system packages, custom APT keyrings, and third-party sources files, restoring the system to a clean state.

---

## 📄 License

DEM is open-source software licensed under the [MIT License](LICENSE). Developed with care by Hossein Eftekharrad.
