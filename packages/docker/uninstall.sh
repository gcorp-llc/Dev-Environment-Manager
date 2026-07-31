#!/usr/bin/env bash

dem_title "Remove Docker"

systemctl stop docker 2>/dev/null

apt purge -y \
    docker.io \
    docker-compose-v2 \
    containerd \
    runc

apt autoremove -y

rm -rf /var/lib/docker
rm -rf /var/lib/containerd
rm -rf /etc/docker

dem_success "Docker removed."