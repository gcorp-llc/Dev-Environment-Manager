# DEM v1.0 Developer Standards & Guidelines

This document outlines the coding standards, bash engineering conventions, and testing requirements for contributors working on the Dev Environment Manager (DEM).

---

## 💻 Bash Engineering Conventions

All Shell scripts in this codebase must strictly conform to these engineering practices to prevent bugs and ensure predictable runs.

### 1. Header Requirement
Every executable script (this includes everything under `commands/`, `packages/`, `profiles/`, and root scripts) must begin with:

```bash
#!/usr/bin/env bash

set -euo pipefail
```

**Exception:** Pure library helper scripts in `lib/` must not force this global setting because they are sourced inside existing environments and should remain source-safe.

### 2. Variable Expansion and Quoting
- Always quote variable expansions to prevent word splitting and globbing errors:
  ```bash
  # Correct:
  local profile="$1"
  # Incorrect:
  local profile=$1
  ```
- Use safe curly brace syntax `${variable}` when interpolating strings:
  ```bash
  echo "Setting up profile: ${DEM_PROFILE_NAME}"
  ```
- Check if a variable is defined before using it to satisfy `set -u` restrictions:
  ```bash
  if [[ -n "${SUDO_USER:-}" ]]; then
  ```

### 3. Safe Command Substitution
- Always use `$(command)` rather than deprecated backticks `` `command` ``.
- Guard command evaluations that might fail with safe error checking or default values.

---

## 📦 Lifecycle Script Contract

Every category under `packages/` must provide four scripts that are completely self-contained. Do not mix implementation responsibilities between these scripts:

* **No direct `systemctl` calls**: Always use the custom service abstractions (`dem_service_*`).
* **Check command existence**: Use the `dem_command_exists` or `dem_require_command` helpers from our utility library.
* **No `curl | bash` pipelines**: Pipelines that pipe web content directly into a shell interpreter are strictly banned for security reasons. Download files cleanly to local temporary directories and install them using standard package management tools.

---

## 🔄 Idempotency Guidelines

Every line of code you write must be runnable infinite times without altering or corrupting the desired system configuration:

1. **Creating Directories**:
   - Always use `mkdir -p` to prevent errors if directories already exist.
2. **Creating Symlinks**:
   - Always use `ln -sf` to force overwrite existing target files.
3. **Appending Configurations**:
   - Check if a block or line already exists before appending:
     ```bash
     if ! grep -q "custom-setting" /etc/myconfig.conf; then
         echo "custom-setting=true" >> /etc/myconfig.conf
     fi
     ```
4. **Users and Groups**:
   - Verify group/user existence with `getent` before running creation commands.

---

## 🧪 Testing and Verification

Before committing changes, make sure to execute the status check and doctor routines locally:

```bash
# Verify environment checks
./dem.sh doctor

# Run dry verify on the loaded profile
./dem.sh verify desktop
```

Ensure that your code is fully compatible with ShellCheck. Use the local environment or a container to lint your files where practical.
