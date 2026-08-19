#!/usr/bin/env bash
set -euo pipefail
dem_title "System"

if dem_is_dry_run; then
    dem_dry_run_log "Installing System base packages (locales, tzdata, sudo)"
    dem_package_install locales tzdata sudo
    dem_success "System base packages simulation completed."
    exit "${DEM_EXIT_SUCCESS:-0}"
fi

# Install locales and tzdata
dem_package_install locales tzdata sudo

dem_success "System base packages installed."
