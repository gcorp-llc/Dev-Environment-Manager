#!/usr/bin/env bash

set -euo pipefail

dem_title "Uninstall ScyllaDB"

systemctl stop scylla-server || true
systemctl disable scylla-server || true

dem_package_remove scylla-server

rm -f /etc/apt/sources.list.d/scylla.list

dem_success "ScyllaDB uninstalled."
