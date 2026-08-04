#!/usr/bin/env bash

set -euo pipefail

dem_title "Configure Meilisearch"

# Create config directory and files if needed
mkdir -p /etc/meilisearch
chown -R meilisearch:meilisearch /etc/meilisearch

# Enable and start meilisearch service (configure for development env)
if systemctl list-unit-files | grep -qi "meilisearch"; then
    systemctl enable meilisearch || true
    systemctl start meilisearch || true
else
    # If no service file was installed by deb, create one
    cat << 'EOF' > /etc/systemd/system/meilisearch.service
[Unit]
Description=Meilisearch
After=network.target

[Service]
Type=simple
User=meilisearch
ExecStart=/usr/bin/meilisearch --db-path /var/lib/meilisearch/data --env development
Restart=always

[Install]
WantedBy=multi-user.target
EOF
    mkdir -p /var/lib/meilisearch/data
    chown -R meilisearch:meilisearch /var/lib/meilisearch
    systemctl daemon-reload
    systemctl enable meilisearch || true
    systemctl start meilisearch || true
fi

dem_success "Meilisearch configured."
