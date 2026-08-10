#!/usr/bin/env bash
set -euo pipefail
dem_title "Verify Vespa and Redpanda Console"

dem_require_command curl

if ! dem_command_exists docker; then
    dem_warning "Docker is not installed. Skipping Vespa verification."
    exit 0
fi

if ! docker ps --filter "name=vespa" --quiet | grep -q .; then
    dem_warning "Vespa container is not running."
    dem_success "Vespa verification completed with warnings."
    exit 0
fi

dem_info "Checking Vespa config server health..."
VESPA_OK=false
for i in {1..15}; do
    if curl -sf http://localhost:19071/state/v1/health | grep -q '"code":"up"'; then
        dem_success "Vespa config server is healthy."
        VESPA_OK=true
        break
    else
        dem_warning "Vespa config server not ready yet, retrying... ($i/15)"
        sleep 3
    fi
done

if [ "$VESPA_OK" = "false" ]; then
    dem_fatal "Vespa config server failed health check."
fi

dem_info "Checking Redpanda Console..."
if curl -sf http://localhost:8080 >/dev/null 2>&1 || curl -sf http://127.0.0.1:8080 >/dev/null 2>&1; then
    dem_success "Redpanda Console is accessible."
else
    dem_warning "Redpanda Console is not responding on port 8080."
fi

dem_success "Vespa and Redpanda Console verification completed."
