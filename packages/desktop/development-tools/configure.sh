#!/usr/bin/env bash
set -euo pipefail
dem_title "Configure Desktop Development Tools"

# Basic VS Code checks or initial custom setup (e.g., config directory) without overwriting existing custom settings
mkdir -p "$HOME/.config/Code" || true

dem_success "Desktop development tools configured."
