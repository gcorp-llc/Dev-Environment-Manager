#!/usr/bin/env bash
set -euo pipefail
dem_title "Rust"

# 1. Idempotency Check: if cargo and rustc are already installed
if dem_command_exists rustc && dem_command_exists cargo; then
    dem_info "Rust (rustc and cargo) is already installed."
    dem_success "Rust installation check passed (no reinstall needed)."
    exit "${DEM_EXIT_SKIP_ALREADY_INSTALLED:-3}"
fi

# 2. Dry-Run Handling
if dem_is_dry_run; then
    dem_package_update
    dem_package_install rustc cargo
    dem_success "Rust installation simulated."
    exit "${DEM_EXIT_SUCCESS:-0}"
fi

# 3. Installation via APT
dem_package_update
dem_package_install rustc cargo

dem_success "Rust installed."
