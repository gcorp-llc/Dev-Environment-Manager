#!/usr/bin/env bash
set -euo pipefail
dem_title "Desktop - Installation"

source "$DEM_PACKAGE_DIR/desktop/fonts/install.sh"
source "$DEM_PACKAGE_DIR/desktop/development-tools/install.sh"

dem_success "All desktop submodules installed successfully."
