#!/usr/bin/env bash

set -euo pipefail

dem_title "Configure Server Monitoring"

# Enable and start prometheus-node-exporter
systemctl enable prometheus-node-exporter || true
systemctl start prometheus-node-exporter || true

dem_success "Server monitoring configured."
