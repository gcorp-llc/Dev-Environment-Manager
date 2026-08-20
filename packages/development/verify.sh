#!/usr/bin/env bash
set -euo pipefail
dem_title "Verify Development"

if dem_is_dry_run; then
    dem_dry_run_log "Verifying development tools (jq, tree, file, vim)"
    dem_success "Development verification simulated."
    exit "${DEM_EXIT_SUCCESS:-0}"
fi

dem_require_command jq
dem_require_command tree
dem_require_command file
dem_require_command vim

dem_success "Development verification completed."
