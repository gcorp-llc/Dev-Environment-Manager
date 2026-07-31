#!/usr/bin/env bash

dem_command_uninstall() {

    dem_validate_root

    dem_title "Uninstall"

    dem_package_remove \
        docker.io \
        docker-compose-v2 \
        git \
        curl \
        wget \
        php \
        composer \
        nodejs \
        npm \
        golang-go

    dem_success "Selected packages removed."

}