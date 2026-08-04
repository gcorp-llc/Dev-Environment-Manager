#!/usr/bin/env bash

set -euo pipefail

dem_title "Verify Server Monitoring"

# Verify service is active
if systemctl is-active --quiet prometheus-node-exporter; then
    dem_success "prometheus-node-exporter service is active."
else
    dem_fatal "prometheus-node-exporter service is not active."
fi

# Verify port 9100 is listening or responds to HTTP
dem_require_command curl
if curl -fsSL http://localhost:9100/metrics > /dev/null || curl -fsSL http://127.0.0.1:9100/metrics > /dev/null; then
    dem_success "prometheus-node-exporter HTTP metrics endpoint is responding."
else
    dem_fatal "prometheus-node-exporter metrics endpoint failed to respond."
fi

dem_success "Server monitoring verified."
