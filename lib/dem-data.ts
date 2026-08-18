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
  scripts?: {
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
  modules: string[]; // Module IDs or Category IDs
  isInstalled: boolean;
}

export interface DiagnosticCheck {
  id: string;
  title: string;
  category: string;
  status: 'pass' | 'warn' | 'fail' | 'pending';
  message: string;
  fixAction?: string;
}

export interface Category {
  id: string;
  name: string;
  number: number;
  description: string;
  iconName: string;
}

export const CATEGORIES: Category[] = [
  { id: 'core', number: 1, name: 'Core Infrastructure', iconName: 'Cpu', description: 'Essential compilation tools, certificates, GPG, wget, curl, git, unzip, build-essential' },
  { id: 'system', number: 2, name: 'System Configuration', iconName: 'Settings', description: 'System clock/timezone, hostname validation, locales generator, sudo access' },
  { id: 'development', number: 3, name: 'Developer Utilities', iconName: 'Code2', description: 'Developer convenience tools like jq, tree, less, bash-completion' },
  { id: 'docker', number: 4, name: 'Docker Stack', iconName: 'Container', description: 'Modern Docker Engine, docker-ce, containerd, and docker-compose-plugin' },
  { id: 'languages', number: 5, name: 'Languages & Runtimes', iconName: 'Terminal', description: 'Compilers and runtimes for Node.js (LTS), Go, PHP, Rust (cargo, rustc)' },
  { id: 'databases', number: 6, name: 'Database Clients', iconName: 'Database', description: 'Common DB client utilities: mariadb-client, redis-tools, sqlite3' },
  { id: 'databases-engines', number: 7, name: 'Database Engines', iconName: 'Server', description: 'Production-grade DB services: ScyllaDB, DragonflyDB, Redpanda, Vespa, MariaDB, PostgreSQL' },
  { id: 'frameworks', number: 8, name: 'Framework Stacks', iconName: 'Layers', description: 'Laravel Composer setup, WordPress CLI, React Native / Expo (OpenJDK, adb, fastboot)' },
  { id: 'tools', number: 9, name: 'DevOps & CLI Tools', iconName: 'Wrench', description: 'gh, kubectl, helm, terraform, htop, btop, ripgrep, fzf, bat, eza, fastfetch' },
  { id: 'desktop', number: 10, name: 'Desktop & Workstation', iconName: 'Monitor', description: 'VS Code installation, Fira Code / Hack Nerd fonts, development tools' },
  { id: 'office', number: 11, name: 'Office & Productivity', iconName: 'FileText', description: 'Document and productivity suite (libreoffice, evince)' },
  { id: 'server', number: 12, name: 'Server Security & Monitoring', iconName: 'ShieldCheck', description: 'Host security and monitoring: ufw, fail2ban, prometheus-node-exporter' }
];

export const INITIAL_PROFILES: Profile[] = [
  {
    id: 'minimal',
    name: 'Minimal Container VPS',
    description: 'Base lightweight installation for minimal CLI containers and base VPS instances.',
    target: 'Debian 13 (Trixie) Container / Cloud VPS',
    modules: ['core', 'system'],
    isInstalled: true,
  },
  {
    id: 'server',
    name: 'Production Server Profile',
    description: 'Full backend server setup including Docker engines, databases, language runtimes, monitoring, and security.',
    target: 'Production / Staging Server Nodes',
    modules: ['core', 'system', 'docker', 'databases-clients', 'node', 'go', 'postgresql', 'mariadb', 'devops-tools', 'security-monitoring'],
    isInstalled: true,
  },
  {
    id: 'desktop',
    name: 'Developer Workstation Profile',
    description: 'Complete full-stack workstation containing all 12 modules, IDEs, desktop fonts, and dev stacks.',
    target: 'Local Dev Workstations / Laptops',
    modules: ['core', 'system', 'development', 'docker', 'databases-clients', 'node', 'go', 'php', 'rust', 'postgresql', 'mariadb', 'dragonfly', 'laravel', 'devops-tools', 'vscode', 'fonts', 'office-suite', 'security-monitoring'],
    isInstalled: false,
  }
];

