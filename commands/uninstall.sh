#!/usr/bin/env bash
set -euo pipefail
dem_command_uninstall() {

    local profile="${1:-desktop}"

    dem_validate_root

    dem_title "Uninstalling Profile: $profile"

    dem_profile_load "$profile"

    # Run uninstallation in reverse order
    local len=${#DEM_MODULES[@]}
    for ((i=len-1; i>=0; i--)); do
        local module="${DEM_MODULES[$i]}"
        dem_info "Uninstalling Module: $module"
        source "$DEM_PACKAGE_DIR/$module/uninstall.sh"
    done

    dem_success "Uninstallation completed for profile: $profile."

}
