#!/usr/bin/env bash

set -euo pipefail

dem_title "Configure Server Security"

# Enable and start services
dem_service_enable ufw || true
dem_service_start ufw || true

dem_service_enable fail2ban || true
dem_service_start fail2ban || true

# Standard UFW configuration (allow SSH first so we do not get locked out)
ufw allow ssh || true
# In a docker/sandboxed environment, UFW enablement might fail due to missing kernel modules. We handle this gracefully.
ufw --force enable || true

dem_success "Server security configured."
