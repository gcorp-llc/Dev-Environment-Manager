#!/usr/bin/env bash

set -euo pipefail

dem_title "Uninstall ScyllaDB"

systemctl stop scylla-server || true
systemctl disable scylla-server || true

dem_package_remove scylla-server

# Remove repository configuration
rm -f /etc/apt/sources.list.d/scylla.list
rm -f /etc/apt/keyrings/scylla.gpg

dem_success "ScyllaDB uninstalled."
