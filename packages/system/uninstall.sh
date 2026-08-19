#!/usr/bin/env bash
set -euo pipefail
dem_title "Uninstall System"

if dem_is_dry_run; then
    dem_dry_run_log "Simulating System uninstall (preserving base Debian configuration)"
    dem_success "System uninstall simulation completed."
    exit "${DEM_EXIT_SUCCESS:-0}"
fi

dem_warning "System package configuration cannot be fully uninstalled as it forms the basis of Debian's environment."
dem_success "System uninstall completed safely."
