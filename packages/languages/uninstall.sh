#!/usr/bin/env bash
set -euo pipefail
dem_title "Languages - Uninstallation"

source "$DEM_PACKAGE_DIR/languages/go/uninstall.sh"
source "$DEM_PACKAGE_DIR/languages/php/uninstall.sh"
source "$DEM_PACKAGE_DIR/languages/node/uninstall.sh"
source "$DEM_PACKAGE_DIR/languages/rust/uninstall.sh"

dem_success "All languages submodules uninstalled successfully."
