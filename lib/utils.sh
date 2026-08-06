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

    dem_is_root || dem_fatal "Run as root."

}

dem_require_command() {

    dem_command_exists "$1" || dem_fatal "Missing command: $1"

}

dem_require_file() {

    dem_file_exists "$1" || dem_fatal "Missing file: $1"

}

dem_require_directory() {

    dem_directory_exists "$1" || dem_fatal "Missing directory: $1"

}
