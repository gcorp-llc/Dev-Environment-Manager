#!/usr/bin/env bash
set -euo pipefail
dem_title "PostgreSQL Server"

if dem_command_exists psql && dpkg -s postgresql >/dev/null 2>&1; then
    dem_info "PostgreSQL Server is already installed."
    dem_success "PostgreSQL installation check passed (no reinstall needed)."
    exit "${DEM_EXIT_SKIP_ALREADY_INSTALLED:-3}"
fi

if dem_is_dry_run; then
    dem_dry_run_log "Installing postgresql and postgresql-client via APT"
    dem_package_update
    dem_package_install postgresql postgresql-client
    dem_success "PostgreSQL installation simulated."
    exit "${DEM_EXIT_SUCCESS:-0}"
fi

dem_package_update

dem_package_install \
    postgresql \
    postgresql-client

dem_success "PostgreSQL server installed."
