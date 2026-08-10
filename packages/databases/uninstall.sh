#!/usr/bin/env bash
set -euo pipefail
dem_title "Uninstall Databases Clients"

dem_package_remove \
    mariadb-client \
    redis-tools \
    sqlite3

dem_success "Database clients uninstalled."
