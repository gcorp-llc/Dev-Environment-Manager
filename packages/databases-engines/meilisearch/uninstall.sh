#!/usr/bin/env bash
set -euo pipefail
dem_title "Uninstall Meilisearch"

dem_service_stop meilisearch || true
dem_service_disable meilisearch || true

dem_package_remove meilisearch

rm -f /etc/systemd/system/meilisearch.service
systemctl daemon-reload || true

dem_success "Meilisearch uninstalled."
