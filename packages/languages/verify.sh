#!/usr/bin/env bash
set -euo pipefail
dem_title "Languages - Verification"

if dem_is_dry_run; then
    dem_dry_run_log "Verifying Languages (Rust, Node, PHP, Go)"
    dem_success "Languages verification simulated."
    exit "${DEM_EXIT_SUCCESS:-0}"
fi

source "$DEM_PACKAGE_DIR/languages/rust/verify.sh"
source "$DEM_PACKAGE_DIR/languages/node/verify.sh"
source "$DEM_PACKAGE_DIR/languages/php/verify.sh"
source "$DEM_PACKAGE_DIR/languages/go/verify.sh"

dem_success "All languages submodules verified successfully."
