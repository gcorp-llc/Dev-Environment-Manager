#!/usr/bin/env bash

set -euo pipefail

dem_title "Uninstall Server Security"

systemctl stop fail2ban || true
systemctl disable fail2ban || true

ufw --force disable || true
systemctl stop ufw || true
systemctl disable ufw || true

dem_package_remove ufw fail2ban

dem_success "Server security uninstalled."
