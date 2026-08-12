export interface PackageModule {
  id: string;
  name: string;
  category: string;
  description: string;
  packages: string[];
  status: 'installed' | 'configured' | 'verified' | 'uninstalled' | 'error';
  version?: string;
  hasServices?: boolean;
  serviceName?: string;
  scripts: {
    install?: string;
    configure?: string;
    verify?: string;
    uninstall?: string;
  };
}

export interface Profile {
  id: string;
  name: string;
  description: string;
  target: string;
  modules: string[]; // array of module or category IDs
  isInstalled: boolean;
}

export interface DiagnosticCheck {
  id: string;
  title: string;
  category: 'System' | 'Packages' | 'Security' | 'Services' | 'Hardware' | 'Storage';
  status: 'pass' | 'warn' | 'fail' | 'pending';
  message: string;
  fixAction?: string;
}

export interface CategoryInfo {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
}

export const CATEGORIES: CategoryInfo[] = [
  { id: 'core', name: 'Core Infrastructure', description: 'Base compilation tools, SSL certs, GPG & foundational archives', icon: 'Cpu', color: 'emerald' },
  { id: 'system', name: 'System Configuration', description: 'Debian 13 locales, UTC timezone, security limits & sudo policies', icon: 'Sliders', color: 'cyan' },
  { id: 'development', name: 'Developer Utilities', description: 'CLI parsers, JSON formatters, bash auto-completions & shell helpers', icon: 'Terminal', color: 'purple' },
  { id: 'docker', name: 'Docker Stack', description: 'Docker Engine CE, Containerd daemon & Compose v2 plugin', icon: 'Box', color: 'blue' },
  { id: 'languages', name: 'Languages & Runtimes', description: 'Node.js v22 LTS, Go 1.22, PHP 8.3 FPM & Rust Cargo toolchain', icon: 'Code', color: 'indigo' },
  { id: 'databases', name: 'Database Clients', description: 'MariaDB client, Redis tools CLI & SQLite3 embedded database', icon: 'Database', color: 'amber' },
  { id: 'databases-engines', name: 'Production DB Engines', description: 'PostgreSQL 16, ScyllaDB, DragonflyDB, Redpanda & MariaDB Server', icon: 'Server', color: 'rose' },
  { id: 'frameworks', name: 'Framework Stacks', description: 'Composer, WP-CLI, OpenJDK 17 & React Native toolchains', icon: 'Layers', color: 'teal' },
  { id: 'tools', name: 'DevOps & CLI Tools', description: 'kubectl, Helm, Terraform, ripgrep, bat, fzf, btop & fastfetch', icon: 'Wrench', color: 'emerald' },
  { id: 'desktop', name: 'Desktop Workstation', description: 'VS Code with GPG keyrings, Fira Code & Hack Nerd fonts', icon: 'Monitor', color: 'sky' },
  { id: 'office', name: 'Office Productivity', description: 'LibreOffice Suite & Evince PDF document viewer', icon: 'FileText', color: 'purple' },
  { id: 'server', name: 'Security & Monitoring', description: 'UFW Firewall, Fail2ban intrusion protection & Node Exporter', icon: 'ShieldCheck', color: 'emerald' },
];

