#!/usr/bin/env bash

set -euo pipefail

dem_title "Frameworks - Installation"

source "$DEM_PACKAGE_DIR/frameworks/laravel/install.sh"
source "$DEM_PACKAGE_DIR/frameworks/wordpress/install.sh"
source "$DEM_PACKAGE_DIR/frameworks/react-native/install.sh"

dem_success "All framework submodules installed successfully."
