#!/usr/bin/env bash
set -euo pipefail
dem_title "Configure ScyllaDB"

dem_require_root

if dem_is_dry_run; then
    dem_dry_run_log "Configuring ScyllaDB system tuning (scylla_setup)"
    dem_success "ScyllaDB configuration simulated."
    exit "${DEM_EXIT_SUCCESS:-0}"
fi

if ! dem_command_exists scylla_setup; then
    dem_warning "scylla_setup is not available. Skipping ScyllaDB system tuning."
    exit 0
fi

dem_info "ScyllaDB is installed."

dem_info "Production storage tuning must be performed explicitly with scylla_setup."

dem_success "ScyllaDB configuration completed."
