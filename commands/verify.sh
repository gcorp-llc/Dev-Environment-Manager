#!/usr/bin/env bash

set -euo pipefail

dem_command_verify() {

    local profile="${1:-desktop}"

    dem_validate_root

    dem_title "Verifying Profile: $profile"

    dem_profile_load "$profile"

    for module in "${DEM_MODULES[@]}"; do
        dem_info "Verifying Module: $module"
        source "$DEM_PACKAGE_DIR/$module/verify.sh"
    done

    dem_success "Verification completed for profile: $profile."

}
