#!/usr/bin/env bash
set -euo pipefail
dem_title "Vespa and Redpanda Console"

if ! dem_command_exists docker; then
    dem_fatal "Docker is not installed. Please install 'docker' module first."
fi

dem_info "Starting Vespa and Redpanda Console containers..."
docker compose -f "$(dirname "${BASH_SOURCE[0]}")/docker-compose.yml" up -d || dem_warning "Failed to start Vespa and Redpanda Console containers."

dem_success "Vespa and Redpanda Console containers started."
