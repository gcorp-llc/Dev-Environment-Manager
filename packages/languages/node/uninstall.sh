#!/usr/bin/env bash
set -euo pipefail
dem_title "Uninstall Node.js"

if dem_is_dry_run; then
    dem_dry_run_log "apt remove -y nodejs"
    dem_dry_run_log "Removing /etc/apt/sources.list.d/nodesource.list and /etc/apt/keyrings/nodesource.gpg"
    dem_success "Node.js uninstallation simulated."
    exit "${DEM_EXIT_SUCCESS:-0}"
fi

dem_package_remove nodejs

# Remove repository configuration
rm -f /etc/apt/sources.list.d/nodesource.list
rm -f /etc/apt/keyrings/nodesource.gpg

dem_success "Node.js uninstalled."
