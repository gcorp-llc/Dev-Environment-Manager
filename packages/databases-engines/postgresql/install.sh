#!/usr/bin/env bash
set -euo pipefail
dem_title "PostgreSQL"

# 1. Setup official signed PostgreSQL APT Repository
mkdir -p /etc/apt/keyrings
curl -fsSL https://www.postgresql.org/media/keys/ACCC4CF8.asc | gpg --dearmor --yes -o /etc/apt/keyrings/postgresql.gpg
echo "deb [signed-by=/etc/apt/keyrings/postgresql.gpg] http://apt.postgresql.org/pub/repos/apt trixie-pgdg main" > /etc/apt/sources.list.d/pgdg.list

dem_package_update

# 2. Install PostgreSQL server
dem_package_install postgresql postgresql-contrib

dem_success "PostgreSQL installed."
