#!/usr/bin/env bash

dem_title "Verify Docker"

dem_require_command docker

docker --version

docker compose version

systemctl is-active docker

docker info >/dev/null

docker run --rm hello-world

dem_success "Docker verification completed."