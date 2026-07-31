#!/usr/bin/env bash

dem_mkdir() {

    mkdir -p "$1"

}

dem_touch() {

    touch "$1"

}

dem_rm_file() {

    rm -f "$1"

}

dem_rm_dir() {

    rm -rf "$1"

}

dem_copy_file() {

    cp "$1" "$2"

}

dem_copy_dir() {

    cp -R "$1" "$2"

}

dem_move() {

    mv "$1" "$2"

}

dem_chmod() {

    chmod "$1" "$2"

}

dem_backup() {

    cp "$1" "$1.bak"

}

dem_restore() {

    mv "$1.bak" "$1"

}