#!/usr/bin/env bash
set -euo pipefail

dem_title "Configure Core"

mkdir -p /etc/apt/keyrings

chmod 0755 /etc/apt/keyrings

dem_success "Core configuration completed."