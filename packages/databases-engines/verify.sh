#!/usr/bin/env bash
set -euo pipefail
dem_title "Databases Engines - Verification"

source "$DEM_PACKAGE_DIR/databases-engines/scylladb/verify.sh"
source "$DEM_PACKAGE_DIR/databases-engines/dragonfly/verify.sh"
source "$DEM_PACKAGE_DIR/databases-engines/redpanda/verify.sh"
source "$DEM_PACKAGE_DIR/databases-engines/vespa/verify.sh"

dem_success "All database engine submodules verified successfully."
