#!/usr/bin/env bash
set -euo pipefail
dem_title "Configure DragonflyDB"

# Enable and start dragonfly service if registered
if systemctl list-unit-files | grep -qi "dragonfly"; then
    SERVICE_NAME=$(systemctl list-unit-files | grep -oE "dragonfly[^. ]*" | head -n1)
    dem_service_enable "$SERVICE_NAME" || true
    dem_service_start "$SERVICE_NAME" || true
fi

dem_success "DragonflyDB configured."
