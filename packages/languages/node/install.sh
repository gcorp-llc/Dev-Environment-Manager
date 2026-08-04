#!/usr/bin/env bash

set -euo pipefail

dem_title "Node.js"

# Installs nodejs (which includes npm) from NodeSource
dem_package_install nodejs

dem_success "Node.js installed."
