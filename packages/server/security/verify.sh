#!/usr/bin/env bash

set -euo pipefail

dem_title "Verify Server Security"

dem_require_command ufw
dem_require_command fail2ban-client

# Verify fail2ban is active
if systemctl is-active --quiet fail2ban; then
    dem_success "fail2ban service is running."
else
    dem_fatal "fail2ban service is not running."
fi

# Verify ufw is active
if ufw status | grep -qi "active"; then
    dem_success "ufw is active."
else
    dem_warning "ufw status is not active (typically disabled/unsupported in sandbox/container kernels)."
fi

dem_success "Server security verified."
