#!/usr/bin/env bash
set -euo pipefail
dem_title "Configure PostgreSQL"

if dem_is_dry_run; then
    dem_dry_run_log "Enabling and starting postgresql systemd service"
    dem_success "PostgreSQL configuration simulated."
    exit "${DEM_EXIT_SUCCESS:-0}"
fi

if dem_service_exists postgresql; then
    dem_service_enable postgresql
    dem_service_start postgresql
fi

dem_success "PostgreSQL configuration completed."
