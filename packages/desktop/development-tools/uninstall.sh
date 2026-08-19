#!/usr/bin/env bash
set -euo pipefail
dem_title "Uninstall Desktop Development Tools"

source "$DEM_PACKAGE_DIR/tools/vscode/uninstall.sh"

dem_success "Desktop development tools uninstalled."
