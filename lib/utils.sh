dem_command_exists() {

    command -v "$1" >/dev/null 2>&1

}

dem_is_root() {

    [[ "$EUID" -eq 0 ]]

}

dem_file_exists() {

    [[ -f "$1" ]]

}

dem_directory_exists() {

    [[ -d "$1" ]]

}

dem_require_root() {

    dem_is_root || dem_fatal_code "${DEM_EXIT_PREREQ_MISSING:-2}" "Run as root."

}

dem_require_command() {

    dem_command_exists "$1" || dem_fatal_code "${DEM_EXIT_PREREQ_MISSING:-2}" "Missing command: $1"

}

dem_require_file() {

    dem_file_exists "$1" || dem_fatal_code "${DEM_EXIT_PREREQ_MISSING:-2}" "Missing file: $1"

}

dem_require_directory() {

    dem_directory_exists "$1" || dem_fatal_code "${DEM_EXIT_PREREQ_MISSING:-2}" "Missing directory: $1"

}

dem_is_dry_run() {

    [[ "${DEM_DRY_RUN:-false}" == "true" ]]

}
