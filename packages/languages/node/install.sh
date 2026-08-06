#!/usr/bin/env bash
set -euo pipefail
dem_title "Node.js"

# 1. Setup official signed NodeSource APT Repository
mkdir -p /etc/apt/keyrings
curl -fsSL https://deb.nodesource.com/gpgkey/nodesource-repo.gpg.key | gpg --dearmor --yes -o /etc/apt/keyrings/nodesource.gpg
echo "deb [signed-by=/etc/apt/keyrings/nodesource.gpg] https://deb.nodesource.com/node_20.x nodistro main" > /etc/apt/sources.list.d/nodesource.list

dem_package_update

# 2. Installs nodejs (which includes npm) from NodeSource
dem_package_install nodejs

dem_success "Node.js installed."
