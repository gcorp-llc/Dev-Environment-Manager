#!/usr/bin/env bash

set -euo pipefail

dem_title "Databases Engines - Uninstallation"

source "$DEM_PACKAGE_DIR/databases-engines/meilisearch/uninstall.sh"
source "$DEM_PACKAGE_DIR/databases-engines/dragonfly/uninstall.sh"
source "$DEM_PACKAGE_DIR/databases-engines/scylladb/uninstall.sh"
source "$DEM_PACKAGE_DIR/databases-engines/postgresql/uninstall.sh"

dem_success "All database engine submodules uninstalled successfully."
