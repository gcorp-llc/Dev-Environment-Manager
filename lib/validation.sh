#!/usr/bin/env bash

dem_validate_environment() {

    dem_check_debian || dem_fatal "Unsupported distribution."

    dem_check_network || dem_fatal "No Internet connection."

    dem_check_apt || dem_fatal "APT not found."

    dem_check_systemd || dem_fatal "Systemd not found."

}

dem_validate_root() {

    dem_require_root

}

dem_validate_command() {

    dem_require_command "$1"

}

dem_validate_file() {

    dem_require_file "$1"

}

dem_validate_directory() {

    dem_require_directory "$1"

}