#!/usr/bin/env bash
set -euo pipefail
dem_title "Verify MariaDB"

dem_require_command mysql

if dem_service_exists mariadb; then
    if ! dem_service_running mariadb; then
        dem_error "MariaDB service is not running."
        exit 1
    fi
fi

if ! mysql --protocol=socket -uroot -e "SELECT 1;" >/dev/null 2>&1; then
    dem_error "MariaDB server is not responding."
    exit 1
fi

dem_success "MariaDB verification completed."
