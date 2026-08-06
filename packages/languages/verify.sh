#!/usr/bin/env bash
set -euo pipefail
dem_title "Languages - Verification"

source "$DEM_PACKAGE_DIR/languages/rust/verify.sh"
source "$DEM_PACKAGE_DIR/languages/node/verify.sh"
source "$DEM_PACKAGE_DIR/languages/php/verify.sh"
source "$DEM_PACKAGE_DIR/languages/go/verify.sh"

dem_success "All languages submodules verified successfully."
