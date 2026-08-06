#!/usr/bin/env bash

set -euo pipefail

dem_title "Server - Verification"

source "$DEM_PACKAGE_DIR/server/security/verify.sh"
source "$DEM_PACKAGE_DIR/server/monitoring/verify.sh"

dem_success "All server submodules verified successfully."
