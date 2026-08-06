#!/usr/bin/env bash
set -euo pipefail
dem_title "Desktop - Configuration"

source "$DEM_PACKAGE_DIR/desktop/fonts/configure.sh"
source "$DEM_PACKAGE_DIR/desktop/development-tools/configure.sh"

dem_success "All desktop submodules configured successfully."
