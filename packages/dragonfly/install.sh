#!/usr/bin/env bash

dem_title "DragonflyDB"

if dem_command_exists dragonfly; then
    dem_success "DragonflyDB already installed."
    return
fi

mkdir -p /opt/dragonfly

LATEST=$(curl -fsSL https://api.github.com/repos/dragonflydb/dragonfly/releases/latest \
| jq -r '.tag_name')

ARCHIVE="dragonfly-x86_64.tar.gz"

curl -L \
"https://github.com/dragonflydb/dragonfly/releases/download/${LATEST}/${ARCHIVE}" \
-o /tmp/dragonfly.tar.gz

tar -xzf /tmp/dragonfly.tar.gz -C /opt/dragonfly

ln -sf /opt/dragonfly/dragonfly /usr/local/bin/dragonfly

dem_success "DragonflyDB installed."