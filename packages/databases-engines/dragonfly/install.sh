#!/usr/bin/env bash
set -euo pipefail

dem_title "DragonflyDB"

dem_require_root
dem_require_command docker

dem_info "Pulling DragonflyDB image..."

docker pull docker.dragonflydb.io/dragonflydb/dragonfly:latest

dem_success "DragonflyDB image installed."