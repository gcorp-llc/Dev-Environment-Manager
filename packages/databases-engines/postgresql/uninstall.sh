#!/usr/bin/env bash

set -euo pipefail

dem_title "Uninstall PostgreSQL"

dem_service_stop postgresql || true
dem_service_disable postgresql || true

dem_package_remove postgresql postgresql-contrib

# Remove repository configuration
rm -f /etc/apt/sources.list.d/pgdg.list
rm -f /etc/apt/keyrings/postgresql.gpg

dem_success "PostgreSQL uninstalled."
