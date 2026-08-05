#!/usr/bin/env bash

set -euo pipefail

dem_title "Verify Desktop Development Tools"

dem_require_command code

# Verify executable works and repository configuration
if [[ -f /etc/apt/sources.list.d/vscode.list ]]; then
    dem_success "VS Code repository exists."
else
    dem_fatal "VS Code repository is missing."
fi

code --version

dem_success "Desktop development tools verified."
