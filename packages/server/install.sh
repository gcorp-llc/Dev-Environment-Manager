#!/usr/bin/env bash

set -euo pipefail

dem_title "Server - Installation"

source "$DEM_PACKAGE_DIR/server/security/install.sh"
source "$DEM_PACKAGE_DIR/server/monitoring/install.sh"

dem_success "All server submodules installed successfully."
