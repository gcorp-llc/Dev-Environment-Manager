#!/usr/bin/env bash
set -euo pipefail
dem_title "Verify VS Code"

dem_require_command code

if [[ -f /etc/apt/sources.list.d/vscode.list ]]; then
    dem_success "VS Code repository source file exists."
else
    dem_fatal "VS Code repository source file is missing."
fi

code --version

dem_success "VS Code verified."
