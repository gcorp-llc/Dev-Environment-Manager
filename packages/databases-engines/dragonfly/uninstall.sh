#!/usr/bin/env bash
set -euo pipefail
dem_title "Uninstall DragonflyDB"

if systemctl list-unit-files | grep -qi "dragonfly"; then
    SERVICE_NAME=$(systemctl list-unit-files | grep -oE "dragonfly[^. ]*" | head -n1)
    dem_service_stop "$SERVICE_NAME" || true
    dem_service_disable "$SERVICE_NAME" || true
fi

dem_package_remove dragonfly

dem_success "DragonflyDB uninstalled."
