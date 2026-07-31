#!/usr/bin/env bash

dem_title "ScyllaDB"

if dem_command_exists scylla; then
    dem_success "ScyllaDB already installed."
    return
fi

curl -fsSL https://repositories.scylladb.com/scylla/repo.key \
| gpg --dearmor \
-o /usr/share/keyrings/scylladb.gpg

echo "deb [signed-by=/usr/share/keyrings/scylladb.gpg] https://repositories.scylladb.com/scylla/deb/debian stable main" \
> /etc/apt/sources.list.d/scylladb.list

apt update

apt install -y scylla

systemctl enable scylla

systemctl start scylla

dem_success "ScyllaDB installed."