# Dev Environment Manager (DEM) CI/CD and Debian 13 Validation Infrastructure

This document outlines the complete, production-grade CI/CD and platform validation infrastructure designed for **Dev Environment Manager (DEM) v1.0.0**.

---

## 1. CI/CD Architecture

The validation architecture of DEM is designed as a multi-stage, layered pipeline. Each stage isolates specific guarantees—ranging from repository static properties to live provisioning lifecycles on a real Debian 13 OS.

```
+-----------------------------------------------------------+
|                      STATIC VALIDATION                    |
|  - CRLF / BOM Check       - Executable Bits / Modes       |
|  - Bash Syntax (bash -n)  - ShellCheck Compliance         |
|  - Package Contracts      - Documentation Consistency     |
+-----------------------------------------------------------+
                              |
                              v
+-----------------------------------------------------------+
|                    DEBIAN 13 SYSTEMD BOOT                 |
|  - Launches a real, systemd-enabled debian:trixie         |
|  - Validates ID=debian & VERSION_CODENAME=trixie         |
+-----------------------------------------------------------+
                              |
                              v
+-----------------------------------------------------------+
|                NETWORK FAILURE SAFETY TEST                |
|  - Disconnects container bridge networking                |
|  - Verifies DEM aborts non-zero with clean message        |
+-----------------------------------------------------------+
                              |
                              v
+-----------------------------------------------------------+
|               PROFILE LIFECYCLE TESTS (x3)                |
|  - Minimal / Server Profile Pipelines                      |
|  - Steps: INSTALL -> VERIFY -> DOCTOR -> VALIDATE ->      |
|    INSTALL AGAIN (Idempotency) -> UNINSTALL -> REINSTALL  |
+-----------------------------------------------------------+
                              |
                              v
+-----------------------------------------------------------+
|                      FINAL RELEASE GATE                   |
|  - Asserts 100% green status of all previous stages       |
+-----------------------------------------------------------+
```

---

## 2. GitHub Workflows

The automated pipeline is defined in `.github/workflows/dem-ci.yml` and is triggered on every push and pull request targeting the `main`, `master`, or `feature/*` branches. It is comprised of three core jobs:

1.  **`static-checks`**:
    *   Executes on a high-speed GHA runner (`ubuntu-latest`).
    *   Installs static analysis dependencies (`shellcheck`).
    *   Triggers `./dem.sh validate` to verify overall repository health and documentation consistency.
2.  **`debian-13-runtime-validation`**:
    *   Launches and coordinates the Docker-in-Docker systemd-enabled testing sandbox.
    *   Orchestrates network failure testing, diagnostics, and full profile provisioning lifecycles.
3.  **`release-gate`**:
    *   A blocking gate that depends on both `static-checks` and `debian-13-runtime-validation`.
    *   Ensures all pipeline validations pass perfectly before the branch is declared release-ready.

---

## 3. Debian 13 Runtime Strategy

Since GHA runners run on Ubuntu, running DEM directly on the runner host is prohibited as DEM is strictly designed to target Debian 13.
To achieve absolute confidence, we employ a **real, systemd-enabled, containerized Debian 13 (Trixie) boot environment**.

We run a privileged container with `/lib/systemd/systemd` as PID 1, mounting appropriate temporary filesystems and cgroups (`--tmpfs /tmp --tmpfs /run --tmpfs /run/lock -v /sys/fs/cgroup:/sys/fs/cgroup:ro --privileged`). This spins up standard background dbus/systemd daemons natively, meaning raw wrappers in `lib/services.sh` execute against a genuine systemd manager.

---

## 4. Static Validation

Repository properties are checked statically using the `./dem.sh validate` controller. These checks include:

