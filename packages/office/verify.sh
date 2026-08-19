#!/usr/bin/env bash
set -euo pipefail
dem_title "Verify Office"

if dem_is_dry_run; then
    dem_dry_run_log "Verifying Office applications (libreoffice, evince)"
    dem_success "Office applications verification simulated."
    exit "${DEM_EXIT_SUCCESS:-0}"
fi

dem_require_command libreoffice
dem_require_command evince

# Verify packages are installed
dpkg -s libreoffice >/dev/null
dpkg -s evince >/dev/null

dem_success "Office applications verified."
