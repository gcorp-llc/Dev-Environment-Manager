#!/usr/bin/env bash
set -euo pipefail
dem_title "Configure PostgreSQL"

if dem_service_exists postgresql; then
    dem_service_enable postgresql
    dem_service_start postgresql
fi

dem_success "PostgreSQL configuration completed."
