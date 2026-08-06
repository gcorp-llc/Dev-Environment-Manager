#!/usr/bin/env bash
set -euo pipefail
dem_title "Verify Core"

dem_require_command git
dem_require_command curl
dem_require_command wget
dem_require_command gcc
dem_require_command g++
dem_require_command make

dem_require_file "/etc/apt/sources.list.d/docker.list"
dem_require_file "/etc/apt/sources.list.d/vscode.list"
dem_require_file "/etc/apt/sources.list.d/nodesource.list"
dem_require_file "/etc/apt/sources.list.d/pgdg.list"
dem_require_file "/etc/apt/sources.list.d/github-cli.list"
dem_require_file "/etc/apt/sources.list.d/hashicorp.list"
dem_require_file "/etc/apt/sources.list.d/helm-stable-debian.list"

dem_success "Core verification completed."
