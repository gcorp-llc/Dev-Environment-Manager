#!/usr/bin/env bash
set -euo pipefail
dem_title "DragonflyDB"

dem_require_root

# 1. Dependency Verification (avoid duplicate package management)
if ! dem_command_exists docker; then
    dem_error "DragonflyDB module depends on the Docker module. Please ensure the 'docker' module is installed."
    exit 1
fi

if ! docker info >/dev/null 2>&1; then
    dem_error "Docker daemon is not running. DragonflyDB requires an active Docker daemon."
    exit 1
fi

# 2. Idempotency Check
if docker images --format '{{.Repository}}:{{.Tag}}' | grep -qx "docker.dragonflydb.io/dragonflydb/dragonfly:latest"; then
    dem_success "DragonflyDB image is already present (idempotent skip)."
    exit 0
fi

# 3. Connection and Registry Connectivity Hardening
dem_info "Testing registry connection to docker.dragonflydb.io..."
if ! curl -sL --max-time 5 -o /dev/null "https://docker.dragonflydb.io/v2/"; then
    dem_error "Network or registry connection failure: Unable to reach https://docker.dragonflydb.io"
    exit 1
fi

dem_info "Pulling DragonflyDB image..."
if ! docker pull docker.dragonflydb.io/dragonflydb/dragonfly:latest; then
    dem_error "Failed to pull DragonflyDB image."
    exit 1
fi

dem_success "DragonflyDB image installed."
