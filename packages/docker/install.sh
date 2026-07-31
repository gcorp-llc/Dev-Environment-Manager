#!/usr/bin/env bash

dem_title "Docker"

if dem_command_exists docker; then
    dem_success "Docker already installed."
    return
fi

dem_package_install \
    docker.io \
    docker-compose-v2

source "$DEM_PACKAGE_DIR/docker/configure.sh"

source "$DEM_PACKAGE_DIR/docker/verify.sh"

dem_success "Docker installation completed."