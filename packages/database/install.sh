#!/usr/bin/env bash

dem_title "Database"

dem_package_install \
    postgresql \
    postgresql-client \
    sqlite3

source "$DEM_PACKAGE_DIR/database/configure.sh"

source "$DEM_PACKAGE_DIR/database/verify.sh"

dem_success "Database installation completed."