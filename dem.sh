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

  ./dem.sh install [profile] [--dry-run]
  ./dem.sh uninstall [profile] [--dry-run]
  ./dem.sh configure [profile] [--dry-run]
  ./dem.sh verify [profile] [--dry-run]
  ./dem.sh remove [profile] [--dry-run]

  ./dem.sh doctor

  ./dem.sh validate

  ./dem.sh status

  ./dem.sh update

  ./dem.sh upgrade

  ./dem.sh repair

  ./dem.sh cleanup

  ./dem.sh backup

  ./dem.sh restore

  ./dem.sh service [action] [service]

  ./dem.sh profile [list|load <profile>]

  ./dem.sh platform [doctor|rust|keyspaces|all]

  ./dem.sh version

  ./dem.sh help

Options:
  --dry-run    Simulate operations without making persistent changes.

EOF

}

load_command() {

    local command="$1"

    source "$ROOT/commands/${command}.sh"

}

parse_flags() {

    local args=()

    for arg in "$@"; do
        if [[ "$arg" == "--dry-run" ]]; then
            export DEM_DRY_RUN="true"
        else
            args+=("$arg")
        fi
    done

    # Return parsed non-flag args
    if [[ ${#args[@]} -gt 0 ]]; then
        echo "${args[@]}"
    fi

}

run_install() {

    load_command install

    shift

    # Parse --dry-run
    local parsed
    parsed=$(parse_flags "$@")

    dem_command_install $parsed

}

run_uninstall() {

    load_command uninstall

    shift

    local parsed
    parsed=$(parse_flags "$@")

    dem_command_uninstall $parsed

}

run_configure() {

    load_command configure

    shift

    local parsed
    parsed=$(parse_flags "$@")

    dem_command_configure $parsed

}

run_verify() {

    load_command verify

    shift

    local parsed
    parsed=$(parse_flags "$@")

    dem_command_verify $parsed

}

run_remove() {

    load_command remove

    shift

    local parsed
    parsed=$(parse_flags "$@")

    dem_command_remove $parsed

}

run_doctor() {

    load_command doctor

    dem_command_doctor

}

run_validate() {

    load_command validate

    dem_command_validate

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

run_service() {

    load_command service

    shift

    local parsed
    parsed=$(parse_flags "$@")

    dem_command_service $parsed

}

run_profile() {

    load_command profile

    shift

    local parsed
    parsed=$(parse_flags "$@")

    dem_command_profile $parsed

}

run_platform() {

    load_command platform

    shift

    local parsed
    parsed=$(parse_flags "$@")

    dem_command_platform $parsed

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

        validate)

            run_validate

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

        service)

            run_service "$@"

            ;;

        profile)

            run_profile "$@"

            ;;

        platform)

            run_platform "$@"

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
