#!/usr/bin/env bash
set -euo pipefail
dem_title "Uninstall Flutter"

FLUTTER_ROOT="${FLUTTER_ROOT:-/opt/flutter}"

if [[ -d "$FLUTTER_ROOT" ]]; then
    dem_info "Removing Flutter installation at $FLUTTER_ROOT..."
    rm -rf "$FLUTTER_ROOT"
fi

PROFILE_ENV="/etc/profile.d/dem-env.sh"
if [[ -f "$PROFILE_ENV" ]]; then
    sed -i '/FLUTTER_ROOT/d' "$PROFILE_ENV"
fi

dem_success "Flutter uninstalled."
