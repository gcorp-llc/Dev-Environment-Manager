#!/usr/bin/env bash
set -euo pipefail
dem_title "Configure Core"

if dem_is_dry_run; then
    dem_dry_run_log "Configuring /etc/apt/keyrings with 0755 permissions"
    dem_success "Core configuration simulated."
    exit "${DEM_EXIT_SUCCESS:-0}"
fi

mkdir -p /etc/apt/keyrings

chmod 0755 /etc/apt/keyrings

dem_success "Core configuration completed."
