#!/usr/bin/env bash
set -euo pipefail

dem_title "Verify Vespa"

dem_require_command docker

if docker ps --format '{{.Names}}' | grep -qx "vespa"; then
    dem_success "Vespa container is running."
else
    dem_error "Vespa container is not running."
    exit 1
fi

if curl -fsS \
    --max-time 10 \
    "http://127.0.0.1:8080/state/v1/health" \
    >/dev/null 2>&1; then
    dem_success "Vespa health endpoint is available."
else
    dem_warning "Vespa container is running but health endpoint is not ready yet."
fi