#!/usr/bin/env bash
set -euo pipefail
dem_title "Verify Development"

dem_require_command jq
dem_require_command tree
dem_require_command file
dem_require_command vim

dem_success "Development verification completed."
