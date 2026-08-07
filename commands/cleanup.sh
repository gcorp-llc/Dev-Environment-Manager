#!/usr/bin/env bash
set -euo pipefail
dem_command_cleanup() {

    dem_validate_root

    dem_title "Cleanup"

    apt autoremove -y
    apt autoclean
    apt clean

    # Clean only if safe to do so
    if [[ -d "${DEM_CACHE_DIR:-}" && -n "${DEM_CACHE_DIR:-}" ]]; then
        rm -rf "${DEM_CACHE_DIR:?}"/* 2>/dev/null
    fi

    dem_success "Cleanup completed."

}
