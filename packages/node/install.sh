#!/usr/bin/env bash

dem_title "Node.js"

if dem_command_exists node; then
    dem_success "Node.js already installed."
    return
fi

curl -fsSL https://deb.nodesource.com/setup_22.x | bash -

apt install -y nodejs

npm install -g \
pnpm \
yarn \
npm-check-updates

dem_success "Node.js installed."