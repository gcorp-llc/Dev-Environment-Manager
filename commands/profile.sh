#!/usr/bin/env bash
set -euo pipefail

dem_command_profile() {

    local action="${1:-list}"

    case "$action" in

        list)
            dem_profile_list
            ;;

        load)
            local profile="${2:-desktop}"
            dem_profile_load "$profile"
            dem_success "Profile loaded: $profile"
            ;;

        apply)
            local profile="${2:-desktop}"
            dem_profile_apply "$profile"
            ;;

        *)
            dem_fatal "Usage: ./dem.sh profile [list|load <profile>|apply <profile>] [--dry-run]"
            ;;

    esac

}
