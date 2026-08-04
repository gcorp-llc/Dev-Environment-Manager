#!/usr/bin/env bash

set -euo pipefail

dem_title "Verify DragonflyDB"

# Verify CLI availability. Dragonfly is Redis-compatible, so redis-cli can be used. We also check for dragonfly binary.
if dem_command_exists dragonfly || [ -f /usr/local/bin/dragonfly ] || [ -f /usr/bin/dragonfly ]; then
    dem_success "dragonfly binary is available."
else
    dem_fatal "dragonfly binary is not found."
fi

# Verify daemon
if systemctl list-unit-files | grep -qi "dragonfly"; then
    SERVICE_NAME=$(systemctl list-unit-files | grep -oE "dragonfly[^. ]*" | head -n1)
    if systemctl is-active --quiet "$SERVICE_NAME"; then
        dem_success "dragonfly service is running."
    else
        dem_warning "dragonfly service is registered but not active."
    fi
else
    dem_warning "dragonfly service not registered."
fi

dem_success "DragonflyDB verification completed."
