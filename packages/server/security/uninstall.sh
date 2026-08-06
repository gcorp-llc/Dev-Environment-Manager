#!/usr/bin/env bash
set -euo pipefail
dem_title "Uninstall Server Security"

dem_service_stop fail2ban || true
dem_service_disable fail2ban || true

ufw --force disable || true
dem_service_stop ufw || true
dem_service_disable ufw || true

dem_package_remove ufw fail2ban

dem_success "Server security uninstalled."
