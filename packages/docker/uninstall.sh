#!/usr/bin/env bash

set -euo pipefail

dem_title "Uninstall Docker"

# Stop docker service
systemctl stop docker || true
systemctl disable docker || true

dem_package_remove \
    docker-ce \
    docker-ce-cli \
    containerd.io \
    docker-buildx-plugin \
    docker-compose-plugin

dem_success "Docker uninstalled."
