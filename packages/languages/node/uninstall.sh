#!/usr/bin/env bash

set -euo pipefail

dem_title "Uninstall Node.js"

dem_package_remove nodejs

dem_success "Node.js uninstalled."
