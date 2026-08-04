#!/usr/bin/env bash

set -euo pipefail

dem_title "Configure PostgreSQL"

dem_service_enable postgresql || true
dem_service_start postgresql || true

dem_success "PostgreSQL configured and started."
