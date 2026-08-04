#!/usr/bin/env bash

set -euo pipefail

dem_title "Uninstall Docker"

# Stop docker service
dem_service_stop docker || true
dem_service_disable docker || true

dem_package_remove \
    docker-ce \
    docker-ce-cli \
    containerd.io \
    docker-buildx-plugin \
    docker-compose-plugin

# Remove repository configuration
rm -f /etc/apt/sources.list.d/docker.list
rm -f /etc/apt/keyrings/docker-archive-keyring.gpg

dem_success "Docker uninstalled."
