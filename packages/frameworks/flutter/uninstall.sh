#!/usr/bin/env bash

set -euo pipefail

dem_title "Uninstall Flutter SDK"

rm -rf /opt/flutter
rm -f /etc/profile.d/flutter.sh

dem_success "Flutter SDK uninstalled."
