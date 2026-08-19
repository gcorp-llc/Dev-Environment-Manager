#!/usr/bin/env bash
set -euo pipefail
dem_title "VS Code"

# 1. Idempotency Check: if code is already installed
if dem_command_exists code && [[ -f /etc/apt/keyrings/packages.microsoft.gpg && -f /etc/apt/sources.list.d/vscode.list ]]; then
    dem_info "VS Code is already installed and repository configured."
    dem_success "VS Code installation check passed (no reinstall needed)."
    exit "${DEM_EXIT_SKIP_ALREADY_INSTALLED:-3}"
fi

# 2. Dry-Run Handling
if dem_is_dry_run; then
    dem_dry_run_log "Setting up /etc/apt/keyrings/packages.microsoft.gpg"
    dem_dry_run_log "Setting up /etc/apt/sources.list.d/vscode.list"
    dem_package_update
    dem_package_install code
    dem_success "VS Code installation simulated."
    exit "${DEM_EXIT_SUCCESS:-0}"
fi

# 3. Setup VS Code repository configuration & key inside /etc/apt/keyrings/
mkdir -p /etc/apt/keyrings
curl -fsSL https://packages.microsoft.com/keys/microsoft.asc | gpg --dearmor --yes -o /etc/apt/keyrings/packages.microsoft.gpg
echo "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/packages.microsoft.gpg] https://packages.microsoft.com/repos/code stable main" > /etc/apt/sources.list.d/vscode.list

dem_package_update

# 4. Install VS Code
dem_package_install code

dem_success "VS Code installed."
