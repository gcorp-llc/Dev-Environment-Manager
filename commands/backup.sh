#!/usr/bin/env bash

set -euo pipefail

dem_command_backup() {

    dem_validate_root

    mkdir -p backups

    tar -czf backups/system-$(date +%Y%m%d-%H%M%S).tar.gz \
        "$DEM_CONFIG_DIR"

    dem_success "Backup completed."

}
