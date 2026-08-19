#!/usr/bin/env bash
set -euo pipefail
dem_title "Uninstall Core"

if dem_is_dry_run; then
    dem_dry_run_log "Simulating Core uninstall (preserving shared system dependencies)"
    dem_success "Core uninstall simulation completed."
    exit "${DEM_EXIT_SUCCESS:-0}"
fi

dem_warning "Core contains shared Debian system dependencies."
dem_warning "Shared base packages will not be removed to protect system stability."

dem_success "Core uninstall completed safely. Shared Debian dependencies were preserved."
