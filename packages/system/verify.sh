#!/usr/bin/env bash

set -euo pipefail

dem_title "Verify System"

# 1. Timezone verification
CURRENT_TZ=$(timedatectl show --property=Timezone --value 2>/dev/null || cat /etc/timezone 2>/dev/null || echo "")
if [[ -n "$CURRENT_TZ" ]]; then
    dem_success "Timezone is configured: $CURRENT_TZ"
else
    dem_fatal "Timezone is not configured."
fi

# 2. Locale verification
if locale -a 2>/dev/null | grep -qiE 'en_US\.utf-?8'; then
    dem_success "Locale en_US.UTF-8 is available."
else
    dem_fatal "Locale en_US.UTF-8 is missing."
fi

# 3. Hostname verification
HOSTNAME_VAL=$(cat /etc/hostname 2>/dev/null || echo "")
if [[ -n "$HOSTNAME_VAL" ]]; then
    dem_success "Hostname is set: $HOSTNAME_VAL"
else
    dem_fatal "Hostname is not set."
fi

# 4. Sudo verification
dem_require_command sudo
if getent group sudo >/dev/null 2>&1; then
    dem_success "Sudo group exists."
else
    dem_fatal "Sudo group does not exist."
fi

dem_success "System verification completed."
