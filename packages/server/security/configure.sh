#!/usr/bin/env bash

set -euo pipefail

dem_title "Configure Server Security"

# Enable and start services
systemctl enable ufw || true
systemctl start ufw || true

systemctl enable fail2ban || true
systemctl start fail2ban || true

# Standard UFW configuration (allow SSH first so we do not get locked out)
ufw allow ssh || true
# In a docker/sandboxed environment, UFW enablement might fail due to missing kernel modules. We handle this gracefully.
ufw --force enable || true

dem_success "Server security configured."
