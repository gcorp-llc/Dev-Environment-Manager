#!/usr/bin/env bash

set -euo pipefail

dem_title "Server Security"

dem_package_install ufw fail2ban

dem_success "Server security packages installed."
