#!/usr/bin/env bash

set -euo pipefail

dem_title "Verify PostgreSQL"

dem_service_running postgresql || true
dem_require_command psql

# Run a simple query to verify connection
sudo -u postgres psql -c "SELECT 1;" >/dev/null

dem_success "PostgreSQL verified."
