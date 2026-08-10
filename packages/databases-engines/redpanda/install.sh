#!/usr/bin/env bash
set -euo pipefail
dem_title "Redpanda"

mkdir -p /etc/apt/keyrings
dem_info "Downloading and setting up Redpanda repository..."
curl -1sLf 'https://dl.redpanda.com/nzc4ZYQK3WRGd9sy/redpanda/cfg/setup/bash.deb.sh' | bash || dem_warning "Redpanda repository setup script completed with warnings or failed."

dem_package_update
dem_package_install redpanda

dem_success "Redpanda installed."
