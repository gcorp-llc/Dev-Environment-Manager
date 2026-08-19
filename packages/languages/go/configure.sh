#!/usr/bin/env bash
set -euo pipefail
dem_title "Configure Go"

PROFILE_ENV="/etc/profile.d/dem-env.sh"
mkdir -p /etc/profile.d

if [[ ! -f "$PROFILE_ENV" ]]; then
    touch "$PROFILE_ENV"
    chmod 644 "$PROFILE_ENV"
fi

if ! grep -q "GOPATH" "$PROFILE_ENV" 2>/dev/null; then
    {
        echo '# Go Environment Variables'
        echo 'export GOPATH="${GOPATH:-$HOME/go}"'
        echo 'export PATH="/usr/local/go/bin:$GOPATH/bin:$PATH"'
    } >> "$PROFILE_ENV"
fi

dem_success "Go configured."
