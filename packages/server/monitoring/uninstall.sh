#!/usr/bin/env bash

set -euo pipefail

dem_title "Uninstall Server Monitoring"

systemctl stop prometheus-node-exporter || true
systemctl disable prometheus-node-exporter || true

dem_package_remove prometheus-node-exporter

dem_success "Server monitoring uninstalled."
