#!/usr/bin/env bash
set -euo pipefail

dem_title "Vespa"

dem_require_root
dem_require_command docker

dem_info "Pulling Vespa container image..."

docker pull vespaengine/vespa

dem_success "Vespa image installed."