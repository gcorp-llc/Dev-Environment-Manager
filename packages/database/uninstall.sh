#!/usr/bin/env bash

dem_title "Remove Database"

systemctl stop postgresql 2>/dev/null

apt purge -y \
    postgresql \
    postgresql-client

apt autoremove -y

rm -rf /var/lib/postgresql
rm -rf /etc/postgresql

dem_success "Database removed."