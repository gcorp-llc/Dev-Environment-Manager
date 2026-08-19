#!/usr/bin/env bash
set -euo pipefail
dem_title "Verify Desktop Development Tools"

source "$DEM_PACKAGE_DIR/tools/vscode/verify.sh"

dem_success "Desktop development tools verified."
