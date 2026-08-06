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

  ./dem.sh install [profile]
  ./dem.sh uninstall [profile]
  ./dem.sh configure [profile]
  ./dem.sh verify [profile]
  ./dem.sh remove [profile]

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

    shift

    dem_command_uninstall "$@"

}

run_configure() {

    load_command configure

    shift

    dem_command_configure "$@"

}

run_verify() {

    load_command verify

    shift

    dem_command_verify "$@"

}

run_remove() {

    load_command remove

    shift

    dem_command_remove "$@"

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

            run_uninstall "$@"

            ;;

        configure)

            run_configure "$@"

            ;;

        verify)

            run_verify "$@"

            ;;

        remove)

            run_remove "$@"

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
