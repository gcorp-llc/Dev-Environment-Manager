#!/usr/bin/env bash

set -euo pipefail

dem_command_configure() {

    local profile="${1:-desktop}"

    dem_validate_root

    dem_title "Configuring Profile: $profile"

    dem_profile_load "$profile"

    for module in "${DEM_MODULES[@]}"; do
        dem_info "Configuring Module: $module"
        source "$DEM_PACKAGE_DIR/$module/configure.sh"
    done

    dem_success "Configuration completed for profile: $profile."

}
