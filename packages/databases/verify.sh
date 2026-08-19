#!/usr/bin/env bash
set -euo pipefail
dem_title "Verify Databases Clients"

if dem_is_dry_run; then
    dem_dry_run_log "Verifying database client tools (psql, mysql, redis-cli, sqlite3)"
    dem_success "Database clients verification simulated."
    exit "${DEM_EXIT_SUCCESS:-0}"
fi

dem_require_command psql
dem_require_command mysql
dem_require_command redis-cli
dem_require_command sqlite3

dem_success "Database clients verification completed."
