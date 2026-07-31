#!/usr/bin/env bash

dem_banner() {

cat <<EOF

=========================================
      Dev Environment Manager
=========================================

Version : ${DEM_VERSION}

EOF

}

dem_line() {

    printf '%*s\n' 41 '' | tr ' ' '='

}

dem_title() {

    echo
    dem_line
    echo "$1"
    dem_line

}

dem_pause() {

    read -rp "Press ENTER to continue..."

}

dem_confirm() {

    read -rp "$1 [y/N]: " answer

    [[ "$answer" =~ ^[Yy]$ ]]

}