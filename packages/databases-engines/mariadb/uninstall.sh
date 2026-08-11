#!/usr/bin/env bash

set -euo pipefail

dem_title "Uninstall MariaDB"

if command -v systemctl >/dev/null 2>&1; then
    dem_service_stop mariadb || true
    dem_service_disable mariadb || true
fi

dem_package_remove \
    mariadb-server \
    mariadb-client

dem_success "MariaDB server uninstalled."