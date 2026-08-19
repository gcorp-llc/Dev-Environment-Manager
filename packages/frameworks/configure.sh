#!/usr/bin/env bash
set -euo pipefail
dem_title "Frameworks - Configuration"

source "$DEM_PACKAGE_DIR/frameworks/laravel/configure.sh"
source "$DEM_PACKAGE_DIR/frameworks/wordpress/configure.sh"
source "$DEM_PACKAGE_DIR/frameworks/react-native/configure.sh"
source "$DEM_PACKAGE_DIR/frameworks/flutter/configure.sh"

dem_success "All framework submodules configured successfully."
