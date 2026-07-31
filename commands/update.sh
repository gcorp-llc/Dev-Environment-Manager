#!/usr/bin/env bash

dem_command_update() {

    dem_validate_environment
    dem_validate_root

    dem_title "Updating"

    dem_package_update

    dem_success "Repository updated."

}