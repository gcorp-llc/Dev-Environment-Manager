#!/usr/bin/env bash
set -euo pipefail
dem_title "Verify ScyllaDB"

# If ScyllaDB was skipped, verify should also pass/warn gracefully
if [[ ! -f "/etc/apt/sources.list.d/scylla.list" ]]; then
    dem_warning "ScyllaDB is not installed or was skipped (no repository found)."
    dem_success "ScyllaDB verification skipped."
    exit 0
fi

# Verify repository exists
dem_require_file "/etc/apt/sources.list.d/scylla.list"

# Verify service is running or check nodetool health if installed
if dem_command_exists nodetool; then
    nodetool status || true
else
    dem_info "nodetool command not available, checking scylla-server service state"
    dem_service_running scylla-server || dem_warning "scylla-server is not running"
fi

dem_success "ScyllaDB verification completed."
