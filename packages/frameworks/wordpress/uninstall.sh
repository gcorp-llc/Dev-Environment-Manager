#!/usr/bin/env bash
set -euo pipefail
dem_title "Uninstall WordPress"

rm -f /usr/local/bin/wp

dem_success "WordPress development tools uninstalled."
