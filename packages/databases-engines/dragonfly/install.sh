#!/usr/bin/env bash
set -euo pipefail
dem_title "DragonflyDB"

dem_require_root

# 1. Dependency Verification (avoid duplicate package management)
if ! dem_command_exists docker; then
    dem_fatal_code "${DEM_EXIT_PREREQ_MISSING:-2}" "DragonflyDB module depends on the Docker module. Please ensure the 'docker' module is installed."
fi

# 2. Idempotency Check
if docker images --format '{{.Repository}}:{{.Tag}}' 2>/dev/null | grep -qx "docker.dragonflydb.io/dragonflydb/dragonfly:latest"; then
    dem_info "DragonflyDB image is already present."
    dem_success "DragonflyDB installation check passed (no reinstall needed)."
    exit "${DEM_EXIT_SKIP_ALREADY_INSTALLED:-3}"
fi

# 3. Dry-Run Handling
if dem_is_dry_run; then
    dem_dry_run_log "Testing connectivity to https://docker.dragonflydb.io/v2/ and pulling docker.dragonflydb.io/dragonflydb/dragonfly:latest image"
    dem_success "DragonflyDB installation simulated."
    exit "${DEM_EXIT_SUCCESS:-0}"
fi

if ! docker info >/dev/null 2>&1; then
    dem_fatal_code "${DEM_EXIT_PREREQ_MISSING:-2}" "Docker daemon is not running. DragonflyDB requires an active Docker daemon."
fi

# 4. Connection and Registry Connectivity Hardening
dem_info "Testing registry connection to docker.dragonflydb.io..."
if ! curl -sL --max-time 5 -o /dev/null "https://docker.dragonflydb.io/v2/"; then
    dem_fatal_code "${DEM_EXIT_PREREQ_MISSING:-2}" "Network or registry connection failure: Unable to reach https://docker.dragonflydb.io"
fi

dem_info "Pulling DragonflyDB image..."
if ! docker pull docker.dragonflydb.io/dragonflydb/dragonfly:latest; then
    dem_fatal_code "${DEM_EXIT_ERROR:-1}" "Failed to pull DragonflyDB image."
fi

dem_success "DragonflyDB image installed."
