#!/usr/bin/env bash

dem_title "Configure Database Services"

systemctl enable postgresql

systemctl start postgresql

dem_success "PostgreSQL configured."