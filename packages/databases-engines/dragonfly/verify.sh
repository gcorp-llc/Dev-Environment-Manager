#!/usr/bin/env bash
set -euo pipefail

dem_title "Verify DragonflyDB"

dem_require_command docker

if docker ps --format '{{.Names}}' | grep -qx "dragonfly"; then
    dem_success "DragonflyDB container is running."
else
    dem_error "DragonflyDB container is not running."
    exit 1
fi