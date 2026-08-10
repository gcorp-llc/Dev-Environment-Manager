#!/usr/bin/env bash
set -euo pipefail
dem_title "Databases Clients"

dem_package_install \
    mariadb-client \
    redis-tools \
    sqlite3

dem_success "Database clients installed."
