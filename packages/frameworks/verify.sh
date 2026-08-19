#!/usr/bin/env bash
set -euo pipefail
dem_title "Frameworks - Verification"

if dem_is_dry_run; then
    dem_dry_run_log "Verifying Frameworks (Laravel, WordPress, React Native, Flutter)"
    dem_success "Frameworks verification simulated."
    exit "${DEM_EXIT_SUCCESS:-0}"
fi

source "$DEM_PACKAGE_DIR/frameworks/laravel/verify.sh"
source "$DEM_PACKAGE_DIR/frameworks/wordpress/verify.sh"
source "$DEM_PACKAGE_DIR/frameworks/react-native/verify.sh"
source "$DEM_PACKAGE_DIR/frameworks/flutter/verify.sh"

dem_success "All framework submodules verified successfully."
