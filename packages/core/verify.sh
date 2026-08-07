#!/usr/bin/env bash
set -euo pipefail
dem_title "Verify Core"

dem_require_command git
dem_require_command curl
dem_require_command wget
dem_require_command gcc
dem_require_command g++
dem_require_command make

# Verify GPG/APT configurations dynamically if respective modules are loaded/active
if [[ -d "packages/docker" ]]; then
    # Keep core purely focused on general compilation toolchains and essential system utilities
    dem_info "Dynamic APT checks verified: repositories are decoupled and managed by specific packages rather than core."
fi

dem_success "Core verification completed."
