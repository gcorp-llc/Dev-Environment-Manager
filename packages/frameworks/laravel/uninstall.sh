#!/usr/bin/env bash
set -euo pipefail
dem_title "Uninstall Laravel"

rm -f /usr/local/bin/composer
rm -f /etc/profile.d/composer.sh

dem_success "Laravel tools uninstalled."
