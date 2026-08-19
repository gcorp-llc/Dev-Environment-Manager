#!/usr/bin/env bash
set -euo pipefail
dem_title "Verify Node.js"

DEM_NODE_MAJOR="${DEM_NODE_MAJOR:-24}"

if dem_is_dry_run; then
    dem_dry_run_log "Verifying Node.js binary, npm client, and major version ${DEM_NODE_MAJOR}"
    dem_success "Node.js verification simulated."
    exit "${DEM_EXIT_SUCCESS:-0}"
fi

dem_require_command node
dem_require_command npm

# Print versions
node_ver=$(node --version)
npm_ver=$(npm --version)
dem_info "Node.js version: $node_ver"
dem_info "npm version: $npm_ver"

# Dynamic validation check: verify installed major version matches DEM_NODE_MAJOR
installed_version=$(echo "$node_ver" | sed 's/^v//')
installed_major=$(echo "$installed_version" | cut -d. -f1)

if [[ "$installed_major" != "$DEM_NODE_MAJOR" ]]; then
    dem_fatal_code "${DEM_EXIT_PREREQ_MISSING:-2}" "Expected Node.js major version $DEM_NODE_MAJOR, but found $installed_major ($node_ver)"
fi

dem_success "Node.js verified successfully (major version matches $DEM_NODE_MAJOR)."
