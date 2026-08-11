#!/usr/bin/env bash
set -euo pipefail

dem_title "Uninstall ScyllaDB"

dem_require_root

if dem_service_running scylla-server; then
    dem_service_stop scylla-server
fi

if dem_service_exists scylla-server; then
    dem_service_disable scylla-server || true
fi

dem_package_remove scylla

rm -f /etc/apt/sources.list.d/scylla.list
rm -f /etc/apt/keyrings/scylladb.gpg

dem_package_update

dem_success "ScyllaDB uninstalled."