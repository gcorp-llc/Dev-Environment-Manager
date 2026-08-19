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
    exit "${DEM_EXIT_ERROR:-1}"

}

dem_fatal_code() {

    local code="$1"
    shift
    dem_error "$@"
    exit "$code"

}

dem_exit() {

    local code="${1:-0}"
    exit "$code"

}

dem_dry_run_log() {

    dem_log "DRY " "$DEM_WARNING" "[Dry-Run] $*"

}
