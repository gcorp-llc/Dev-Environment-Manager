#!/usr/bin/env bash

set -euo pipefail

dem_title "Configure Server Monitoring"

# Enable and start prometheus-node-exporter
dem_service_enable prometheus-node-exporter || true
dem_service_start prometheus-node-exporter || true

dem_success "Server monitoring configured."
