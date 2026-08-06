#!/usr/bin/env bash

set -euo pipefail

dem_command_install() {

    local profile="${1:-desktop}"

    dem_validate_environment
    dem_validate_root

    dem_title "Loading Profile: $profile"

    dem_profile_load "$profile"

    dem_title "Updating Package Index"

    dem_package_update

    dem_title "Installing Profile Modules: $profile"

    for module in "${DEM_MODULES[@]}"; do
        dem_info "Installing Module: $module"
        source "$DEM_PACKAGE_DIR/$module/install.sh"

        dem_info "Configuring Module: $module"
        source "$DEM_PACKAGE_DIR/$module/configure.sh"

        dem_info "Verifying Module: $module"
        source "$DEM_PACKAGE_DIR/$module/verify.sh"
    done

    dem_success "Installation and configuration completed for profile: $profile."

}
