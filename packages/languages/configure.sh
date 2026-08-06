#!/usr/bin/env bash
set -euo pipefail
dem_title "Languages - Configuration"

source "$DEM_PACKAGE_DIR/languages/rust/configure.sh"
source "$DEM_PACKAGE_DIR/languages/node/configure.sh"
source "$DEM_PACKAGE_DIR/languages/php/configure.sh"
source "$DEM_PACKAGE_DIR/languages/go/configure.sh"

dem_success "All languages submodules configured successfully."