export const DEFAULT_MODULES: PackageModule[] = [
  {
    id: 'mod-core-base',
    name: 'Core Base Toolchain',
    category: 'core',
    description: 'Essential Debian 13 build tools, compilers, SSL keys and curl/git binaries.',
    packages: ['build-essential', 'ca-certificates', 'gnupg', 'curl', 'wget', 'git', 'unzip', 'pkg-config', 'cmake'],
    status: 'verified',
    version: '13.0-trixie',
    hasServices: false,
    scripts: {
      install: `#!/usr/bin/env bash\nset -euo pipefail\nmkdir -p /etc/apt/keyrings\napt-get update -qq\napt-get install -y build-essential ca-certificates gnupg curl wget git unzip pkg-config cmake\necho "Core build tools installed."`,
      configure: `#!/usr/bin/env bash\nset -euo pipefail\ngit config --system core.autocrlf input\necho "Git system configuration applied."`,
      verify: `#!/usr/bin/env bash\nwhich gcc make git curl || exit 1\necho "Core tools verified in PATH."`,
      uninstall: `#!/usr/bin/env bash\napt-get remove -y build-essential cmake`
    }
  },
  {
    id: 'mod-system-config',
    name: 'System Locales & Sudo Policies',
    category: 'system',
    description: 'Configure en_US.UTF-8 locale, UTC system clock, and passwordless sudo for dev group.',
    packages: ['locales', 'tzdata', 'sudo', 'systemd-timesyncd'],
    status: 'configured',
    version: '2025.1',
    hasServices: true,
    serviceName: 'systemd-timesyncd',
    scripts: {
      install: `#!/usr/bin/env bash\napt-get install -y locales tzdata sudo systemd-timesyncd`,
      configure: `#!/usr/bin/env bash\ntimedatectl set-timezone UTC\nlocale-gen en_US.UTF-8\necho "System timezone set to UTC."`,
      verify: `#!/usr/bin/env bash\ntimedatectl status | grep "Time zone: UTC"`,
      uninstall: `#!/usr/bin/env bash\necho "System defaults cannot be fully purged."`
    }
  },
  {
    id: 'mod-dev-utils',
    name: 'Developer Utilities Stack',
    category: 'development',
    description: 'High performance CLI string parsers, tree viewers, less pagers and auto-completion.',
    packages: ['jq', 'tree', 'less', 'bash-completion', 'strace', 'lsof'],
    status: 'verified',
    version: '1.7.1',
    hasServices: false,
    scripts: {
      install: `#!/usr/bin/env bash\napt-get install -y jq tree less bash-completion strace lsof`,
      configure: `#!/usr/bin/env bash\necho "source /etc/profile.d/bash_completion.sh" >> /etc/bash.bashrc`,
      verify: `#!/usr/bin/env bash\njq --version && tree --version`,
      uninstall: `#!/usr/bin/env bash\napt-get purge -y jq tree strace lsof`
    }
  },
  {
    id: 'mod-docker-engine',
    name: 'Docker Engine CE & Compose v2',
    category: 'docker',
    description: 'Official Docker CE repository setup with containerd runtime & compose plugin for Debian Trixie.',
    packages: ['docker-ce', 'docker-ce-cli', 'containerd.io', 'docker-compose-plugin'],
    status: 'installed',
    version: '27.5.1',
    hasServices: true,
    serviceName: 'docker',
    scripts: {
      install: `#!/usr/bin/env bash\ncurl -fsSL https://download.docker.com/linux/debian/gpg | gpg --dearmor -o /etc/apt/keyrings/docker.gpg\necho "deb [arch=amd64 signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/debian trixie stable" > /etc/apt/sources.list.d/docker.list\napt-get update\napt-get install -y docker-ce docker-ce-cli containerd.io docker-compose-plugin`,
      configure: `#!/usr/bin/env bash\nsystemctl enable docker\nusermod -aG docker $USER || true`,
      verify: `#!/usr/bin/env bash\ndocker --version && docker compose version`,
      uninstall: `#!/usr/bin/env bash\napt-get purge -y docker-ce docker-ce-cli containerd.io docker-compose-plugin\nrm -f /etc/apt/sources.list.d/docker.list`
    }
  },
  {
    id: 'mod-lang-nodejs',
    name: 'Node.js v22 LTS & Corepack',
    category: 'languages',
    description: 'NodeSource v22.x LTS repository for Debian 13 with npm, pnpm and yarn corepack enabled.',
    packages: ['nodejs'],
    status: 'verified',
    version: 'v22.14.0',
    hasServices: false,
    scripts: {
      install: `#!/usr/bin/env bash\ncurl -fsSL https://deb.nodesource.com/setup_22.x | bash -\napt-get install -y nodejs`,
      configure: `#!/usr/bin/env bash\ncorepack enable`,
      verify: `#!/usr/bin/env bash\nnode -v && npm -v && corepack --version`,
      uninstall: `#!/usr/bin/env bash\napt-get purge -y nodejs\nrm -f /etc/apt/sources.list.d/nodesource.list`
    }
  },
  {
    id: 'mod-lang-go',
    name: 'Go Language Runtime',
    category: 'languages',
    description: 'Google Go compiler toolchain v1.22 with GOPATH and GOBIN environment setup.',
    packages: ['golang-go'],
    status: 'installed',
    version: '1.22.6',
    hasServices: false,
    scripts: {
      install: `#!/usr/bin/env bash\napt-get install -y golang-go`,
      configure: `#!/usr/bin/env bash\necho 'export PATH=$PATH:/usr/local/go/bin' >> /etc/profile.d/go.sh`,
      verify: `#!/usr/bin/env bash\ngo version`,
      uninstall: `#!/usr/bin/env bash\napt-get purge -y golang-go`
    }
  },
  {
    id: 'mod-db-clients',
    name: 'Database Clients Suite',
    category: 'databases',
    description: 'MariaDB client CLI, Redis tools, and SQLite3 command line tools.',
    packages: ['mariadb-client', 'redis-tools', 'sqlite3'],
    status: 'verified',
    version: '10.11 / 7.2',
    hasServices: false,
    scripts: {
      install: `#!/usr/bin/env bash\napt-get install -y mariadb-client redis-tools sqlite3`,
      configure: `#!/usr/bin/env bash\necho "Database clients ready."`,
      verify: `#!/usr/bin/env bash\nmariadb --version && redis-cli --version && sqlite3 --version`,
      uninstall: `#!/usr/bin/env bash\napt-get purge -y mariadb-client redis-tools sqlite3`
    }
  },
  {
    id: 'mod-db-postgresql16',
    name: 'PostgreSQL 16 Engine',
    category: 'databases-engines',
    description: 'PostgreSQL 16 database server with pg_stat_statements & automated systemd service.',
    packages: ['postgresql-16', 'postgresql-contrib'],
    status: 'configured',
    version: '16.6',
    hasServices: true,
    serviceName: 'postgresql',
    scripts: {
      install: `#!/usr/bin/env bash\napt-get install -y postgresql-16 postgresql-contrib`,
      configure: `#!/usr/bin/env bash\nsystemctl enable postgresql\nsystemctl start postgresql`,
      verify: `#!/usr/bin/env bash\nsystemctl is-active postgresql && psql --version`,
      uninstall: `#!/usr/bin/env bash\nsystemctl stop postgresql\napt-get purge -y postgresql-16 postgresql-contrib`
    }
  },
  {
    id: 'mod-db-dragonfly',
    name: 'DragonflyDB High Performance Cache',
    category: 'databases-engines',
    description: 'Ultra-fast Redis & Memcached drop-in replacement engine optimized for modern multi-threading.',
    packages: ['dragonfly'],
    status: 'uninstalled',
    version: '1.14.0',
    hasServices: true,
    serviceName: 'dragonfly',
    scripts: {
      install: `#!/usr/bin/env bash\ncurl -sSL https://dragonflydb.io/install.sh | bash`,
      configure: `#!/usr/bin/env bash\nsystemctl enable --now dragonfly`,
      verify: `#!/usr/bin/env bash\nredis-cli -p 6379 PING`,
      uninstall: `#!/usr/bin/env bash\nsystemctl stop dragonfly`
    }
  },
  {
    id: 'mod-framework-laravel',
    name: 'Laravel Composer & PHP 8.3',
    category: 'frameworks',
    description: 'PHP 8.3 FPM runtime, XML, Mbstring, Curl extensions, and Composer package manager.',
    packages: ['php8.3-cli', 'php8.3-fpm', 'php8.3-curl', 'php8.3-mbstring', 'php8.3-xml', 'composer'],
    status: 'installed',
    version: 'PHP 8.3.16',
    hasServices: true,
    serviceName: 'php8.3-fpm',
    scripts: {
      install: `#!/usr/bin/env bash\napt-get install -y php8.3-cli php8.3-fpm php8.3-curl php8.3-mbstring php8.3-xml composer`,
      configure: `#!/usr/bin/env bash\nsystemctl enable php8.3-fpm`,
      verify: `#!/usr/bin/env bash\nphp -v && composer --version`,
      uninstall: `#!/usr/bin/env bash\napt-get purge -y php8.3* composer`
    }
  },
  {
    id: 'mod-tools-devops',
    name: 'DevOps & Modern CLI Suite',
    category: 'tools',
    description: 'GitHub CLI (gh), kubectl, helm, terraform, btop, ripgrep, bat, fzf & fastfetch system summary.',
    packages: ['gh', 'kubectl', 'helm', 'terraform', 'htop', 'btop', 'ripgrep', 'fzf', 'bat', 'eza', 'fastfetch'],
    status: 'verified',
    version: '2025.2',
    hasServices: false,
    scripts: {
      install: `#!/usr/bin/env bash\napt-get install -y htop btop ripgrep fzf bat eza fastfetch || true`,
      configure: `#!/usr/bin/env bash\nalias cat="batcat"\nalias ls="eza"`,
      verify: `#!/usr/bin/env bash\nrg --version && btop --version`,
      uninstall: `#!/usr/bin/env bash\napt-get purge -y btop ripgrep fzf bat eza fastfetch`
    }
  },
  {
    id: 'mod-desktop-vscode',
    name: 'VS Code & Developer Fonts',
    category: 'desktop',
    description: 'Microsoft VS Code official APT repository with GPG keyring and Fira Code / Hack Nerd Fonts.',
    packages: ['code', 'fonts-firacode', 'fonts-hack-ttf'],
    status: 'installed',
    version: '1.97.0',
    hasServices: false,
    scripts: {
      install: `#!/usr/bin/env bash\nwget -qO- https://packages.microsoft.com/keys/microsoft.asc | gpg --dearmor > /etc/apt/keyrings/packages.microsoft.gpg\necho "deb [arch=amd64,arm64 signed-by=/etc/apt/keyrings/packages.microsoft.gpg] https://packages.microsoft.com/repos/code stable main" > /etc/apt/sources.list.d/vscode.list\napt-get update\napt-get install -y code fonts-firacode fonts-hack-ttf`,
      configure: `#!/usr/bin/env bash\nfc-cache -f -v`,
      verify: `#!/usr/bin/env bash\ncode --version`,
      uninstall: `#!/usr/bin/env bash\napt-get purge -y code\nrm -f /etc/apt/sources.list.d/vscode.list`
    }
  },
  {
    id: 'mod-office-suite',
    name: 'LibreOffice & Evince PDF Reader',
    category: 'office',
    description: 'LibreOffice productivity suite and Evince document viewer for workstation builds.',
    packages: ['libreoffice', 'evince'],
    status: 'installed',
    version: '24.2.5',
    hasServices: false,
    scripts: {
      install: `#!/usr/bin/env bash\napt-get install -y libreoffice evince`,
      configure: `#!/usr/bin/env bash\necho "Office productivity installed."`,
      verify: `#!/usr/bin/env bash\nlibreoffice --version && evince --version`,
      uninstall: `#!/usr/bin/env bash\napt-get purge -y libreoffice evince`
    }
  },
  {
    id: 'mod-server-security',
    name: 'UFW Firewall & Fail2ban Defense',
    category: 'server',
    description: 'Uncomplicated Firewall (UFW), Fail2ban SSH brute-force protection & Prometheus Node Exporter.',
    packages: ['ufw', 'fail2ban', 'prometheus-node-exporter'],
    status: 'verified',
    version: '1.0.2',
    hasServices: true,
    serviceName: 'fail2ban',
    scripts: {
      install: `#!/usr/bin/env bash\napt-get install -y ufw fail2ban prometheus-node-exporter`,
      configure: `#!/usr/bin/env bash\nufw allow 22/tcp\nufw allow 80/tcp\nufw allow 443/tcp\nufw --force enable\nsystemctl enable --now fail2ban prometheus-node-exporter`,
      verify: `#!/usr/bin/env bash\nufw status | grep "Status: active" && systemctl is-active fail2ban`,
      uninstall: `#!/usr/bin/env bash\nufw disable\nsystemctl stop fail2ban\napt-get purge -y ufw fail2ban prometheus-node-exporter`
    }
  }
];

