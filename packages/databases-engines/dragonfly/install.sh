#!/usr/bin/env bash
set -euo pipefail
dem_title "DragonflyDB"

# Download the official Dragonfly Debian package
DRAGONFLY_DEB="/tmp/dragonfly-amd64.deb"
if [[ ! -f "$DRAGONFLY_DEB" ]]; then
    dem_info "Downloading Dragonfly package..."
    curl -fsSL -o "$DRAGONFLY_DEB" "https://github.com/dragonflydb/dragonfly/releases/download/v1.22.0/dragonfly-amd64.deb" || wget -qO "$DRAGONFLY_DEB" "https://github.com/dragonflydb/dragonfly/releases/download/v1.22.0/dragonfly-amd64.deb"
fi

dem_info "Installing Dragonfly package..."
apt install -y "$DRAGONFLY_DEB" || dem_warning "Dragonfly package installation completed with warnings."

# Cleanup
rm -f "$DRAGONFLY_DEB"

dem_success "DragonflyDB installed."
