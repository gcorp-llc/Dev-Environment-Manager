#!/usr/bin/env bash

dem_title "Verify Database"

dem_require_command psql

psql --version

systemctl is-active postgresql

dem_success "Database verification completed."