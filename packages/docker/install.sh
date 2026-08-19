#!/usr/bin/env bash
set -euo pipefail
dem_title "Docker"

if dem_command_exists docker && [[ -f /etc/apt/keyrings/docker-archive-keyring.gpg && -f /etc/apt/sources.list.d/docker.list ]]; then
    dem_info "Docker Engine is already installed and correctly configured."
    dem_success "Docker installation check passed (no reinstall needed)."
    exit "${DEM_EXIT_SKIP_ALREADY_INSTALLED:-3}"
fi

if dem_is_dry_run; then
    dem_dry_run_log "Setting up /etc/apt/keyrings/docker-archive-keyring.gpg"
    dem_dry_run_log "Setting up /etc/apt/sources.list.d/docker.list for Debian 13 (trixie)"
    dem_package_update
    dem_package_install docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin
    dem_success "Docker installation simulated."
    exit "${DEM_EXIT_SUCCESS:-0}"
fi

# 1. Setup official signed Docker APT Repository
mkdir -p /etc/apt/keyrings
curl -fsSL https://download.docker.com/linux/debian/gpg | gpg --dearmor --yes -o /etc/apt/keyrings/docker-archive-keyring.gpg
echo "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker-archive-keyring.gpg] https://download.docker.com/linux/debian trixie stable" > /etc/apt/sources.list.d/docker.list

dem_package_update

# 2. Install Docker
dem_package_install \
    docker-ce \
    docker-ce-cli \
    containerd.io \
    docker-buildx-plugin \
    docker-compose-plugin

dem_success "Docker packages installed."
