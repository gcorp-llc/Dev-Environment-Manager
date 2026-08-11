#!/usr/bin/env bash
set -euo pipefail
dem_title "Verify Node.js"

DEM_NODE_MAJOR="${DEM_NODE_MAJOR:-24}"

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
    dem_fatal "Expected Node.js major version $DEM_NODE_MAJOR, but found $installed_major ($node_ver)"
fi

dem_success "Node.js verified successfully (major version matches $DEM_NODE_MAJOR)."
