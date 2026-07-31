#!/usr/bin/env bash

dem_command_profile() {

    case "${1:-list}" in

        list)

            dem_profile_list
            ;;

        load)

            dem_profile_load "$2"
            ;;

        *)

            dem_fatal "Usage: ./dem.sh profile [list|load <profile>]"

            ;;

    esac

}