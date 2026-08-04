#!/usr/bin/env bash

set -euo pipefail

dem_title "Verify Rust"

dem_require_command rustc
dem_require_command cargo

rustc --version
cargo --version

dem_success "Rust verified."
