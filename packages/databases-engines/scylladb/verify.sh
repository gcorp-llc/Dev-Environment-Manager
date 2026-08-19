#!/usr/bin/env bash
set -euo pipefail
dem_title "Verify ScyllaDB"

dem_require_root

if dem_is_dry_run; then
    dem_dry_run_log "Verifying ScyllaDB binaries, service state, APT keys, and Debian 13 fallback notices"
    dem_success "ScyllaDB verification simulated."
    exit "${DEM_EXIT_SUCCESS:-0}"
fi

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
    dem_fatal_code "${DEM_EXIT_PREREQ_MISSING:-2}" "ScyllaDB APT keyring is missing."
fi

if [[ ! -f /etc/apt/sources.list.d/scylla.list ]]; then
    dem_fatal_code "${DEM_EXIT_PREREQ_MISSING:-2}" "ScyllaDB APT repository configuration is missing."
fi

# Print compatibility fallback warning if running on Trixie and using bookworm/fallback packages
if [[ -f /etc/os-release ]]; then
    # shellcheck disable=SC1091
    source /etc/os-release
fi

if [[ "${VERSION_CODENAME:-}" == "trixie" || "${VERSION_ID:-}" == "13" ]]; then
    dem_warning "ScyllaDB is running via Debian 12 (bookworm) packages on Debian 13 as an explicitly opted-in compatibility fallback. Not officially supported by ScyllaDB upstream as of this release."
fi

dem_success "ScyllaDB verification completed."
