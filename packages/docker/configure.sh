#!/usr/bin/env bash

dem_title "Configure Docker"

systemctl enable docker

systemctl start docker

if getent group docker >/dev/null 2>&1; then
    usermod -aG docker "${SUDO_USER:-$USER}"
fi

mkdir -p /etc/docker

cat >/etc/docker/daemon.json <<EOF
{
    "log-driver": "json-file",
    "log-opts": {
        "max-size": "10m",
        "max-file": "3"
    },
    "features": {
        "buildkit": true
    }
}
EOF

systemctl restart docker

dem_success "Docker configured."