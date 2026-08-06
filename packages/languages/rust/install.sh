#!/usr/bin/env bash
set -euo pipefail
dem_title "Rust"

dem_package_install rustc cargo

dem_success "Rust installed."
