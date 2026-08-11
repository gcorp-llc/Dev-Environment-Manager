#!/usr/bin/env bash
set -euo pipefail
dem_title "Uninstall Vespa"

dem_require_root
dem_require_command docker

if docker ps -a --format '{{.Names}}' | grep -qx "vespa"; then
    docker rm -f vespa
fi

docker image rm \
    vespaengine/vespa \
    2>/dev/null || true

dem_success "Vespa uninstalled."
