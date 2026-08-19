#!/usr/bin/env bash
set -euo pipefail
dem_title "Configure DragonflyDB"

dem_require_root

if dem_is_dry_run; then
    dem_dry_run_log "Creating and running docker container 'dragonfly' using docker.dragonflydb.io/dragonflydb/dragonfly:latest"
    dem_success "DragonflyDB configuration simulated."
    exit "${DEM_EXIT_SUCCESS:-0}"
fi

dem_require_command docker

if docker ps -a --format '{{.Names}}' 2>/dev/null | grep -qx "dragonfly"; then
    dem_info "DragonflyDB container already exists."
else
    docker run -d \
        --name dragonfly \
        --restart unless-stopped \
        --network host \
        --ulimit memlock=-1 \
        docker.dragonflydb.io/dragonflydb/dragonfly:latest
fi

dem_success "DragonflyDB configured."
