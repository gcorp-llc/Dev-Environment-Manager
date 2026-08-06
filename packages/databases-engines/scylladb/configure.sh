#!/usr/bin/env bash
set -euo pipefail
dem_title "Configure ScyllaDB"

# Setup ScyllaDB in developer mode if scylla_setup is present
if dem_command_exists scylla_setup; then
    scylla_setup --developer-mode --no-raid-setup --no-coredump-setup --no-ntp-setup --no-fstrim-setup || true
fi

dem_service_enable scylla-server || true
dem_service_start scylla-server || true

dem_success "ScyllaDB configured."
