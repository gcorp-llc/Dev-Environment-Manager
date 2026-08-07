#!/usr/bin/env bash
set -euo pipefail
dem_title "Uninstall DragonflyDB"

SERVICE_NAME=$(dem_service_find_by_pattern "dragonfly")
if [[ -n "${SERVICE_NAME}" ]]; then
    dem_service_stop "$SERVICE_NAME" || true
    dem_service_disable "$SERVICE_NAME" || true
fi

dem_package_remove dragonfly

dem_success "DragonflyDB uninstalled."
