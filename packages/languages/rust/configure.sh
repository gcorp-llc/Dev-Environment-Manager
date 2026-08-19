#!/usr/bin/env bash
set -euo pipefail
dem_title "Configure Rust"

# Set up global environment variables for Rust in /etc/profile.d/dem-env.sh
PROFILE_ENV="/etc/profile.d/dem-env.sh"
mkdir -p /etc/profile.d

if [[ ! -f "$PROFILE_ENV" ]]; then
    touch "$PROFILE_ENV"
    chmod 644 "$PROFILE_ENV"
fi

if ! grep -q "CARGO_HOME" "$PROFILE_ENV" 2>/dev/null; then
    {
        echo '# Rust Environment Variables'
        echo 'export CARGO_HOME="${CARGO_HOME:-$HOME/.cargo}"'
        echo 'export PATH="$CARGO_HOME/bin:$PATH"'
    } >> "$PROFILE_ENV"
fi

dem_success "Rust configured."
