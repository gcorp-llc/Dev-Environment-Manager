#!/usr/bin/env bash
set -euo pipefail
dem_title "Databases Engines - Uninstallation"

source "$DEM_PACKAGE_DIR/databases-engines/vespa/uninstall.sh"
source "$DEM_PACKAGE_DIR/databases-engines/redpanda/uninstall.sh"
source "$DEM_PACKAGE_DIR/databases-engines/dragonfly/uninstall.sh"
source "$DEM_PACKAGE_DIR/databases-engines/scylladb/uninstall.sh"

dem_success "All database engine submodules uninstalled successfully."
