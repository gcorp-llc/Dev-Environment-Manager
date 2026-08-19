#!/usr/bin/env bash
set -euo pipefail
dem_title "Verify PostgreSQL"

if dem_is_dry_run; then
    dem_dry_run_log "Verifying psql client, postgresql service status, and query health"
    dem_success "PostgreSQL verification simulated."
    exit "${DEM_EXIT_SUCCESS:-0}"
fi

dem_require_command psql

if dem_service_exists postgresql; then
    if ! dem_service_running postgresql; then
        dem_fatal_code "${DEM_EXIT_PREREQ_MISSING:-2}" "PostgreSQL service is not running."
    fi
fi

if ! sudo -u postgres psql -tAc "SELECT 1;" >/dev/null 2>&1; then
    dem_fatal_code "${DEM_EXIT_PREREQ_MISSING:-2}" "PostgreSQL server is not responding."
fi

dem_success "PostgreSQL verification completed."
