#!/usr/bin/env bash
set -euo pipefail
dem_title "Uninstall VS Code"

dem_package_remove code

rm -f /etc/apt/sources.list.d/vscode.list
rm -f /etc/apt/keyrings/packages.microsoft.gpg

dem_success "VS Code uninstalled."
