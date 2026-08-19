#!/usr/bin/env bash
set -euo pipefail
dem_title "Verify DragonflyDB"

if dem_is_dry_run; then
    dem_dry_run_log "Verifying docker CLI and running state of 'dragonfly' container"
    dem_success "DragonflyDB verification simulated."
    exit "${DEM_EXIT_SUCCESS:-0}"
fi

dem_require_command docker

if docker ps --format '{{.Names}}' 2>/dev/null | grep -qx "dragonfly"; then
    dem_success "DragonflyDB container is running."
else
    dem_fatal_code "${DEM_EXIT_PREREQ_MISSING:-2}" "DragonflyDB container is not running."
fi

dem_success "DragonflyDB verification completed."