export const DEFAULT_PROFILES: Profile[] = [
  {
    id: 'prof-minimal',
    name: 'Minimal Dev Base',
    description: 'Lightweight setup containing Core Infrastructure, System Locales, and Developer Utilities.',
    target: 'Debian 13 Minimal VPS / Container',
    modules: ['core', 'system', 'development'],
    isInstalled: true
  },
  {
    id: 'prof-server-prod',
    name: 'Production Server Stack',
    description: 'Hardened cloud VPS setup with Docker CE Engine, PostgreSQL 16, UFW firewall, and Fail2ban monitoring.',
    target: 'Debian 13 Cloud VPS (x86_64)',
    modules: ['core', 'system', 'docker', 'databases-engines', 'server'],
    isInstalled: true
  },
  {
    id: 'prof-fullstack',
    name: 'Full-Stack Developer Engine',
    description: 'Complete development workspace with Node.js v22, Go 1.22, Docker, Database Clients, DevOps CLI, and Laravel Composer.',
    target: 'Debian 13 Developer Workstation',
    modules: ['core', 'system', 'development', 'docker', 'languages', 'databases', 'frameworks', 'tools'],
    isInstalled: false
  },
  {
    id: 'prof-desktop-workstation',
    name: 'Complete Desktop Workstation',
    description: 'Full workstation suite including VS Code IDE, developer fonts, LibreOffice suite, and security firewall.',
    target: 'Debian 13 Desktop (GNOME/KDE)',
    modules: ['core', 'system', 'development', 'docker', 'languages', 'databases', 'tools', 'desktop', 'office', 'server'],
    isInstalled: false
  }
];

