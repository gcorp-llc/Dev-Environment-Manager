#!/usr/bin/env bash
set -euo pipefail
dem_title "Databases Engines - Installation"

source "$DEM_PACKAGE_DIR/databases-engines/postgresql/install.sh"
source "$DEM_PACKAGE_DIR/databases-engines/scylladb/install.sh"
source "$DEM_PACKAGE_DIR/databases-engines/dragonfly/install.sh"
source "$DEM_PACKAGE_DIR/databases-engines/meilisearch/install.sh"

dem_success "All database engine submodules installed successfully."
