#!/usr/bin/env bash

set -euo pipefail

dem_title "Uninstall Office"

dem_package_remove libreoffice evince

dem_success "Office applications uninstalled."
