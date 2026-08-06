#!/usr/bin/env bash
set -euo pipefail
dem_title "Databases Engines - Configuration"

source "$DEM_PACKAGE_DIR/databases-engines/postgresql/configure.sh"
source "$DEM_PACKAGE_DIR/databases-engines/scylladb/configure.sh"
source "$DEM_PACKAGE_DIR/databases-engines/dragonfly/configure.sh"
source "$DEM_PACKAGE_DIR/databases-engines/meilisearch/configure.sh"

dem_success "All database engine submodules configured successfully."