export const INITIAL_MODULES: PackageModule[] = [
  // Core
  {
    id: 'core',
    name: 'Core Base Suite',
    category: 'core',
    description: 'Build essential, ca-certificates, gnupg, wget, curl, git, unzip',
    packages: ['build-essential', 'ca-certificates', 'gnupg', 'wget', 'curl', 'git', 'unzip'],
    status: 'verified',
    scripts: {
      install: '#!/usr/bin/env bash\nset -euo pipefail\napt-get update -qq\napt-get install -y -qq build-essential ca-certificates gnupg wget curl git unzip',
      configure: '#!/usr/bin/env bash\nset -euo pipefail\nmkdir -p /etc/apt/keyrings\nchmod 0755 /etc/apt/keyrings',
      verify: '#!/usr/bin/env bash\nset -euo pipefail\ncommand -v gcc >/dev/null\ncommand -v git >/dev/null\ncommand -v curl >/dev/null',
      uninstall: '#!/usr/bin/env bash\necho "Core packages protected against purge."'
    }
  },
  
  // System
  {
    id: 'system',
    name: 'System Base Config',
    category: 'system',
    description: 'Timezone sync, locale generation, hostname assertion, sudo policies',
    packages: ['tzdata', 'locales', 'sudo'],
    status: 'verified',
    scripts: {
      install: '#!/usr/bin/env bash\napt-get install -y tzdata locales sudo',
      configure: '#!/usr/bin/env bash\nlocale-gen en_US.UTF-8\nupdate-locale LANG=en_US.UTF-8',
      verify: '#!/usr/bin/env bash\nlocale | grep -q "UTF-8"',
      uninstall: '#!/usr/bin/env bash\necho "System configuration retained."'
    }
  },

  // Development
  {
    id: 'development',
    name: 'Dev Utilities',
    category: 'development',
    description: 'JSON parser, directory trees, less pager, bash autocompletion',
    packages: ['jq', 'tree', 'less', 'bash-completion'],
    status: 'verified',
    scripts: {
      install: '#!/usr/bin/env bash\napt-get install -y jq tree less bash-completion',
      configure: '#!/usr/bin/env bash\nsource /usr/share/bash-completion/bash_completion',
      verify: '#!/usr/bin/env bash\ncommand -v jq && command -v tree',
      uninstall: '#!/usr/bin/env bash\napt-get purge -y jq tree less bash-completion'
    }
  },

  // Docker
  {
    id: 'docker',
    name: 'Docker Engine Stack',
    category: 'docker',
    description: 'Docker CE, containerd, docker-compose-plugin with daemon config',
    packages: ['docker-ce', 'containerd.io', 'docker-compose-plugin'],
    status: 'verified',
    hasServices: true,
    serviceName: 'docker',
    scripts: {
      install: '#!/usr/bin/env bash\ncurl -fsSL https://download.docker.com/linux/debian/gpg | gpg --dearmor -o /etc/apt/keyrings/docker.gpg\napt-get update && apt-get install -y docker-ce containerd.io docker-compose-plugin',
      configure: '#!/usr/bin/env bash\nsystemctl enable --now docker.service',
      verify: '#!/usr/bin/env bash\ndocker info >/dev/null 2>&1',
      uninstall: '#!/usr/bin/env bash\nsystemctl stop docker.service || true\napt-get purge -y docker-ce containerd.io'
    }
  },

  // Languages
  {
    id: 'node',
    name: 'Node.js LTS Runtime',
    category: 'languages',
    description: 'Node.js v22.x LTS runtime with npm package manager',
    packages: ['nodejs', 'npm'],
    status: 'verified',
    version: 'v22.13.0',
    scripts: {
      install: '#!/usr/bin/env bash\ncurl -fsSL https://deb.nodesource.com/setup_22.x | bash -\napt-get install -y nodejs',
      configure: '#!/usr/bin/env bash\nnpm config set prefix /usr/local',
      verify: '#!/usr/bin/env bash\nnode -v && npm -v',
      uninstall: '#!/usr/bin/env bash\napt-get purge -y nodejs'
    }
  },
  {
    id: 'go',
    name: 'Go Compiler Toolchain',
    category: 'languages',
    description: 'Go language compiler, stdlib, go module package tools',
    packages: ['golang-go'],
    status: 'verified',
    version: '1.22.5',
    scripts: {
      install: '#!/usr/bin/env bash\napt-get install -y golang-go',
      configure: '#!/usr/bin/env bash\nexport GOPATH=$HOME/go\nexport PATH=$PATH:/usr/local/go/bin',
      verify: '#!/usr/bin/env bash\ngo version',
      uninstall: '#!/usr/bin/env bash\napt-get purge -y golang-go'
    }
  },
  {
    id: 'php',
    name: 'PHP 8.3 CLI & Modules',
    category: 'languages',
    description: 'PHP 8.3 CLI engine with common extensions (mbstring, xml, curl)',
    packages: ['php8.3-cli', 'php8.3-xml', 'php8.3-curl'],
    status: 'configured',
    version: '8.3.9',
    scripts: {
      install: '#!/usr/bin/env bash\napt-get install -y php8.3-cli php8.3-xml php8.3-curl php8.3-mbstring',
      configure: '#!/usr/bin/env bash\nphp -r "copy(\'https://getcomposer.org/installer\', \'composer-setup.php\');"',
      verify: '#!/usr/bin/env bash\nphp -v',
      uninstall: '#!/usr/bin/env bash\napt-get purge -y php8.3*'
    }
  },
  {
    id: 'rust',
    name: 'Rust Compiler & Cargo',
    category: 'languages',
    description: 'Rustc compiler and Cargo package manager toolchain',
    packages: ['rustc', 'cargo'],
    status: 'verified',
    version: '1.80.0',
    scripts: {
      install: '#!/usr/bin/env bash\napt-get install -y rustc cargo',
      configure: '#!/usr/bin/env bash\ncargo --version',
      verify: '#!/usr/bin/env bash\nrustc --version && cargo --version',
      uninstall: '#!/usr/bin/env bash\napt-get purge -y rustc cargo'
    }
  },

  // Databases (clients)
  {
    id: 'databases-clients',
    name: 'Database Client Tools',
    category: 'databases',
    description: 'MariaDB client, Redis tools, SQLite3 CLI interface',
    packages: ['mariadb-client', 'redis-tools', 'sqlite3'],
    status: 'verified',
    scripts: {
      install: '#!/usr/bin/env bash\napt-get install -y mariadb-client redis-tools sqlite3',
      configure: '#!/usr/bin/env bash\necho "Clients configured."',
      verify: '#!/usr/bin/env bash\ncommand -v mariadb && command -v redis-cli && command -v sqlite3',
      uninstall: '#!/usr/bin/env bash\napt-get purge -y mariadb-client redis-tools sqlite3'
    }
  },

  // Database Engines
  {
    id: 'postgresql',
    name: 'PostgreSQL Server 16',
    category: 'databases-engines',
    description: 'PostgreSQL 16 relational database server and client libraries',
    packages: ['postgresql-16', 'postgresql-client-16'],
    status: 'verified',
    hasServices: true,
    serviceName: 'postgresql',
    scripts: {
      install: '#!/usr/bin/env bash\napt-get install -y postgresql-16 postgresql-client-16',
      configure: '#!/usr/bin/env bash\nsystemctl enable --now postgresql.service',
      verify: '#!/usr/bin/env bash\nsystemctl is-active postgresql.service',
      uninstall: '#!/usr/bin/env bash\nsystemctl stop postgresql.service || true\napt-get purge -y postgresql-16'
    }
  },
  {
    id: 'mariadb',
    name: 'MariaDB Server 10.11',
    category: 'databases-engines',
    description: 'MariaDB relational database engine with automated secure installation',
    packages: ['mariadb-server'],
    status: 'verified',
    hasServices: true,
    serviceName: 'mariadb',
    scripts: {
      install: '#!/usr/bin/env bash\napt-get install -y mariadb-server',
      configure: '#!/usr/bin/env bash\nsystemctl enable --now mariadb.service',
      verify: '#!/usr/bin/env bash\nsystemctl is-active mariadb.service',
      uninstall: '#!/usr/bin/env bash\nsystemctl stop mariadb.service || true\napt-get purge -y mariadb-server'
    }
  },
  {
    id: 'dragonfly',
    name: 'DragonflyDB Cache',
    category: 'databases-engines',
    description: 'High performance in-memory Redis-compatible key-value cache engine',
    packages: ['dragonfly'],
    status: 'verified',
    hasServices: true,
    serviceName: 'dragonfly',
    scripts: {
      install: '#!/usr/bin/env bash\napt-get install -y dragonfly',
      configure: '#!/usr/bin/env bash\nsystemctl enable --now dragonfly.service',
      verify: '#!/usr/bin/env bash\nsystemctl is-active dragonfly.service',
      uninstall: '#!/usr/bin/env bash\nsystemctl stop dragonfly.service || true\napt-get purge -y dragonfly'
    }
  },
  {
    id: 'redpanda',
    name: 'Redpanda Streaming Engine',
    category: 'databases-engines',
    description: 'Kafka-compatible high throughput event streaming store without JVM dependencies',
    packages: ['redpanda'],
    status: 'configured',
    hasServices: true,
    serviceName: 'redpanda',
    scripts: {
      install: '#!/usr/bin/env bash\ncurl -1sLf https://dl.redpanda.com/nz/redpanda/cfg/setup/bash.deb.sh | bash\napt-get install -y redpanda',
      configure: '#!/usr/bin/env bash\nrpk redpanda config init',
      verify: '#!/usr/bin/env bash\nrpk cluster status || true',
      uninstall: '#!/usr/bin/env bash\napt-get purge -y redpanda'
    }
  },
  {
    id: 'scylladb',
    name: 'ScyllaDB NoSQL Engine',
    category: 'databases-engines',
    description: 'Ultra-low latency Cassandra-compatible NoSQL database (requires AVX2 support)',
    packages: ['scylla-server'],
    status: 'configured',
    hasServices: true,
    serviceName: 'scylla-server',
    scripts: {
      install: '#!/usr/bin/env bash\napt-get install -y scylla-server',
      configure: '#!/usr/bin/env bash\nscylla_setup --auto',
      verify: '#!/usr/bin/env bash\nnodetool status || true',
      uninstall: '#!/usr/bin/env bash\napt-get purge -y scylla-server'
    }
  },
  {
    id: 'vespa',
    name: 'Vespa Vector Search Engine',
    category: 'databases-engines',
    description: 'AI-native vector search, retrieval, and real-time processing engine',
    packages: ['vespa-container'],
    status: 'configured',
    hasServices: true,
    serviceName: 'vespa',
    scripts: {
      install: '#!/usr/bin/env bash\ndocker pull vespaengine/vespa',
      configure: '#!/usr/bin/env bash\ndocker run -d --name vespa --hostname vespa-container -p 8080:8080 vespaengine/vespa',
      verify: '#!/usr/bin/env bash\ncurl -s http://localhost:8080/ApplicationStatus || true',
      uninstall: '#!/usr/bin/env bash\ndocker rm -f vespa || true'
    }
  },

  // Frameworks
  {
    id: 'laravel',
    name: 'Laravel Framework Tools',
    category: 'frameworks',
    description: 'Composer package manager, Laravel installer CLI tool',
    packages: ['composer', 'php-mbstring'],
    status: 'configured',
    scripts: {
      install: '#!/usr/bin/env bash\napt-get install -y composer php-mbstring php-zip php-gd',
      configure: '#!/usr/bin/env bash\ncomposer global require laravel/installer',
      verify: '#!/usr/bin/env bash\ncomposer --version',
      uninstall: '#!/usr/bin/env bash\napt-get purge -y composer'
    }
  },
  {
    id: 'wordpress',
    name: 'WordPress CLI Stack',
    category: 'frameworks',
    description: 'WP-CLI tool and PHP requirements for automated WordPress setups',
    packages: ['wp-cli'],
    status: 'configured',
    scripts: {
      install: '#!/usr/bin/env bash\ncurl -O https://raw.githubusercontent.com/wp-cli/builds/gh-pages/phar/wp-cli.phar\nchmod +x wp-cli.phar\nmv wp-cli.phar /usr/local/bin/wp',
      configure: '#!/usr/bin/env bash\nwp --info',
      verify: '#!/usr/bin/env bash\nwp --version',
      uninstall: '#!/usr/bin/env bash\nrm -f /usr/local/bin/wp'
    }
  },
  {
    id: 'react-native',
    name: 'React Native & Android CLI',
    category: 'frameworks',
    description: 'OpenJDK 17, android-tools (adb, fastboot) for mobile development',
    packages: ['openjdk-17-jdk', 'android-tools-adb', 'android-tools-fastboot'],
    status: 'configured',
    scripts: {
      install: '#!/usr/bin/env bash\napt-get install -y openjdk-17-jdk android-tools-adb android-tools-fastboot',
      configure: '#!/usr/bin/env bash\nexport JAVA_HOME=/usr/lib/jvm/java-17-openjdk-amd64',
      verify: '#!/usr/bin/env bash\njava -version && adb version',
      uninstall: '#!/usr/bin/env bash\napt-get purge -y openjdk-17-jdk android-tools-adb'
    }
  },

  // Tools
  {
    id: 'devops-tools',
    name: 'DevOps & CLI Tools Suite',
    category: 'tools',
    description: 'GitHub CLI, kubectl, Helm 3, Terraform, htop, btop, ripgrep, fzf, bat, eza, fastfetch',
    packages: ['gh', 'kubectl', 'helm', 'terraform', 'htop', 'btop', 'ripgrep', 'fzf', 'bat', 'eza', 'fastfetch'],
    status: 'verified',
    scripts: {
      install: '#!/usr/bin/env bash\napt-get install -y htop btop ripgrep fzf bat eza fastfetch gh terraform',
      configure: '#!/usr/bin/env bash\nkubectl completion bash > /etc/bash_completion.d/kubectl || true',
      verify: '#!/usr/bin/env bash\ncommand -v gh && command -v terraform && command -v htop',
      uninstall: '#!/usr/bin/env bash\napt-get purge -y htop btop ripgrep fzf bat eza fastfetch'
    }
  },

  // Desktop
  {
    id: 'vscode',
    name: 'Visual Studio Code',
    category: 'desktop',
    description: 'Official Microsoft VS Code editor with GPG apt keyring integration',
    packages: ['code'],
    status: 'configured',
    scripts: {
      install: '#!/usr/bin/env bash\nwget -qO- https://packages.microsoft.com/keys/microsoft.asc | gpg --dearmor > /etc/apt/keyrings/packages.microsoft.gpg\napt-get install -y code',
      configure: '#!/usr/bin/env bash\ncode --version || true',
      verify: '#!/usr/bin/env bash\ncommand -v code',
      uninstall: '#!/usr/bin/env bash\napt-get purge -y code'
    }
  },
  {
    id: 'fonts',
    name: 'Developer Fonts',
    category: 'desktop',
    description: 'Fira Code and Hack Nerd Fonts typography suites',
    packages: ['fonts-firacode', 'fonts-hack-ttf'],
    status: 'verified',
    scripts: {
      install: '#!/usr/bin/env bash\napt-get install -y fonts-firacode fonts-hack-ttf',
      configure: '#!/usr/bin/env bash\nfc-cache -f -v',
      verify: '#!/usr/bin/env bash\nfc-list | grep -i "Fira Code"',
      uninstall: '#!/usr/bin/env bash\napt-get purge -y fonts-firacode fonts-hack-ttf'
    }
  },
  {
    id: 'desktop-tools',
    name: 'Desktop Dev Tools',
    category: 'desktop',
    description: 'GUI utilities and screenshot / inspection helpers',
    packages: ['flameshot', 'gparted', 'synaptic'],
    status: 'configured',
    scripts: {
      install: '#!/usr/bin/env bash\napt-get install -y flameshot gparted synaptic',
      configure: '#!/usr/bin/env bash\necho "Desktop utilities ready."',
      verify: '#!/usr/bin/env bash\ncommand -v flameshot',
      uninstall: '#!/usr/bin/env bash\napt-get purge -y flameshot gparted synaptic'
    }
  },

  // Office
  {
    id: 'office-suite',
    name: 'Office Productivity Suite',
    category: 'office',
    description: 'LibreOffice suite and Evince document viewer',
    packages: ['libreoffice-writer', 'libreoffice-calc', 'evince'],
    status: 'configured',
    scripts: {
      install: '#!/usr/bin/env bash\napt-get install -y libreoffice-writer libreoffice-calc evince',
      configure: '#!/usr/bin/env bash\necho "LibreOffice ready."',
      verify: '#!/usr/bin/env bash\ncommand -v libreoffice',
      uninstall: '#!/usr/bin/env bash\napt-get purge -y libreoffice*'
    }
  },

  // Server Security & Monitoring
  {
    id: 'security-monitoring',
    name: 'Host Security & Metrics',
    category: 'server',
    description: 'Uncomplicated Firewall (UFW), Fail2ban daemon, Prometheus Node Exporter',
    packages: ['ufw', 'fail2ban', 'prometheus-node-exporter'],
    status: 'verified',
    hasServices: true,
    serviceName: 'fail2ban',
    scripts: {
      install: '#!/usr/bin/env bash\napt-get install -y ufw fail2ban prometheus-node-exporter',
      configure: '#!/usr/bin/env bash\nufw default deny incoming\nufw default allow outgoing\nufw allow 22/tcp\nsystemctl enable --now fail2ban',
      verify: '#!/usr/bin/env bash\nufw status && systemctl is-active fail2ban',
      uninstall: '#!/usr/bin/env bash\nufw disable\napt-get purge -y ufw fail2ban'
    }
  }
];

