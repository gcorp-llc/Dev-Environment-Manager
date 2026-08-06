dem_docker_installed() {

    dem_command_exists docker

}

dem_docker_compose_installed() {

    docker compose version >/dev/null 2>&1

}

dem_docker_up() {

    docker compose up -d

}

dem_docker_down() {

    docker compose down

}

dem_docker_pull() {

    docker compose pull

}

dem_docker_ps() {

    docker ps

}

dem_docker_logs() {

    docker compose logs -f

}

dem_docker_restart() {

    docker compose restart

}
