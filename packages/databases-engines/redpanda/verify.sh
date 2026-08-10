#!/usr/bin/env bash
set -euo pipefail
dem_title "Verify Redpanda"

if ! dem_service_exists "redpanda"; then
    dem_fatal "Redpanda service does not exist."
fi

if ! dem_service_running redpanda; then
    dem_fatal "Redpanda service is not running."
fi

dem_require_command rpk

dem_info "Checking Redpanda cluster health..."
REDPANDA_OK=false
for i in {1..15}; do
    if rpk cluster health --exit-when-healthy >/dev/null 2>&1; then
        dem_success "Redpanda cluster is healthy."
        REDPANDA_OK=true
        break
    else
        dem_warning "Redpanda cluster not healthy yet, retrying... ($i/15)"
        sleep 3
    fi
done

if [ "$REDPANDA_OK" = "false" ]; then
    dem_fatal "Redpanda cluster failed health check."
fi

if rpk topic list >/dev/null 2>&1; then
    dem_success "Redpanda topic list command succeeded."
else
    dem_fatal "Redpanda topic list command failed."
fi

dem_success "Redpanda verification completed."
