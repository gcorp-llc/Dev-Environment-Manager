#!/usr/bin/env bash

set -euo pipefail

dem_title "Docker"

dem_package_install \
    docker-ce \
    docker-ce-cli \
    containerd.io \
    docker-buildx-plugin \
    docker-compose-plugin

dem_success "Docker packages installed."
