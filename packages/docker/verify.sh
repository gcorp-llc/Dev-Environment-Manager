#!/usr/bin/env bash
set -euo pipefail
dem_title "Verify Docker"

if dem_is_dry_run; then
    dem_dry_run_log "Verifying docker CLI, docker service, and docker compose plugin"
    dem_success "Docker verification simulated."
    exit "${DEM_EXIT_SUCCESS:-0}"
fi

dem_require_command docker

if dem_service_running docker; then
    dem_success "Docker service is running."
else
    dem_fatal_code "${DEM_EXIT_PREREQ_MISSING:-2}" "Docker service is not running."
fi

# Verify docker compose (plugin version) is available
docker compose version

dem_success "Docker verification completed."
