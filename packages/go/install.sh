#!/usr/bin/env bash

dem_title "Go"

if dem_command_exists go; then
    dem_success "Go already installed."
    return
fi

apt install -y golang-go

dem_success "Go installed."