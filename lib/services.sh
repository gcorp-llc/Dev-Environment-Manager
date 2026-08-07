dem_service_start() {

    systemctl start "$1"

}

dem_service_stop() {

    systemctl stop "$1"

}

dem_service_restart() {

    systemctl restart "$1"

}

dem_service_enable() {

    systemctl enable "$1"

}

dem_service_disable() {

    systemctl disable "$1"

}

dem_service_running() {

    systemctl is-active --quiet "$1"

}

dem_service_status() {

    systemctl status "$1"

}

dem_service_exists() {

    systemctl list-unit-files "$1" >/dev/null 2>&1

}

dem_service_find_by_pattern() {

    systemctl list-unit-files | grep -oE "$1[^. ]*" | head -n1 || true

}

dem_service_daemon_reload() {

    systemctl daemon-reload

}
