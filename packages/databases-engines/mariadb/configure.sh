#!/usr/bin/env bash

set -euo pipefail

dem_title "Configure MariaDB"

if command -v systemctl >/dev/null 2>&1; then
    dem_service_enable mariadb
    dem_service_start mariadb
fi

dem_success "MariaDB configuration completed."