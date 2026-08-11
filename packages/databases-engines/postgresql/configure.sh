#!/usr/bin/env bash

set -euo pipefail

dem_title "Configure PostgreSQL"

if command -v systemctl >/dev/null 2>&1; then
    dem_service_enable postgresql
    dem_service_start postgresql
fi

dem_success "PostgreSQL configuration completed."