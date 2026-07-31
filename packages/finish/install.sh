#!/usr/bin/env bash

dem_title "Finishing Installation"

apt autoremove -y

apt autoclean

apt clean

dem_success "Dev Environment Manager completed successfully."

echo

echo "=========================================="
echo " Restart your system before development."
echo "=========================================="