#!/usr/bin/env bash
set -euo pipefail
dem_title "Configure MariaDB"

if dem_service_exists mariadb; then
    dem_service_enable mariadb
    dem_service_start mariadb
fi

dem_success "MariaDB configuration completed."
