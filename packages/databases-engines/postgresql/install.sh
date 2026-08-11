#!/usr/bin/env bash
set -euo pipefail
dem_title "PostgreSQL Server"

dem_package_update

dem_package_install \
    postgresql \
    postgresql-client

dem_success "PostgreSQL server installed."
