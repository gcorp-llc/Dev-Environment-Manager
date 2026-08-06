#!/usr/bin/env bash
set -euo pipefail
dem_title "Uninstall Rust"

dem_package_remove rustc cargo

dem_success "Rust uninstalled."
