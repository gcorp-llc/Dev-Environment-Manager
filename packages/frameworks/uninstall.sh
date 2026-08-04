#!/usr/bin/env bash

set -euo pipefail

dem_title "Frameworks - Uninstallation"

source "$DEM_PACKAGE_DIR/frameworks/flutter/uninstall.sh"
source "$DEM_PACKAGE_DIR/frameworks/react-native/uninstall.sh"
source "$DEM_PACKAGE_DIR/frameworks/wordpress/uninstall.sh"
source "$DEM_PACKAGE_DIR/frameworks/laravel/uninstall.sh"

dem_success "All framework submodules uninstalled successfully."
