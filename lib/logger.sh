#!/usr/bin/env bash

dem_log() {

    local level="$1"
    local color="$2"

    shift 2

    printf "%b[%s]%b %s\n" \
        "$color" \
        "$level" \
        "$DEM_RESET" \
        "$*"

}

dem_info() {

    dem_log "INFO" "$DEM_INFO" "$@"

}

dem_success() {

    dem_log " OK " "$DEM_SUCCESS" "$@"

}

dem_warning() {

    dem_log "WARN" "$DEM_WARNING" "$@"

}

dem_error() {

    dem_log "FAIL" "$DEM_ERROR" "$@"

}

dem_fatal() {

    dem_error "$@"
    exit 1

}