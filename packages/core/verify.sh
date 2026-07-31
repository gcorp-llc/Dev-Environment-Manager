#!/usr/bin/env bash

dem_title "Verify Core"

dem_require_command git
dem_require_command curl
dem_require_command wget
dem_require_command gcc

git --version
curl --version
wget --version

dem_success "Core verification completed."