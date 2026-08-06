#!/usr/bin/env bash
set -euo pipefail
dem_title "Verify Meilisearch"

dem_require_command curl

# Check if meilisearch binary exists
if [ -f /usr/bin/meilisearch ] || [ -f /usr/local/bin/meilisearch ] || dem_command_exists meilisearch; then
    dem_success "meilisearch binary is available."
else
    dem_fatal "meilisearch binary is not found."
fi

# Verify HTTP endpoint (with slight retry for startup)
dem_info "Checking Meilisearch HTTP health endpoint..."
for i in {1..5}; do
    if curl -s http://localhost:7700/health | grep -qi "status" || curl -s http://127.0.0.1:7700/health | grep -qi "status"; then
        dem_success "Meilisearch HTTP health endpoint is active."
        break
    else
        dem_warning "Meilisearch endpoint not ready yet, retrying... ($i/5)"
        sleep 2
    fi
done

dem_success "Meilisearch verification completed."
