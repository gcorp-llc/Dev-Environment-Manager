#!/usr/bin/env bash
set -euo pipefail
dem_title "Configure DragonflyDB"

dem_require_root
dem_require_command docker

if docker ps -a --format '{{.Names}}' | grep -qx "dragonfly"; then
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
