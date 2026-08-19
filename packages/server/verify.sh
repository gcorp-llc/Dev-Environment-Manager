#!/usr/bin/env bash
set -euo pipefail
dem_title "Server - Verification"

if dem_is_dry_run; then
    dem_dry_run_log "Verifying Server submodules (Security, Monitoring)"
    dem_success "Server verification simulated."
    exit "${DEM_EXIT_SUCCESS:-0}"
fi

source "$DEM_PACKAGE_DIR/server/security/verify.sh"
source "$DEM_PACKAGE_DIR/server/monitoring/verify.sh"

dem_success "All server submodules verified successfully."
