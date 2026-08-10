#!/usr/bin/env bash
set -euo pipefail
dem_title "Databases Engines - Installation"

source "$DEM_PACKAGE_DIR/databases-engines/scylladb/install.sh"
source "$DEM_PACKAGE_DIR/databases-engines/dragonfly/install.sh"
source "$DEM_PACKAGE_DIR/databases-engines/redpanda/install.sh"
source "$DEM_PACKAGE_DIR/databases-engines/vespa/install.sh"

dem_success "All database engine submodules installed successfully."
