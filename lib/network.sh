#!/usr/bin/env bash

dem_download() {

    curl -fsSL "$1" -o "$2"

}

dem_download_exec() {

    curl -fsSL "$1" | bash

}

dem_get_public_ip() {

    curl -fsSL https://ifconfig.me

}

dem_check_url() {

    curl --head --silent --fail "$1" >/dev/null

}

dem_ping() {

    ping -c1 -W2 "$1" >/dev/null 2>&1

}