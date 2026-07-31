# ==========================================
# Dev Environment Manager
# Project Structure Generator
# Version: 1.0.0
# ==========================================

$Directories = @(
"commands",

"lib",

"profiles",

"packages",
"packages\core",
"packages\desktop",
"packages\server",
"packages\development",
"packages\database",
"packages\docker",
"packages\office",
"packages\fonts",
"packages\security",
"packages\monitoring",
"packages\utilities",

"services",
"services\docker",
"services\nginx",
"services\ssh",
"services\firewall",
"services\postgres",
"services\scylladb",
"services\dragonfly",
"services\meilisearch",

"templates",
"templates\docker-compose",
"templates\wordpress",
"templates\laravel",
"templates\systemd",

"configs",
"configs\git",
"configs\bash",
"configs\docker",
"configs\ssh",
"configs\nginx",
"configs\fonts",

"tests",
"docs",
"logs",
"cache",
"tmp",
"assets"
)

$Files = @(

"dem.sh",
"bootstrap.sh",
"config.sh",
"README.md",
"LICENSE",
"CHANGELOG.md",
"VERSION",
".gitignore",

"commands\install.sh",
"commands\uninstall.sh",
"commands\update.sh",
"commands\upgrade.sh",
"commands\doctor.sh",
"commands\repair.sh",
"commands\cleanup.sh",
"commands\backup.sh",
"commands\restore.sh",
"commands\status.sh",
"commands\profile.sh",
"commands\service.sh",
"commands\version.sh",

"lib\logger.sh",
"lib\colors.sh",
"lib\ui.sh",
"lib\utils.sh",
"lib\checks.sh",
"lib\packages.sh",
"lib\docker.sh",
"lib\network.sh",
"lib\filesystem.sh",
"lib\profile.sh",
"lib\services.sh",
"lib\validation.sh",

"profiles\desktop.profile",
"profiles\server.profile",
"profiles\minimal.profile",

"packages\core\install.sh",
"packages\desktop\install.sh",
"packages\server\install.sh",
"packages\development\install.sh",
"packages\database\install.sh",
"packages\docker\install.sh",
"packages\office\install.sh",
"packages\fonts\install.sh",
"packages\security\install.sh",
"packages\monitoring\install.sh",
"packages\utilities\install.sh"
)

Write-Host ""
Write-Host "Creating Dev Environment Manager..."
Write-Host ""

foreach ($Directory in $Directories) {

    if (!(Test-Path $Directory)) {

        New-Item -ItemType Directory -Path $Directory -Force | Out-Null

        Write-Host "[DIR ] $Directory"

    }

}

foreach ($File in $Files) {

    if (!(Test-Path $File)) {

        New-Item -ItemType File -Path $File -Force | Out-Null

        Write-Host "[FILE] $File"

    }

}

Write-Host ""
Write-Host "==========================================="
Write-Host " Dev Environment Manager Created"
Write-Host "==========================================="
Write-Host ""