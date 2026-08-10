#!/usr/bin/env bash
set -euo pipefail
dem_title "Uninstall Redpanda"

dem_service_stop redpanda || true
dem_service_disable redpanda || true

dem_package_remove redpanda

rm -f /etc/apt/sources.list.d/redpanda.list
rm -f /etc/apt/keyrings/redpanda.gpg

dem_success "Redpanda uninstalled."
