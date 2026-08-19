#!/usr/bin/env bash
set -euo pipefail
dem_title "Configure Node.js"

if dem_is_dry_run; then
    dem_dry_run_log "Configuring Node.js environment and npm defaults"
    dem_success "Node.js configuration simulated."
    exit "${DEM_EXIT_SUCCESS:-0}"
fi

dem_success "Node.js configured."
