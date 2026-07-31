#!/usr/bin/env bash

dem_title "Rust"

if dem_command_exists cargo; then
    dem_success "Rust already installed."
    return
fi

curl https://sh.rustup.rs -sSf | sh -s -- -y

source "$HOME/.cargo/env"

rustup update

dem_success "Rust installed."