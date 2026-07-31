#!/usr/bin/env bash

set -Eeuo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

source "$ROOT/bootstrap.sh"

show_banner() {

cat <<EOF

=========================================
       Dev Environment Manager
=========================================

Version : ${DEM_VERSION}

EOF

}

show_help() {

cat <<EOF

Usage

  ./dem.sh install desktop
  ./dem.sh install server

  ./dem.sh uninstall

  ./dem.sh doctor

  ./dem.sh status

  ./dem.sh update

  ./dem.sh upgrade

  ./dem.sh repair

  ./dem.sh cleanup

  ./dem.sh backup

  ./dem.sh restore

  ./dem.sh version

  ./dem.sh help

EOF

}

load_command() {

    local command="$1"

    source "$ROOT/commands/${command}.sh"

}

run_install() {

    load_command install

    shift

    dem_command_install "$@"

}

run_uninstall() {

    load_command uninstall

    dem_command_uninstall

}

run_doctor() {

    load_command doctor

    dem_command_doctor

}

run_status() {

    load_command status

    dem_command_status

}

run_update() {

    load_command update

    dem_command_update

}

run_upgrade() {

    load_command upgrade

    dem_command_upgrade

}

run_cleanup() {

    load_command cleanup

    dem_command_cleanup

}

run_repair() {

    load_command repair

    dem_command_repair

}

run_backup() {

    load_command backup

    dem_command_backup

}

run_restore() {

    load_command restore

    dem_command_restore

}

run_version() {

    echo "${DEM_NAME} ${DEM_VERSION}"

}

main() {

    local command="${1:-help}"

    case "$command" in

        install)

            run_install "$@"

            ;;

        uninstall)

            run_uninstall

            ;;

        doctor)

            run_doctor

            ;;

        status)

            run_status

            ;;

        update)

            run_update

            ;;

        upgrade)

            run_upgrade

            ;;

        cleanup)

            run_cleanup

            ;;

        repair)

            run_repair

            ;;

        backup)

            run_backup

            ;;

        restore)

            run_restore

            ;;

        version)

            run_version

            ;;

        help|-h|--help)

            show_banner

            show_help

            ;;

        *)

            dem_log_error "Unknown command: $command"

            echo

            show_help

            exit 1

            ;;

    esac

}

main "$@"