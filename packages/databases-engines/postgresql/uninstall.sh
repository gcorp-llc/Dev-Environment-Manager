#!/usr/bin/env bash

set -euo pipefail

dem_title "Uninstall PostgreSQL"

systemctl stop postgresql || true
systemctl disable postgresql || true

dem_package_remove postgresql postgresql-contrib

dem_success "PostgreSQL uninstalled."
