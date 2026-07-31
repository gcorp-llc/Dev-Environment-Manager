#!/usr/bin/env bash

dem_title "Docker Desktop"

if dpkg -s docker-desktop >/dev/null 2>&1; then
    dem_success "Docker Desktop already installed."
    return
fi

wget https://desktop.docker.com/linux/main/amd64/docker-desktop-amd64.deb \
-O /tmp/docker-desktop.deb

apt install -y /tmp/docker-desktop.deb

dem_success "Docker Desktop installed."