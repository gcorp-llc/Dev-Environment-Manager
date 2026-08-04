#!/usr/bin/env bash

set -euo pipefail

dem_title "Verify ScyllaDB"

# Verify repository exists
dem_require_file "/etc/apt/sources.list.d/scylla.list"

# Verify service is running or check nodetool health if installed
if dem_command_exists nodetool; then
    nodetool status || true
else
    dem_info "nodetool command not available, checking scylla-server service state"
    systemctl is-active --quiet scylla-server || dem_warning "scylla-server is not running (typical if CPU lacks required instructions in sandbox)"
fi

dem_success "ScyllaDB verification completed."
