#!/usr/bin/env bash

dem_profile_exists() {

    [[ -f "$DEM_PROFILE_DIR/$1.profile" ]]

}

dem_profile_load() {

    dem_profile_exists "$1" || dem_fatal "Profile not found: $1"

    source "$DEM_PROFILE_DIR/$1.profile"

}

dem_profile_list() {

    find "$DEM_PROFILE_DIR" \
        -type f \
        -name "*.profile" \
        -exec basename {} .profile \;

}