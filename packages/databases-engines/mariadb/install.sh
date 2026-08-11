#!/usr/bin/env bash
set -euo pipefail
dem_title "MariaDB Server"

dem_package_update

dem_package_install \
    mariadb-server \
    mariadb-client

dem_success "MariaDB server installed."