export const DEFAULT_DIAGNOSTICS: DiagnosticCheck[] = [
  {
    id: 'diag-debian-rel',
    title: 'Debian Release Version Compatibility',
    category: 'System',
    status: 'pass',
    message: 'Confirmed Debian 13 (Trixie) release target in /etc/os-release.',
  },
  {
    id: 'diag-dpkg-lock',
    title: 'APT Package Lock File Status',
    category: 'Packages',
    status: 'pass',
    message: 'No stale /var/lib/dpkg/lock-frontend or /var/lib/apt/lists/lock files detected.',
  },
  {
    id: 'diag-gpg-keyrings',
    title: 'GPG Keyrings Directory Integrity',
    category: 'Security',
    status: 'pass',
    message: '/etc/apt/keyrings/ present with root:root permissions (0755).',
  },
  {
    id: 'diag-systemd-init',
    title: 'Systemd PID 1 Init Controller',
    category: 'Services',
    status: 'pass',
    message: 'Active systemd init daemon running with full dbus IPC support.',
  },
  {
    id: 'diag-cpu-avx2',
    title: 'CPU Instruction Set (AVX2 / FMA)',
    category: 'Hardware',
    status: 'pass',
    message: 'Processor supports AVX2 & FMA instruction sets required for ScyllaDB & Vector search engines.',
  },
  {
    id: 'diag-disk-storage',
    title: 'Root File System Space Allocation',
    category: 'Storage',
    status: 'pass',
    message: 'Root partition has 42.8 GB available (Minimum requirement: 10 GB).',
  },
  {
    id: 'diag-ufw-status',
    title: 'Firewall Policy Enforcement (UFW)',
    category: 'Security',
    status: 'warn',
    message: 'UFW active, but SSH port 22 allows all incoming connections without IP restriction.',
    fixAction: 'ufw limit proto tcp from any to any port 22'
  },
  {
    id: 'diag-docker-daemon',
    title: 'Docker Container Runtime IPC Socket',
    category: 'Services',
    status: 'pass',
    message: '/var/run/docker.sock active and listening.',
  }
];

