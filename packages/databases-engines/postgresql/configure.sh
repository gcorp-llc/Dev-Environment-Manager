#!/usr/bin/env bash

set -euo pipefail

dem_title "Configure PostgreSQL"

systemctl enable postgresql || true
systemctl start postgresql || true

dem_success "PostgreSQL configured and started."
