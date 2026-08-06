#!/usr/bin/env bash
set -euo pipefail
dem_title "Server Monitoring"

dem_package_install prometheus-node-exporter

dem_success "Server monitoring installed."
