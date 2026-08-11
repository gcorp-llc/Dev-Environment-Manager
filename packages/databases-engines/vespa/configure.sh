#!/usr/bin/env bash
set -euo pipefail

dem_title "Configure Vespa"

dem_require_root
dem_require_command docker

if docker ps -a --format '{{.Names}}' | grep -qx "vespa"; then
    dem_info "Vespa container already exists."
else
    docker run -d \
        --name vespa \
        --restart unless-stopped \
        --hostname vespa \
        --privileged \
        -p 8080:8080 \
        -p 19071:19071 \
        vespaengine/vespa
fi

dem_success "Vespa configured."