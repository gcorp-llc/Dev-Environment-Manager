#!/usr/bin/env bash

set -euo pipefail

dem_title "Server - Uninstallation"

source "$DEM_PACKAGE_DIR/server/monitoring/uninstall.sh"
source "$DEM_PACKAGE_DIR/server/security/uninstall.sh"

dem_success "All server submodules uninstalled successfully."
