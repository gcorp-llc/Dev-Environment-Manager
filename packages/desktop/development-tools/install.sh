#!/usr/bin/env bash
set -euo pipefail
dem_title "Desktop Development Tools"

# 1. Setup VS Code repository configuration & key
mkdir -p /etc/apt/keyrings
wget -qO- https://packages.microsoft.com/keys/microsoft.asc | gpg --dearmor --yes -o /etc/apt/keyrings/packages.microsoft.gpg
echo "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/packages.microsoft.gpg] https://packages.microsoft.com/repos/code stable main" > /etc/apt/sources.list.d/vscode.list

dem_package_update

# 2. Install VS Code
dem_package_install code

dem_success "Desktop development tools installed."
