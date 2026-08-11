#!/usr/bin/env bash
set -euo pipefail

dem_title "Verify ScyllaDB"

dem_require_root

dem_require_command scylla
dem_require_command nodetool

if dem_command_exists cqlsh; then
    dem_info "cqlsh is available."
else
    dem_warning "cqlsh is not installed."
fi

if dem_service_running scylla-server; then
    dem_success "ScyllaDB service is running."
else
    dem_warning "ScyllaDB service is installed but not currently running."
fi

if [[ ! -f /etc/apt/keyrings/scylladb.gpg ]]; then
    dem_error "ScyllaDB APT keyring is missing."
fi

if [[ ! -f /etc/apt/sources.list.d/scylla.list ]]; then
    dem_error "ScyllaDB APT repository configuration is missing."
fi

dem_success "ScyllaDB verification completed." 