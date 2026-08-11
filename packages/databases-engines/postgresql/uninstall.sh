#!/usr/bin/env bash

set -euo pipefail

dem_title "Uninstall PostgreSQL"

if command -v systemctl >/dev/null 2>&1; then
    dem_service_stop postgresql || true
    dem_service_disable postgresql || true
fi

dem_package_remove \
    postgresql \
    postgresql-client

dem_success "PostgreSQL server uninstalled."