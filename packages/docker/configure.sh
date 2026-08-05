#!/usr/bin/env bash

set -euo pipefail

dem_title "Configure Docker"

# Ensure docker group exists
if ! getent group docker >/dev/null 2>&1; then
    groupadd docker
fi

# If SUDO_USER is defined and not root, add to docker group
if [[ -n "${SUDO_USER:-}" ]] && [[ "$SUDO_USER" != "root" ]]; then
    dem_info "Adding user $SUDO_USER to docker group..."
    usermod -aG docker "$SUDO_USER"
fi

# Enable and start docker service using systemd helpers or standard systemctl
dem_service_enable docker || true
dem_service_start docker || true

dem_success "Docker configured and service started."
