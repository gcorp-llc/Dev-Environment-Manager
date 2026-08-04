#!/usr/bin/env bash

set -euo pipefail

dem_title "Uninstall Desktop Development Tools"

dem_package_remove code

dem_success "Desktop development tools uninstalled."
