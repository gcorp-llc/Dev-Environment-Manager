#!/usr/bin/env bash

set -euo pipefail

dem_title "Uninstall Development"

dem_package_remove \
    jq \
    tree \
    file \
    vim

dem_success "Development utilities uninstalled."
