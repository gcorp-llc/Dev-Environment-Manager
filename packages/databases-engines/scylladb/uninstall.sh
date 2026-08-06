#!/usr/bin/env bash
set -euo pipefail
dem_title "Uninstall ScyllaDB"

dem_service_stop scylla-server || true
dem_service_disable scylla-server || true

dem_package_remove scylla-server

# Remove repository configuration
rm -f /etc/apt/sources.list.d/scylla.list
rm -f /etc/apt/keyrings/scylla.gpg

dem_success "ScyllaDB uninstalled."
