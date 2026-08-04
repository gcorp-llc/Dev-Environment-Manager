#!/usr/bin/env bash

set -euo pipefail

dem_title "Frameworks - Verification"

source "$DEM_PACKAGE_DIR/frameworks/laravel/verify.sh"
source "$DEM_PACKAGE_DIR/frameworks/wordpress/verify.sh"
source "$DEM_PACKAGE_DIR/frameworks/react-native/verify.sh"
source "$DEM_PACKAGE_DIR/frameworks/flutter/verify.sh"

dem_success "All framework submodules verified successfully."
