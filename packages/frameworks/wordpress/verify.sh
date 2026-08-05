#!/usr/bin/env bash

set -euo pipefail

dem_title "Verify WordPress"

dem_require_command wp

# Verify WP-CLI command runs
wp --info

dem_success "WordPress development tools verified."
