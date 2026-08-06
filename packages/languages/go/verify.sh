#!/usr/bin/env bash
set -euo pipefail
dem_title "Verify Go"

dem_require_command go

go version

dem_success "Go verified."
