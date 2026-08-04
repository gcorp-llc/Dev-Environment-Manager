#!/usr/bin/env bash

set -euo pipefail

DEM_PROFILE_NAME="server"

DEM_MODULES=(
    "core"
    "system"
    "docker"
    "databases"
    "languages"
    "databases-engines"
    "tools"
    "server"
)
