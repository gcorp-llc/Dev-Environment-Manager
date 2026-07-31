#!/usr/bin/env bash

dem_command_cleanup() {

    dem_validate_root

    dem_title "Cleanup"

    apt autoremove -y
    apt autoclean
    apt clean

    rm -rf /tmp/*
    rm -rf "$DEM_CACHE_DIR"/* 2>/dev/null

    dem_success "Cleanup completed."

}