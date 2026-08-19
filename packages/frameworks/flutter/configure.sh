#!/usr/bin/env bash
set -euo pipefail
dem_title "Configure Flutter"

FLUTTER_ROOT="${FLUTTER_ROOT:-/opt/flutter}"
PROFILE_ENV="/etc/profile.d/dem-env.sh"
mkdir -p /etc/profile.d

if [[ ! -f "$PROFILE_ENV" ]]; then
    touch "$PROFILE_ENV"
    chmod 644 "$PROFILE_ENV"
fi

if ! grep -q "FLUTTER_ROOT" "$PROFILE_ENV" 2>/dev/null; then
    {
        echo '# Flutter Environment Variables'
        echo "export FLUTTER_ROOT=\"${FLUTTER_ROOT}\""
        echo 'export PATH="$FLUTTER_ROOT/bin:$PATH"'
    } >> "$PROFILE_ENV"
fi

dem_success "Flutter configured."
