#!/usr/bin/env bash
set -euo pipefail
dem_title "Desktop - Uninstallation"

source "$DEM_PACKAGE_DIR/desktop/development-tools/uninstall.sh"
source "$DEM_PACKAGE_DIR/desktop/fonts/uninstall.sh"

dem_success "All desktop submodules uninstalled successfully."
