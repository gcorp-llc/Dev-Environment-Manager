#!/usr/bin/env bash

dem_command_upgrade() {

    dem_validate_environment
    dem_validate_root

    dem_title "Upgrading"

    dem_package_upgrade

    dem_package_autoremove

    dem_package_clean

    dem_success "System upgraded."

}