export const INITIAL_DIAGNOSTICS: DiagnosticCheck[] = [
  { id: 'os-version', title: 'Operating System Compatibility', category: 'System', status: 'pass', message: 'Debian GNU/Linux 13 (Trixie) detected - x86_64 architecture confirmed.' },
  { id: 'apt-state', title: 'APT Package Manager Health', category: 'Packages', status: 'pass', message: 'No locked dpkg locks found. APT database state is clean.' },
  { id: 'keyrings', title: 'GPG Keyrings Integrity', category: 'Security', status: 'pass', message: 'Modern /etc/apt/keyrings/ directory exists with valid signed-by constraints.' },
  { id: 'systemd', title: 'Systemd & PID 1 Initialization', category: 'Services', status: 'pass', message: 'Systemd init is active. DBus bus service communication verified.' },
  { id: 'cpu-avx2', title: 'CPU Instruction Set (AVX2)', category: 'Hardware', status: 'warn', message: 'AVX2 instructions supported. ScyllaDB and Redpanda SIMD extensions enabled.' },
  { id: 'network-keys', title: 'HTTPS Keyring Fallback Transport', category: 'Network', status: 'pass', message: 'Network connectivity verified over Port 443 (HKP/HTTPS fallback ready).' },
  { id: 'crlf-permissions', title: 'Script Line Endings & Execution Bits', category: 'Filesystem', status: 'pass', message: 'All bash scripts checked: UNIX LF line endings and +x permission flags verified.' },
  { id: 'disk-space', title: 'Available Root Filesystem Storage', category: 'Storage', status: 'pass', message: '34.8 GB free on / partition. Sufficient storage for all 12 DEM modules.' }
];
