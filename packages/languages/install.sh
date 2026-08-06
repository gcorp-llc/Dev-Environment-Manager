#!/usr/bin/env bash
set -euo pipefail
dem_title "Languages - Installation"

source "$DEM_PACKAGE_DIR/languages/rust/install.sh"
source "$DEM_PACKAGE_DIR/languages/node/install.sh"
source "$DEM_PACKAGE_DIR/languages/php/install.sh"
source "$DEM_PACKAGE_DIR/languages/go/install.sh"

dem_success "All languages submodules installed successfully."
