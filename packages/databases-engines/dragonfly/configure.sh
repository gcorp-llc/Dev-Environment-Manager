#!/usr/bin/env bash

set -euo pipefail

dem_title "Configure DragonflyDB"

# Enable and start dragonfly service if registered
if systemctl list-unit-files | grep -qi "dragonfly"; then
    SERVICE_NAME=$(systemctl list-unit-files | grep -oE "dragonfly[^. ]*" | head -n1)
    systemctl enable "$SERVICE_NAME" || true
    systemctl start "$SERVICE_NAME" || true
fi

dem_success "DragonflyDB configured."
