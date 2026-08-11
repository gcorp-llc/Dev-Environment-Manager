#!/usr/bin/env bash
set -euo pipefail
dem_title "Uninstall DragonflyDB"

dem_require_root
dem_require_command docker

if docker ps -a --format '{{.Names}}' | grep -qx "dragonfly"; then
    docker rm -f dragonfly
fi

docker image rm \
    docker.dragonflydb.io/dragonflydb/dragonfly:latest \
    2>/dev/null || true

dem_success "DragonflyDB uninstalled."
