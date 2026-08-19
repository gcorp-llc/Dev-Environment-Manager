#!/usr/bin/env bash
set -euo pipefail
dem_title "Uninstall DragonflyDB"

dem_require_root

if dem_is_dry_run; then
    dem_dry_run_log "Removing docker container 'dragonfly' and docker image docker.dragonflydb.io/dragonflydb/dragonfly:latest"
    dem_success "DragonflyDB uninstallation simulated."
    exit "${DEM_EXIT_SUCCESS:-0}"
fi

dem_require_command docker

if docker ps -a --format '{{.Names}}' 2>/dev/null | grep -qx "dragonfly"; then
    docker rm -f dragonfly
fi

docker image rm \
    docker.dragonflydb.io/dragonflydb/dragonfly:latest \
    2>/dev/null || true

dem_success "DragonflyDB uninstalled."
