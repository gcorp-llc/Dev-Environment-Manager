#!/usr/bin/env bash
set -euo pipefail
dem_title "Configure Desktop Development Tools"

source "$DEM_PACKAGE_DIR/tools/vscode/configure.sh"

dem_success "Desktop development tools configured."
