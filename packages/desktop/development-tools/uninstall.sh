#!/usr/bin/env bash
set -euo pipefail
dem_title "Uninstall Desktop Development Tools"

dem_package_remove code

# Remove repository configuration
rm -f /etc/apt/sources.list.d/vscode.list
rm -f /etc/apt/keyrings/packages.microsoft.gpg

dem_success "Desktop development tools uninstalled."