// LocalStorage helpers
export const STORAGE_KEYS = {
  MODULES: 'dem_modules_v2.5',
  PROFILES: 'dem_profiles_v2.5',
  DIAGNOSTICS: 'dem_diagnostics_v2.5',
};

export function loadStoredModules(): PackageModule[] {
  if (typeof window === 'undefined') return DEFAULT_MODULES;
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.MODULES);
    return raw ? JSON.parse(raw) : DEFAULT_MODULES;
  } catch {
    return DEFAULT_MODULES;
  }
}

export function saveStoredModules(modules: PackageModule[]) {
  if (typeof window === 'undefined') return;
  localStorage.setItem(STORAGE_KEYS.MODULES, JSON.stringify(modules));
}

export function loadStoredProfiles(): Profile[] {
  if (typeof window === 'undefined') return DEFAULT_PROFILES;
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.PROFILES);
    return raw ? JSON.parse(raw) : DEFAULT_PROFILES;
  } catch {
    return DEFAULT_PROFILES;
  }
}

export function saveStoredProfiles(profiles: Profile[]) {
  if (typeof window === 'undefined') return;
  localStorage.setItem(STORAGE_KEYS.PROFILES, JSON.stringify(profiles));
}

export function loadStoredDiagnostics(): DiagnosticCheck[] {
  if (typeof window === 'undefined') return DEFAULT_DIAGNOSTICS;
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.DIAGNOSTICS);
    return raw ? JSON.parse(raw) : DEFAULT_DIAGNOSTICS;
  } catch {
    return DEFAULT_DIAGNOSTICS;
  }
}

export function saveStoredDiagnostics(diagnostics: DiagnosticCheck[]) {
  if (typeof window === 'undefined') return;
  localStorage.setItem(STORAGE_KEYS.DIAGNOSTICS, JSON.stringify(diagnostics));
}
