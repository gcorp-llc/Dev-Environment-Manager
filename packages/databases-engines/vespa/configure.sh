#!/usr/bin/env bash
set -euo pipefail
dem_title "Configure Vespa"

dem_info "Waiting for Vespa config server to start..."
CONFIG_SERVER_READY=false
for i in {1..30}; do
    if curl -sf http://localhost:19071/state/v1/health >/dev/null 2>&1; then
        dem_success "Vespa config server is ready."
        CONFIG_SERVER_READY=true
        break
    else
        dem_info "Vespa config server not ready yet, waiting... ($i/30)"
        sleep 5
    fi
done

if [ "$CONFIG_SERVER_READY" = "true" ]; then
    APP_DIR="/tmp/vespa-app"
    mkdir -p "$APP_DIR/schemas"

    cat << 'EOF' > "$APP_DIR/services.xml"
<?xml version="1.0" encoding="utf-8" ?>
<services version="1.0">
    <container id="default" version="1.0">
        <document-api />
        <search />
        <nodes>
            <node hostalias="node1" />
        </nodes>
    </container>
    <content id="music" version="1.0">
        <redundancy>1</redundancy>
        <documents>
            <document type="music" mode="index" />
        </documents>
        <nodes>
            <node hostalias="node1" distribution-key="0" />
        </nodes>
    </content>
</services>
EOF

    cat << 'EOF' > "$APP_DIR/schemas/music.sd"
schema music {
    document music {
        field title type string {
            indexing: summary | index
        }
    }
}
EOF

    (
        cd "$APP_DIR"
        if dem_command_exists zip; then
            zip -q -r /tmp/vespa-app.zip .
            dem_info "Deploying application package to Vespa config server..."
            curl -sf --header "Content-Type: application/zip" \
                --data-binary @/tmp/vespa-app.zip \
                http://localhost:19071/application/v2/tenant/default/prepareandactivate || dem_warning "Failed to deploy Vespa application package."
            rm -f /tmp/vespa-app.zip
        elif dem_command_exists tar; then
            tar -czf /tmp/vespa-app.tar.gz .
            dem_info "Deploying application package to Vespa config server..."
            curl -sf --header "Content-Type: application/x-gzip" \
                --data-binary @/tmp/vespa-app.tar.gz \
                http://localhost:19071/application/v2/tenant/default/prepareandactivate || dem_warning "Failed to deploy Vespa application package."
            rm -f /tmp/vespa-app.tar.gz
        else
            dem_warning "Neither zip nor tar is available. Skipping Vespa application deployment."
        fi
    )

    rm -rf "$APP_DIR"
else
    dem_warning "Vespa config server did not start in time. Skipping application package deployment."
fi

dem_success "Vespa configuration completed."
