#!/usr/bin/env bash

dem_command_restore() {

    dem_validate_root

    [[ -z "$1" ]] && dem_fatal "Backup file required."

    tar -xzf "$1" -C /

    dem_success "Restore completed."

}