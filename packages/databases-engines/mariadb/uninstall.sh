#!/usr/bin/env bash
set -euo pipefail
dem_title "Uninstall MariaDB"

if dem_service_exists mariadb; then
    dem_service_stop mariadb || true
    dem_service_disable mariadb || true
fi

dem_package_remove \
    mariadb-server \
    mariadb-client

dem_success "MariaDB server uninstalled."
