#!/usr/bin/env bash
set -euo pipefail
dem_command_remove() {

    local profile="${1:-desktop}"

    dem_validate_root

    dem_title "Removing/Uninstalling Profile: $profile"

    dem_command_uninstall "$profile"

}
