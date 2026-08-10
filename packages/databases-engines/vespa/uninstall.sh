#!/usr/bin/env bash
set -euo pipefail
dem_title "Uninstall Vespa and Redpanda Console"

if dem_command_exists docker; then
    dem_info "Stopping and removing Vespa and Redpanda Console containers..."
    docker compose -f "$(dirname "${BASH_SOURCE[0]}")/docker-compose.yml" down -v || true
fi

dem_success "Vespa and Redpanda Console uninstalled."
