#!/usr/bin/env bash
set -euo pipefail
dem_title "Desktop - Verification"

if dem_is_dry_run; then
    dem_dry_run_log "Verifying Desktop submodules (Fonts, Development Tools)"
    dem_success "Desktop verification simulated."
    exit "${DEM_EXIT_SUCCESS:-0}"
fi

source "$DEM_PACKAGE_DIR/desktop/fonts/verify.sh"
source "$DEM_PACKAGE_DIR/desktop/development-tools/verify.sh"

dem_success "All desktop submodules verified successfully."
