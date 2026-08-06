#!/usr/bin/env bash
set -euo pipefail
dem_title "Verify Docker"

dem_require_command docker

if dem_service_running docker; then
    dem_success "Docker service is running."
else
    dem_fatal "Docker service is not running."
fi

# Verify docker compose (plugin version) is available
docker compose version

dem_success "Docker verification completed."
