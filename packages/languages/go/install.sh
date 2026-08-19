#!/usr/bin/env bash
set -euo pipefail
dem_title "Go"

# 1. Idempotency Check: if go is already installed
if dem_command_exists go; then
    dem_info "Go is already installed."
    dem_success "Go installation check passed (no reinstall needed)."
    exit "${DEM_EXIT_SKIP_ALREADY_INSTALLED:-3}"
fi

# 2. Dry-Run Handling
if dem_is_dry_run; then
    dem_package_update
    dem_package_install golang-go
    dem_success "Go installation simulated."
    exit "${DEM_EXIT_SUCCESS:-0}"
fi

# 3. Installation via APT
dem_package_update
dem_package_install golang-go

dem_success "Go installed."
