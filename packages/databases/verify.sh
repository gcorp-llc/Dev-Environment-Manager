#!/usr/bin/env bash
set -euo pipefail
dem_title "Verify Databases Clients"

dem_require_command psql
dem_require_command mysql
dem_require_command redis-cli
dem_require_command sqlite3

dem_success "Database clients verification completed."
