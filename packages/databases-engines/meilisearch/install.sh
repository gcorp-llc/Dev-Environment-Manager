#!/usr/bin/env bash

set -euo pipefail

dem_title "Meilisearch"

# Create dedicated user if not already present
if ! getent passwd meilisearch >/dev/null 2>&1; then
    useradd --system --user-group --no-create-home --shell /bin/false meilisearch
fi

# Download official Meilisearch Debian package
MEILI_DEB="/tmp/meilisearch.deb"
if [[ ! -f "$MEILI_DEB" ]]; then
    dem_info "Downloading Meilisearch package..."
    curl -fsSL -o "$MEILI_DEB" "https://github.com/meilisearch/meilisearch/releases/download/v1.12.5/meilisearch-debian-amd64.deb" || wget -qO "$MEILI_DEB" "https://github.com/meilisearch/meilisearch/releases/download/v1.12.5/meilisearch-debian-amd64.deb"
fi

dem_info "Installing Meilisearch package..."
apt install -y "$MEILI_DEB" || dem_warning "Meilisearch installation completed with warnings."

# Cleanup
rm -f "$MEILI_DEB"

dem_success "Meilisearch installed."
