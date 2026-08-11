#!/usr/bin/env bash
set -euo pipefail
dem_title "Verify PostgreSQL"

dem_require_command psql

if dem_service_exists postgresql; then
    if ! dem_service_running postgresql; then
        dem_error "PostgreSQL service is not running."
        exit 1
    fi
fi

if ! sudo -u postgres psql -tAc "SELECT 1;" >/dev/null 2>&1; then
    dem_error "PostgreSQL server is not responding."
    exit 1
fi

dem_success "PostgreSQL verification completed."
