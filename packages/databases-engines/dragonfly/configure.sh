#!/usr/bin/env bash
set -euo pipefail
dem_title "Configure DragonflyDB"

# Enable and start dragonfly service if registered
SERVICE_NAME=$(dem_service_find_by_pattern "dragonfly")
if [[ -n "${SERVICE_NAME}" ]]; then
    dem_service_enable "$SERVICE_NAME" || true
    dem_service_start "$SERVICE_NAME" || true
fi

dem_success "DragonflyDB configured."
