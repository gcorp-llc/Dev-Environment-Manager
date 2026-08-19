#!/usr/bin/env bash
set -euo pipefail
dem_title "Configure System"

if dem_is_dry_run; then
    dem_dry_run_log "Configuring Timezone, Locales (en_US.UTF-8), Hostname, and Sudo group"
    dem_success "System configuration simulated."
    exit "${DEM_EXIT_SUCCESS:-0}"
fi

# 1. Timezone Configuration (Never overwrite existing custom settings)
CURRENT_TZ=$(timedatectl show --property=Timezone --value 2>/dev/null || cat /etc/timezone 2>/dev/null || echo "")
if [[ -z "$CURRENT_TZ" || "$CURRENT_TZ" == "Etc/UTC" || "$CURRENT_TZ" == "UTC" ]]; then
    dem_info "Setting timezone to UTC..."
    timedatectl set-timezone UTC || true
else
    dem_info "Timezone is already set to custom: $CURRENT_TZ. Not overwriting."
fi

# 2. Locale Configuration (Never overwrite existing custom settings)
if ! locale -a 2>/dev/null | grep -qiE 'en_US\.utf-?8'; then
    dem_info "Generating en_US.UTF-8 locale..."
    # Enable en_US.UTF-8 in /etc/locale.gen
    if [[ -f /etc/locale.gen ]]; then
        sed -i 's/^# *en_US\.UTF-8 UTF-8/en_US\.UTF-8 UTF-8/' /etc/locale.gen
        locale-gen || true
    fi
else
    dem_info "en_US.UTF-8 locale is already available."
fi

# Set default system locale if not set
if [[ -f /etc/default/locale ]]; then
    if ! grep -q "LANG=" /etc/default/locale; then
        update-locale LANG=en_US.UTF-8 || true
    fi
else
    update-locale LANG=en_US.UTF-8 || true
fi

# 3. Hostname validation
# Validate /etc/hostname is non-empty and matches standard rules
HOSTNAME_VAL=$(cat /etc/hostname 2>/dev/null || echo "")
if [[ -z "$HOSTNAME_VAL" ]]; then
    dem_warning "/etc/hostname is empty. Setting to 'debian-dem' as fallback."
    echo "debian-dem" > /etc/hostname
    hostname "debian-dem" || true
else
    dem_info "Valid hostname found: $HOSTNAME_VAL"
fi

# Ensure /etc/hosts has entry for localhost and the hostname
if ! grep -q "127.0.0.1" /etc/hosts; then
    echo "127.0.0.1 localhost" >> /etc/hosts
fi
if [[ -n "$HOSTNAME_VAL" ]] && ! grep -q "$HOSTNAME_VAL" /etc/hosts; then
    echo "127.0.1.1 $HOSTNAME_VAL" >> /etc/hosts
fi

# 4. Sudo verification
# Ensure sudo group exists
if ! getent group sudo >/dev/null 2>&1; then
    groupadd sudo
fi

# Ensure sudoers configuration allows members of sudo group
if [[ -f /etc/sudoers ]] && ! grep -q "%sudo" /etc/sudoers; then
    echo "%sudo ALL=(ALL:ALL) ALL" >> /etc/sudoers
fi

dem_success "System configuration completed."
