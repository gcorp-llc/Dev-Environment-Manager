#!/usr/bin/env bash

dem_command_service() {

    local action="$1"
    local service="$2"

    [[ -z "$action" ]] && dem_fatal "Missing action."

    [[ -z "$service" ]] && dem_fatal "Missing service."

    case "$action" in

        start)

            dem_service_start "$service"
            ;;

        stop)

            dem_service_stop "$service"
            ;;

        restart)

            dem_service_restart "$service"
            ;;

        enable)

            dem_service_enable "$service"
            ;;

        disable)

            dem_service_disable "$service"
            ;;

        status)

            dem_service_status "$service"
            ;;

        *)

            dem_fatal "Unknown action."

            ;;

    esac

}