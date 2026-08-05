#!/usr/bin/env bash

set -euo pipefail

dem_title "Desktop - Verification"

source "$DEM_PACKAGE_DIR/desktop/fonts/verify.sh"
source "$DEM_PACKAGE_DIR/desktop/development-tools/verify.sh"

dem_success "All desktop submodules verified successfully."
