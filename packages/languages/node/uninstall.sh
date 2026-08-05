#!/usr/bin/env bash

set -euo pipefail

dem_title "Uninstall Node.js"

dem_package_remove nodejs

# Remove repository configuration
rm -f /etc/apt/sources.list.d/nodesource.list
rm -f /etc/apt/keyrings/nodesource.gpg

dem_success "Node.js uninstalled."
