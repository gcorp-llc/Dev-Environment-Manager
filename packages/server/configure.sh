#!/usr/bin/env bash
set -euo pipefail
dem_title "Server - Configuration"

source "$DEM_PACKAGE_DIR/server/security/configure.sh"
source "$DEM_PACKAGE_DIR/server/monitoring/configure.sh"

dem_success "All server submodules configured successfully."
