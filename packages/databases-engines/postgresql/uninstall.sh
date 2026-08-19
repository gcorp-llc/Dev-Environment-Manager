#!/usr/bin/env bash
set -euo pipefail
dem_title "Uninstall PostgreSQL"

if dem_is_dry_run; then
    dem_dry_run_log "Stopping postgresql service and removing postgresql packages"
    dem_success "PostgreSQL uninstallation simulated."
    exit "${DEM_EXIT_SUCCESS:-0}"
fi

if dem_service_exists postgresql; then
    dem_service_stop postgresql || true
    dem_service_disable postgresql || true
fi

dem_package_remove \
    postgresql \
    postgresql-client

dem_success "PostgreSQL server uninstalled."
