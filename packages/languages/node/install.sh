#!/usr/bin/env bash
set -euo pipefail
dem_title "Node.js"

DEM_NODE_MAJOR="${DEM_NODE_MAJOR:-24}"

# 1. Idempotency Check: if Node.js of the correct major version is already installed
node_installed=false
if dem_command_exists node; then
    installed_version=$(node -v | sed 's/^v//')
    installed_major=$(echo "$installed_version" | cut -d. -f1)
    if [[ "$installed_major" == "$DEM_NODE_MAJOR" ]]; then
        node_installed=true
    fi
fi

if [[ "$node_installed" == "true" && -f /etc/apt/keyrings/nodesource.gpg && -f /etc/apt/sources.list.d/nodesource.list ]]; then
    dem_info "Node.js ${DEM_NODE_MAJOR} is already installed and correctly configured."
    dem_success "Node.js installation check passed (no reinstall needed)."
    exit "${DEM_EXIT_SKIP_ALREADY_INSTALLED:-3}"
fi

# 2. Dry-Run Handling
if dem_is_dry_run; then
    dem_dry_run_log "Setting up /etc/apt/keyrings/nodesource.gpg"
    dem_dry_run_log "Setting up /etc/apt/sources.list.d/nodesource.list for NodeSource Node.js ${DEM_NODE_MAJOR}.x"
    dem_package_update
    dem_package_install nodejs
    dem_success "Node.js installation simulated."
    exit "${DEM_EXIT_SUCCESS:-0}"
fi

# 3. Setup official signed NodeSource APT Repository
mkdir -p /etc/apt/keyrings
curl -fsSL https://deb.nodesource.com/gpgkey/nodesource-repo.gpg.key | gpg --dearmor --yes -o /etc/apt/keyrings/nodesource.gpg
echo "deb [signed-by=/etc/apt/keyrings/nodesource.gpg] https://deb.nodesource.com/node_${DEM_NODE_MAJOR}.x nodistro main" > /etc/apt/sources.list.d/nodesource.list

dem_package_update

# 4. Install nodejs (includes npm) from NodeSource
dem_package_install nodejs

dem_success "Node.js installed."