*   **Line Endings**: Validates that all `.sh`, `.profile`, `.service`, `.conf`, `.env`, and `.md` files use LF line endings, rejecting any CRLF line endings.
*   **UTF-8 BOM Check**: Asserts the absence of Byte Order Marks in script files.
*   **Executable Permissions**: Verifies library files (under `lib/` and `config.sh`) are not executable (`100644`), while all entrypoints and controller commands are executable (`100755`).
*   **Bash Syntax**: Checks syntax compilation via `bash -n` on all shell assets.
*   **ShellCheck Compliance**: Leverages ShellCheck to identify potential bugs, bad practices, or unquoted variables.
*   **Package Structure & Lifecycle Contracts**: Audits that all directories under `packages/` directly containing scripts adhere strictly to the 4-file contract (`install.sh`, `configure.sh`, `verify.sh`, and `uninstall.sh`).
*   **Documentation Consistency**: Deterrent engine verifying facts in `.md` files:
    *   Documented `./dem.sh <command>` references must exist as controllers under `commands/`.
    *   Documented profiles must exist in `profiles/`.
    *   References to directories must exist.
    *   Prohibits statements designating Ubuntu as a supported platform.

---

## 5. Runtime Validation

Runtime validation occurs within the live Debian 13 environment. The bootstrap scripts (`./bootstrap.sh`), pre-flight check tools (`./dem.sh doctor`), and repository diagnostics (`./dem.sh validate`) are run natively inside the container. This verifies ID suite detection, APT repositories configuration, pathing, and dependency assertions.

---

## 6. Profile Testing

The pipeline validates the three primary profiles (`minimal`, `server`, and `desktop`) under live deployment lifecycles:

*   **`minimal`**: Light CLI footprint (`core`, `system`).
*   **`server`**: Dense service workload (`core`, `system`, `docker`, `databases`, `languages`, `databases-engines`, `tools`, `server`).
*   **`desktop`**: Full workstation developer blueprint.

---

## 7. Idempotency Testing

Every installer profile is ran twice in succession:
```bash
./dem.sh install <profile>
./dem.sh install <profile>
```
The second installation must execute cleanly without:
*   Duplicating system users, groups, or GPG keys.
*   Duplicating APT source lines in `/etc/apt/sources.list.d/`.
*   Overwriting or breaking existing service directories.
*   Reporting errors or failures on pre-existing resources.

---

## 8. Uninstall Testing

We run:
```bash
./dem.sh uninstall <profile>
```
The uninstallation sequence walks the loaded module list **in reverse order**, checking that packages, vendor-specific APT sources list files, custom GPG keys, and service daemons are fully cleaned up without leaving orphaned components or corrupting unrelated system parts.

---

## 9. Reinstall Testing

After the uninstall phase completes, we execute a second, clean installation pass followed by verification:
```
INSTALL -> VERIFY -> UNINSTALL -> INSTALL -> VERIFY
```
This guarantees that uninstallation of a profile leaves the operating system in a perfectly clean state, and that the framework can rebuild the environment from scratch without manual intervention or host reboots.

---

## 10. Security Validation

*   **Secure Keys Management**: We strictly avoid deprecated, unsafe global commands such as `apt-key`. All third-party software imports secure vendor GPG keys under `/etc/apt/keyrings/` and registers repositories with `signed-by=` attributes.
*   **ScyllaDB Safety Protection**: ScyllaDB 5.4 lacks an official `trixie` repository channel. To prevent package pollution or host corruption using Debian 12 (bookworm) channels on a Debian 13 installation, DEM's installer explicitly errors out by default on Debian 13.
*   **Privilege Constraints**: Scripts execute safely with strict shell options (`set -euo pipefail` / `set -Eeuo pipefail`).

---

## 11. Known Limitations

*   **ScyllaDB on Trixie**: Requires the `DEM_ALLOW_UNSUPPORTED_SCYLLA=true` override flag during GHA or manual testing on trixie to skip package installation gracefully, avoiding silent platform mixing.
*   **AVX/SSE4.2 Instructions**: Background database service verification for nested virtual environments might return non-fatal warnings if the sandbox CPU lacks modern hardware acceleration vector extensions.

---

## 12. Final Release Gate

The repository cannot be merged or considered release-ready unless the static checks, network-isolated safety testing, and multi-profile install-verify-uninstall-reinstall cycles are completely and natively green in the systemd-enabled Debian 13 environment.
