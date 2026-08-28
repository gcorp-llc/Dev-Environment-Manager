# راهنمای جامع محیط توسعه محلی و Onboarding توسعه‌دهندگان Cardiani

به پروژه **Cardiani** خوش آمدید! این راهنمای جامع، دستورالعمل‌های گام‌به‌گام، ساختار پوشه‌ها، مشخصات ابزارها و جدول عیب‌یابی را برای راه‌اندازی، اجرا و دیباگ محیط توسعه محلی ارائه می‌دهد.

---

## فهرست مطالب

۱. [ساختار پوشه‌ها و ابزارهای محیط توسعه (Dev Environment Directory Structure)](#۱-ساختار-پوشهها-و-ابزارهای-محیط-توسعه-dev-environment-directory-structure)
   - [نمای درختی پوشه‌ها (Directory Tree)](#نمای-درختی-پوشهها-directory-tree)
   - [شرح وظایف ابزارها و نیازمندی‌های سیستم‌عامل (Tool Responsibilities & Operating System Requirements)](#شرح-وظایف-ابزارها-و-نیازمندیهای-سیستمعامل-tool-responsibilities-operating-system-requirements)
۲. [داکیومنت دقیق فایل‌ها، اسکریپت‌ها و کالکشن‌های Bruno (Scripts & Tooling Breakdown)](#۲-داکیومنت-دقیق-فایلها-اسکریپتها-و-کالکشنهای-bruno-scripts-tooling-breakdown)
   - [اسکریپت‌های اتوماسیون (`scripts/`)](#اسکریپتهای-اتوماسیون-scripts)
   - [تنظیمات Docker Compose (`infra/docker-compose.yml`)](#تنظیمات-docker-compose-infradocker-composeyml)
   - [تست‌های Bruno و کالکشن‌های API (`bruno/`)](#تستهای-bruno-و-کالکشنهای-api-bruno)
   - [وابستگی‌ها و ابزارهای CLI (CLI Dependencies & Developer Tools)](#وابستگیها-و-ابزارهای-cli-cli-dependencies-developer-tools)
۳. [راهنمای گام‌به‌گام راه‌اندازی و عیب‌یابی (Step-by-Step Setup & Troubleshooting Runbooks)](#۳-راهنمای-گامبهگام-راهاندازی-و-عیبیابی-step-by-step-setup-troubleshooting-runbooks)
   - [راهنمای کامل Onboarding برای توسعه‌دهندگان (Developer Onboarding Runbook)](#راهنمای-کامل-onboarding-برای-توسعهدهندگان-developer-onboarding-runbook)
   - [جدول کامل Error Resolution و Troubleshooting (Troubleshooting & Error Resolution Matrix)](#جدول-کامل-error-resolution-و-troubleshooting-troubleshooting-error-resolution-matrix)

---

## ۱. ساختار پوشه‌ها و ابزارهای محیط توسعه (Dev Environment Directory Structure)

### نمای درختی پوشه‌ها (Directory Tree)

چیدمان محیط توسعه محلی پروژه Cardiani شامل اسکریپت‌های اتوماسیون، پیکربندی زیرساخت کانتینری، کالکشن‌های تست API و قالب‌های متغیرهای محیطی به شرح زیر است:

```text
cardiani/
├── .env.example                  # Template for local environment variables
├── Makefile                      # Standardized automation command shortcuts
├── Justfile                      # Modern task runner alternative for local workflows
├── infra/
│   └── docker-compose.yml        # Multi-container local infrastructure stack
├── scripts/
│   ├── setup_db.sh               # Database initialization script
│   ├── seed_db.py                # Python test data seeder
│   ├── proxy_manager.sh          # Proxy setup & network routing manager
│   ├── ip_cache_refresh.py       # IP caching & DNS refresh automation
│   └── local_server_config.sh    # Local environment network & host configuration
├── bruno/
│   ├── bruno.json                # Bruno workspace configuration
│   ├── environments/
│   │   ├── local.bru             # Local environment variables for Bruno
│   │   └── staging.bru           # Staging environment variables for Bruno
│   ├── auth/                     # Authentication & Token API tests
│   ├── feature_flags/            # Feature Flag management & evaluation tests
│   ├── logistics/                # Dispatch, routing, & logistics domain tests
│   └── production_verification/  # E2E health check & sanity assertion suites
└── docs/
    ├── fa/
    │   └── DEV_ENVIRONMENT_GUIDE.md  # Persian Developer Onboarding Guide
    └── en/
        └── DEV_ENVIRONMENT_GUIDE.md  # English Developer Onboarding Guide
```

---

### شرح وظایف ابزارها و نیازمندی‌های سیستم‌عامل (Tool Responsibilities & Operating System Requirements)

#### جدول سازگاری سیستم‌عامل‌های مدنظر (Core Operating System Compatibility Matrix)

| سیستم‌عامل (Operating System) | سطح پشتیبانی (Support Level) | پیش‌نیازها و توضیحات (Prerequisites / Notes) |
|---|---|---|
| **Debian 13 (Trixie)** | **پلتفرم اصلی و نیتیو (Primary / Native Target)** | ابزارهای APT، مدیریت سرویس با systemd، هدف اصلی پلتفرم. |
| **Ubuntu / Linux (22.04+)** | پشتیبانی‌شده (Supported) | Docker Engine، `build-essential`، `pkg-config`، `libssl-dev`. |
| **macOS (Apple Silicon / Intel)** | پشتیبانی از طریق Docker | macOS 13 به بالا، Docker Desktop / OrbStack، Homebrew برای CLI. |
| **Windows 11 (WSL2)** | پشتیبانی از طریق WSL2 | WSL2 همراه با توزیع Ubuntu/Debian و فعال‌سازی WSL2 Integration در Docker Desktop. |

#### شرح وظایف ابزارهای سیستم (System Tooling Responsibilities)

* **Docker & Docker Compose v2**: مدیریت کانتینرهای دیتابیس (ScyllaDB، PostgreSQL، DragonflyDB) و میان‌افزارهای پیام‌رسانی (Redpanda/NATS، Vespa).
* **pnpm**: ابزار مدیریت پکیج‌های جاوااسکریپت با سرعت بالا و بهینه‌سازی حافظه برای فرانت‌اند و میکرو‌سرویس‌های Node.js.
* **Cargo / cargo-watch**: کامپایلر زبان Rust و ابزار کامپایل خودکار در هنگام تغییر کد برای سرویس‌های بک‌اند.
* **Bruno CLI (`@usebruno/cli`)**: ابزار اجرای headless تست‌ها و ارزیابی (Assertion) صحت کارکرد APIهای محلی.
* **cqlsh**: رابط خط فرمان اختصاصی برای اتصال و مدیریت دیتابیس ScyllaDB / Cassandra.
* **nats-cli**: ابزار CLI برای بازرسی و مدیریت استریم‌ها و موضوعات (Topics) در NATS / Redpanda.

---

## ۲. داکیومنت دقیق فایل‌ها، اسکریپت‌ها و کالکشن‌های Bruno (Scripts & Tooling Breakdown)

### اسکریپت‌های اتوماسیون (`scripts/`)

#### ۱. `scripts/setup_db.sh`
* **هدف (Purpose)**: راه‌اندازی اولیه ساختار دیتابیس‌ها، کلیدفضاها (Keyspaces) و جداول در ScyllaDB و PostgreSQL.
* **ورودی‌ها و سوئیچ‌ها (Switches / Inputs)**:
  * `--drop-existing`: حذف اسکیمای موجود قبل از ساخت مجدد.
  * `--env-file <path>`: تعیین مسیر فایل `.env` سفارشی (پیش‌فرض: `.env`).
* **خروجی‌ها (Outputs)**: لاگ‌های ساختاریافته در ترمینال شامل وضعیت اجرا و ساخت اسکیمات.
* **عوارض جانبی (Side Effects)**: ایجاد Keyspaces با نام `cardiani_core` در ScyllaDB و جداول اولیه در PostgreSQL.

#### ۲. `scripts/seed_db.py`
* **هدف (Purpose)**: درج داده‌های تست (Mock Data) از جمله کاربران، نودهای لوجستیک و فیچرفلگ‌ها.
* **ورودی‌ها و سوئیچ‌ها (Switches / Inputs)**:
  * `--records <number>`: تعداد رکورد پردازشی برای هر موجودیت (پیش‌فرض: `100`).
  * `--clean`: پاکسازی رکوردهای قبلی قبل از درج داده‌های جدید.
* **خروجی‌ها (Outputs)**: گزارش خلاصه به فرمت JSON شامل تعداد داده‌های تولیدشده.
* **عوارض جانبی (Side Effects)**: درج مستقیم داده در دیتابیس‌های ScyllaDB و PostgreSQL.

#### ۳. `scripts/proxy_manager.sh`
* **هدف (Purpose)**: تنظیم مسیرهای پرکسی معکوس محلی، دامنه محلی و گواهی‌های SSL برای تست محلی.
* **ورودی‌ها و سوئیچ‌ها (Switches / Inputs)**:
  * `enable`: فعال‌سازی مسیرهای پرکسی محلی.
  * `disable`: غیرفعال‌سازی و بازگرداندن تنظیمات شبکه سیستم.
  * `--domain <name>`: اتصال دامنه محلی سفارشی (پیش‌فرض: `cardiani.local`).
* **خروجی‌ها (Outputs)**: لاگ‌های وضعیت و بروزرسانی ورودی‌های فایل `/etc/hosts`.
* **عوارض جانبی (Side Effects)**: تغییر دسترسی‌های شبکه و تنظیمات Host سیستم (نیازمند دسترسی `sudo`).

#### ۴. `scripts/ip_cache_refresh.py`
* **هدف (Purpose)**: دریافت، پارس و بروزرسانی جداول کش IP و موقعیت جغرافیایی در DragonflyDB/Redis.
* **ورودی‌ها و سوئیچ‌ها (Switches / Inputs)**:
  * `--flush`: پاکسازی کش‌های قبلی IP قبل از بروزرسانی.
  * `--source <url>`: آدرس دریافت فید IPهای جدید.
* **خروجی‌ها (Outputs)**: شمارنده کلیدهای کش‌شده وآمارهای کارایی.
* **عوارض جانبی (Side Effects)**: بروزرسانی کلیدها در حافظه DragonflyDB.

#### ۵. `scripts/local_server_config.sh`
* **هدف (Purpose)**: ارزیابی پورت‌های باز سیستم، متغیرهای محیطی و دسترسی‌های لازم قبل از اجرای سرویس‌ها.
* **ورودی‌ها و سوئیچ‌ها (Switches / Inputs)**:
  * `--check-only`: اجرای عیب‌یابی بدون اعمال تغییرات.
  * `--fix`: حل خودکار تداخل پورت‌ها از طریق بستن پروسه‌های معلق.
* **خروجی‌ها (Outputs)**: چک‌لیست عیب‌یابی در ترمینال.
* **عوارض جانبی (Side Effects)**: بستن پروسه‌های مشغول‌کننده پورت در صورت ارسال سوئیچ `--fix`.

---

### تنظیمات Docker Compose (`infra/docker-compose.yml`)

زیرساخت محلی پروژه از طریق Docker Compose برای سرویس‌های ذخیره‌سازی و پیام‌رسانی پیکربندی شده است:

```yaml
version: '3.8'

services:
  scylladb:
    image: scylladb/scylla:5.4
    container_name: cardiani-scylladb
    ports:
      - "9042:9042"
    volumes:
      - scylla-data:/var/lib/scylla
    environment:
      - SMP=1
    healthcheck:
      test: ["CMD-SHELL", "cqlsh -e 'SHOW HOST' || exit 1"]
      interval: 10s
      timeout: 5s
      retries: 5

  postgres:
    image: postgres:16-alpine
    container_name: cardiani-postgres
    ports:
      - "5432:5432"
    environment:
      POSTGRES_DB: cardiani_dev
      POSTGRES_USER: cardiani
      POSTGRES_PASSWORD: dev_password_123
    volumes:
      - postgres-data:/var/lib/postgresql/data

  dragonfly:
    image: docker.dragonflydb.io/dragonflydb/dragonfly:v1.14.0
    container_name: cardiani-dragonfly
    ports:
      - "6379:6379"
    ulimits:
      memlock: -1

  redpanda:
    image: docker.redpanda.com/redpandadata/redpanda:v23.3.3
    container_name: cardiani-redpanda
    ports:
      - "9092:9092"
      - "19644:19644"
    command:
      - redpanda start
      - --smp 1
      - --memory 1G
      - --reserve-memory 0M
      - --overprovisioned
      - --node-id 0

  vespa:
    image: vespaengine/vespa:8.280.56
    container_name: cardiani-vespa
    ports:
      - "8080:8080"
      - "19071:19071"

volumes:
  scylla-data:
  postgres-data:
```

#### ترتیب اجرای سرویس‌های وابسته (Dependent Services Order)

۱. **سرویس‌های ذخیره‌سازی (Storage)**: سرویس‌های `scylladb` و `postgres` و `dragonfly` به صورت همزمان راه‌اندازی می‌شوند.
۲. **پیام‌رسانی و جستجو (Messaging & Search)**: سرویس‌های `redpanda` و `vespa` پس از آمادگی پورت‌های پایه شروع به کار می‌کنند.
۳. **میکروسرویس‌های برنامه (Application Services)**: پس از پاسخ‌گویی Healthcheck سرویس‌های `scylladb` (پورت `9042`) و `postgres` (پورت `5432`) اجرا می‌گردند.

---

### تست‌های Bruno و کالکشن‌های API (`bruno/`)

ابزار Bruno برای تست APIهای محلی، ارزیابی قراردادها و اجرای تست‌های خودکار استفاده می‌شود.

#### ساختار پوشه‌ها و ماژول‌ها (Collection Structure & Domain Modules)

* `bruno/auth/`:
  * `login.bru`: درخواست POST به `/api/v1/auth/login`. دریافت نام کاربری و رمزعبور، بازگرداندن توکن Bearer.
  * `refresh.bru`: درخواست POST به `/api/v1/auth/refresh`. تمدید توکن دسترسی.
* `bruno/feature_flags/`:
  * `get_flags.bru`: درخواست GET به `/api/v1/flags`. ارزیابی فیچرفلگ‌های فعال.
  * `toggle_flag.bru`: درخواست PUT به `/api/v1/flags/:id`. تغییر وضعیت فیچرفلگ.
* `bruno/logistics/`:
  * `calculate_route.bru`: درخواست POST به `/api/v1/logistics/route`. محاسبه مسیر بهینه توزیع.
  * `track_shipment.bru`: درخواست GET به `/api/v1/logistics/shipments/:id`. استعلام وضعیت مرسوله.
* `bruno/production_verification/`:
  * `health_check.bru`: درخواست GET به `/health`. سنجش سلامت کلی سیستم (`200 OK`).
  * `readiness.bru`: درخواست GET به `/ready`. بررسی اتصال دیتابیس‌ها و سرویس‌های پیام‌رسانی.

#### نمونه اسکریپت تست و Assertion (`.bru` file structure)

```hcl
meta {
  name: Auth - Login
  type: http
  seq: 1
}

post {
  url: {{baseUrl}}/api/v1/auth/login
  body: json
  auth: none
}

headers {
  Content-Type: application/json
  Accept: application/json
}

body:json {
  {
    "username": "dev_admin",
    "password": "{{devPassword}}"
  }
}

tests {
  test("Status code is 200", function() {
    expect(res.getStatus()).to.equal(200);
  });

  test("Token is present in response", function() {
    expect(res.getBody().token).to.be.a('string');
  });
}
```

---

### وابستگی‌ها و ابزارهای CLI (CLI Dependencies & Developer Tools)

۱. **pnpm**
   - نحوه نصب: `npm install -g pnpm` یا `corepack enable pnpm`
   - دستورات اصلی: `pnpm install`, `pnpm run dev`, `pnpm run build`
۲. **cargo-watch**
   - نحوه نصب: `cargo install cargo-watch`
   - دستورات اصلی: `cargo watch -x run -w src` (کامپایل مجدد و خودکار کد Rust با تغییر فایل‌ها)
۳. **Bruno CLI**
   - نحوه نصب: `npm install -g @usebruno/cli`
   - دستورات اصلی: `bru run bruno/ --env local` (اجرای تست‌های API به صورت Headless)
۴. **cqlsh**
   - نحوه نصب: نصب همراه با کانتینر `scylladb` یا `pip install cqlsh`
   - دستورات اصلی: `docker exec -it cardiani-scylladb cqlsh`
۵. **nats-cli**
   - نحوه نصب: `go install github.com/nats-io/natscli/nats@latest` یا پکیج APT
   - دستورات اصلی: `nats sub "cardiani.>"`
۶. **Git Submodules**
   - دستورات اصلی: `git submodule update --init --recursive` (همگام‌سازی کدهای اشتراکی و زیرماژول‌ها)

---

## ۳. راهنمای گام‌به‌گام راه‌اندازی و عیب‌یابی (Step-by-Step Setup & Troubleshooting Runbooks)

### راهنمای کامل Onboarding برای توسعه‌دهندگان (Developer Onboarding Runbook)

برای راه‌اندازی صفر تا صد محیط توسعه محلی مراحل زیر را به ترتیب دنبال کنید:

#### گام ۱: کلون کردن سورس‌کد و زیرماژول‌ها
```bash
git clone https://github.com/cardiani/cardiani.git
cd cardiani
git submodule update --init --recursive
```

#### گام ۲: تنظیم متغیرهای محیطی
فایل نمونه `.env.example` را کپی کرده و فایل اصلی `.env` را بسازید:
```bash
cp .env.example .env
```
محتوای فایل `.env` را جهت اطمینان از صحت اطلاعات اتصال دیتابیس‌ها و پورت‌ها بررسی کنید.

#### گام ۳: راه‌اندازی کانتینرهای زیرساخت محلی
اجرای تمامی دیتابیس‌ها و سرویس‌های پیام‌رسانی از طریق Docker Compose:
```bash
docker compose -f infra/docker-compose.yml up -d
```
بررسی سلامت کانتینرها:
```bash
docker compose -f infra/docker-compose.yml ps
```

#### گام ۴: راه‌اندازی اولیه دیتابیس و درج داده‌های تست
اجرای اسکریپت ساخت جداول و درج داده‌های اولیه:
```bash
./scripts/setup_db.sh
python3 ./scripts/seed_db.py --records 50
```

#### گام ۵: اجرای کامپوننت‌های فرانت‌اند و بک‌اند
* **میکروسرویس‌های بک‌اند (Rust)**:
  ```bash
  cargo watch -x run
  ```
* **داشبورد فرانت‌اند (Next.js / Node)**:
  ```bash
  cd web
  pnpm install
  pnpm run dev
  ```

#### گام ۶: ارزیابی صحت عملکرد با Bruno CLI
اجرای خودکار مجموعه تست‌های API جهت اطمینان از سلامت محیط محلی:
```bash
bru run bruno/production_verification --env local
```

---

### جدول کامل Error Resolution و Troubleshooting (Troubleshooting & Error Resolution Matrix)

| خطا / نشانه (Issue / Symptom) | علت احتمالی (Possible Cause) | مراحل رفع خطا (Resolution Steps) |
|---|---|---|
| **عدم اتصال ScyllaDB در WSL2** | محدودیت‌های حافظه WSL2 یا عدم انطباق cgroups v2. | ۱. اطمینان از وجود متغیر `SMP=1` در `docker-compose.yml`.<br>۲. افزودن `memory=4GB` به فایل `~/.wslconfig`.<br>۳. ری‌استارت WSL با `wsl --shutdown` در پاوئرشل. |
| **اشغال بودن پورت (`bind: address already in use`)** | پورت‌های 9042، 5432، 6379 یا 8080 توسط پروسه دیگری اشغال شده‌اند. | ۱. اجرای دستور `./scripts/local_server_config.sh --fix`.<br>۲. شناسایی پروسه: `lsof -i :<port>` یا `netstat -tulpn \| grep <port>`.<br>۳. بستن پروسه: `kill -9 <PID>`. |
| **خطای pnpm / عدم تطابق lockfile** | خرابی پوشه `node_modules` یا عدم انطباق pnpm-lock. | ۱. پاکسازی پوشه: `rm -rf web/node_modules web/pnpm-lock.yaml`.<br>۲. اجرای `pnpm store prune`.<br>۳. نصب مجدد: `pnpm install --no-frozen-lockfile`. |
| **قفل شدن کامپایل cargo watch / اتمام فضا** | قفل شدن پوشه `target/` یا پر شدن کش کامپایل. | ۱. پاکسازی فایل‌های کامپایل: `cargo clean`.<br>۲. بررسی فضای دیسک: `df -h`.<br>۳. اجرای مجدد: `cargo watch -x check`. |
| **انقضای توکن JWT در تست‌های Bruno** | منقضی شدن توکن محلی ثبت‌شده در `local.bru`. | ۱. اجرای فایل `bruno/auth/login.bru` برای دریافت توکن جدید.<br>۲. اطمینان از بروزرسانی خودکار متغیر `{{accessToken}}` در محیط local. |
| **تایم‌اوت اتصال Redpanda / NATS** | تغییر IP کانتینر Redpanda در شبکه Docker. | ۱. ری‌استارت کانتینر: `docker compose -f infra/docker-compose.yml restart redpanda`.<br>۲. تست دسترسی پورت `9092`: `nc -zv 127.0.0.1 9092`. |

---
