# AI Tools Platform

Платформа за управление, споделяне и оценяване на AI инструменти. Full-stack приложение с Next.js frontend, Laravel backend и Docker среда.

---

## Съдържание

- [Технологичен стек](#технологичен-стек)
- [Инсталация](#инсталация)
- [Стартиране с Docker](#стартиране-с-docker)
- [Как се добавят тулове](#как-се-добавят-тулове)
- [Ролева система и права](#ролева-система-и-права)
- [AI агенти](#ai-агенти)
- [Промтове за AI агент за разработка](#промтове-за-ai-агент-за-разработка)
- [API документация](#api-документация)
- [Структура на проекта](#структура-на-проекта)
- [Отстраняване на проблеми](#отстраняване-на-проблеми)

---

## Технологичен стек

| Слой | Технология | Версия |
|------|-----------|--------|
| Frontend | Next.js (App Router) + React + TypeScript | 15.x / 19.x |
| Стилизация | Tailwind CSS | 3.4.x |
| Backend | Laravel + PHP | 12.x / 8.2 |
| База данни | SQLite (development) / MySQL 8.0 (production) | - |
| Кеш | Redis | 7.x |
| Автентификация | Laravel Sanctum (token-based) | - |
| 2FA | Google Authenticator + Email код | - |
| Контейнеризация | Docker + Docker Compose | - |

---

## Инсталация

### Предварителни изисквания

- **Docker Desktop** - инсталиран и стартиран
- **Git** - за клониране на репозиторито

### Стъпки

1. **Клониране на проекта:**
   ```bash
   git clone <repository-url>
   cd full-stack-starter-kit
   ```

2. **Копиране на конфигурационни файлове:**
   ```bash
   # Backend
   cp backend/.env.example backend/.env

   # Frontend (автоматично се създава от Docker)
   ```

3. **Стартиране:**
   ```bash
   docker compose up
   ```

   При първо стартиране Docker автоматично:
   - Инсталира PHP разширения (zip, pdo, pdo_sqlite, redis)
   - Инсталира Composer и npm зависимости
   - Създава SQLite база данни
   - Изпълнява миграции и seeders
   - Генерира Laravel APP_KEY

4. **Достъп:**
   - **Frontend:** http://localhost:3000
   - **Backend API:** http://localhost:8001
   - **API Status:** http://localhost:8001/api/status

### Данни за вход (след seed)

| Поле | Стойност |
|------|---------|
| Email | `owner@example.com` |
| Password | `password` |
| Роля | Owner (пълен достъп) |

Или се регистрирайте с нов акаунт.

---

## Стартиране с Docker

### Основни команди

```bash
# Стартиране на всички контейнери
docker compose up

# Стартиране на заден план (detached)
docker compose up -d

# Спиране на контейнерите
docker compose down

# Рестартиране
docker compose restart

# Преглед на логове
docker compose logs -f
docker compose logs frontend    # само frontend
docker compose logs backend     # само backend
```

### Контейнери

| Контейнер | Образ | Порт | Описание |
|-----------|-------|------|----------|
| `fullstack-backend` | php:8.2-cli | 8001 | Laravel API сървър |
| `fullstack-frontend` | node:20-alpine | 3000 | Next.js dev сървър |
| `fullstack-redis` | redis:7-alpine | 6379 | Кеш сървър |

### Laravel команди в Docker

```bash
# Миграции
docker compose exec backend php artisan migrate

# Seeders
docker compose exec backend php artisan db:seed

# Нулиране на базата данни + seed
docker compose exec backend php artisan migrate:fresh --seed

# Изчистване на кеш
docker compose exec backend php artisan cache:clear
docker compose exec backend php artisan config:clear

# Списък с routes
docker compose exec backend php artisan route:list

# Composer
docker compose exec backend composer install
docker compose exec backend composer require package-name
```

### Frontend команди в Docker

```bash
# NPM пакети
docker compose exec frontend npm install
docker compose exec frontend npm install package-name

# Build за продукция
docker compose exec frontend npm run build
```

### Redis CLI

```bash
docker compose exec redis redis-cli
```

### Пълно нулиране (изтрива всички данни)

```bash
docker compose down -v
docker compose up --build
```

---

## Как се добавят тулове

### Чрез Frontend UI

1. Влезте в системата (Login)
2. Навигирайте до **Инструменти** > **Добави нов**
3. Попълнете формата:
   - **Име** (задължително) - напр. "ChatGPT"
   - **Описание** (задължително) - кратко описание на инструмента
   - **URL** - линк към инструмента
   - **Документация URL** - линк към официалната документация
   - **Logo URL** - линк към логото
   - **Категория** (задължително) - изберете от списъка
   - **Роли** - за кои роли е подходящ инструментът
   - **Тагове** - маркирайте подходящите тагове (Free, Paid и др.)
   - **Как се използва** - инструкции стъпка по стъпка
   - **Примери** - реални примери за използване
4. Натиснете **Добави инструмент**

### Чрез API

```bash
# Първо влезте и вземете токен
TOKEN=$(curl -s -X POST http://localhost:8001/api/login \
  -H "Content-Type: application/json" \
  -d '{"email":"owner@example.com","password":"password"}' \
  | jq -r '.token')

# Създайте нов инструмент
curl -X POST http://localhost:8001/api/tools \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Claude",
    "description": "AI асистент от Anthropic за кодиране, анализ и творческо писане",
    "url": "https://claude.ai",
    "documentation_url": "https://docs.anthropic.com",
    "how_to_use": "Отворете claude.ai, влезте в акаунта си и започнете чат",
    "examples": "Генериране на код, ревю на код, обяснение на концепции",
    "category_id": 1,
    "tag_ids": [1, 2],
    "suitable_for_roles": [1, 2, 3]
  }'
```

### Права за управление на тулове

| Действие | Кой може |
|---------|---------|
| Преглед (списък/детайли) | Всички (без автентификация) |
| Създаване | Всеки автентикиран потребител |
| Редактиране | Създателят на тула ИЛИ Owner |
| Изтриване | Създателят на тула ИЛИ Owner |

---

## Ролева система и права

### Роли в системата

| Роля | Вътрешно име | Описание |
|------|-------------|----------|
| Owner | `owner` | Собственик - пълни административни права |
| Backend Developer | `backend` | Backend разработчик |
| Frontend Developer | `frontend` | Frontend разработчик |
| QA Engineer | `qa` | Тестване и качество |
| Designer | `designer` | Дизайн и UX |
| Project Manager | `pm` | Управление на проекти |

### Матрица на правата

| Функционалност | Owner | Backend/Frontend/QA/Designer/PM |
|---------------|-------|-------------------------------|
| Преглед на тулове | Yes | Yes |
| Създаване на тулове | Yes | Yes |
| Редакция на свои тулове | Yes | Yes |
| Редакция на чужди тулове | Yes | No |
| Изтриване на свои тулове | Yes | Yes |
| Изтриване на чужди тулове | Yes | No |
| Добавяне на препоръки/рейтинг | Yes | Yes |
| Админ панел | Yes | No |
| Управление на потребители | Yes | No |
| Одобряване/отхвърляне на тулове | Yes | No |
| Одит логове | Yes | No |

### Как работи автентификацията

1. **Регистрация:** Потребителят се регистрира с email, парола и избрана роля
2. **Вход:** При вход системата връща Bearer token (Laravel Sanctum)
3. **Двуфакторна автентификация (2FA):** По избор чрез:
   - **Email** - получавате 6-цифрен код на имейла
   - **Google Authenticator** - сканирате QR код и въвеждате TOTP код
4. **Token:** Съхранява се в `localStorage` и се изпраща автоматично с всяка заявка
5. **Изход:** Токенът се инвалидира от сървъра

---

## AI агенти

### Какво представлява платформата

AI Tools Platform е **директория и каталог** за AI инструменти. Тя позволява на екипи да:

- **Каталогизират** AI инструментите, които използват
- **Споделят** опит и знания за тези инструменти
- **Оценяват** инструментите с рейтинг и коментари
- **Организират** инструментите по категории, тагове и подходящи роли
- **Проследяват** популярността чрез брой прегледи

### Как AI агентите се вписват

AI агентите (като Claude, ChatGPT, GitHub Copilot) са **вид AI инструменти**, които могат да бъдат каталогизирани в платформата. За всеки агент можете да документирате:

- **Описание** - какво прави агентът
- **URL** - линк за достъп
- **Документация** - линк към официалната документация
- **Как се използва** - стъпки за интегриране и използване
- **Примери** - реални use-case сценарии
- **Подходящ за роли** - кои членове на екипа биха го използвали
- **Тагове** - Free/Paid, API/Web, и др.
- **Препоръки** - рейтинг и отзиви от колегите

### Примерни AI агенти за каталогизиране

| Агент | Категория | Подходящ за |
|-------|----------|------------|
| Claude (Anthropic) | Code Assistants | Backend, Frontend, QA |
| ChatGPT (OpenAI) | Code Assistants | Всички роли |
| GitHub Copilot | Code Assistants | Backend, Frontend |
| Midjourney | Design Tools | Designer |
| Cursor | IDE Tools | Backend, Frontend |
| v0 by Vercel | UI Generation | Frontend, Designer |

---

## Промтове за AI агент за разработка

Тези промтове са предназначени за стартиране на AI агент (напр. Claude, ChatGPT, Cursor), който да помага при разработката на този проект.

### Начален промт за запознаване с проекта

```
Ти си AI асистент за разработка на "AI Tools Platform" - full-stack приложение
за управление на AI инструменти.

Технологичен стек:
- Frontend: Next.js 15 (App Router) + React 19 + TypeScript + Tailwind CSS
- Backend: Laravel 12 + PHP 8.2 + SQLite + Redis
- Auth: Laravel Sanctum + 2FA (Email + Google Authenticator)
- Infrastructure: Docker Compose

Проектът се намира в /home/user/full-stack-starter-kit:
- frontend/ - Next.js приложение
- backend/ - Laravel приложение
- docker-compose.yml - Docker конфигурация

Backend API: http://localhost:8001/api
Frontend: http://localhost:3000

Основни функционалности:
1. CRUD за AI инструменти с категории, тагове и роли
2. Ролева система (Owner, Backend, Frontend, QA, Designer, PM)
3. Препоръки с рейтинг (1-5) и коментари
4. Админ панел за Owner роля
5. 2FA автентификация
6. Одит логове и login tracking
```

### Промт за добавяне на нова функционалност

```
Проектът "AI Tools Platform" използва:
- Backend API routes: backend/routes/api.php
- Controllers: backend/app/Http/Controllers/Api/
- Models: backend/app/Models/
- Frontend pages: frontend/app/
- Frontend components: frontend/components/
- API client: frontend/lib/api.ts
- Types: frontend/lib/types.ts

За нова функционалност:
1. Създай migration: docker compose exec backend php artisan make:migration
2. Създай model: backend/app/Models/
3. Създай controller: backend/app/Http/Controllers/Api/
4. Добави routes: backend/routes/api.php
5. Добави TypeScript types: frontend/lib/types.ts
6. Създай frontend page: frontend/app/

API клиентът е в frontend/lib/api.ts и автоматично добавя Bearer token.
Всички API endpoints са под /api/ prefix.
```

### Промт за дебъгване

```
Дебъгвам проблем в AI Tools Platform.

Проверки:
1. Backend логове: docker compose logs backend
2. Frontend логове: docker compose logs frontend
3. API тест: curl http://localhost:8001/api/status
4. База данни: docker compose exec backend php artisan migrate:status
5. Routes: docker compose exec backend php artisan route:list
6. Browser конзола: F12 > Console + Network tab

Честит проблеми:
- CORS грешки: Провери backend/config/cors.php
- 401 Unauthenticated: Провери token в localStorage
- 404 Not Found: Провери routes с artisan route:list
- 500 Server Error: Провери backend/storage/logs/laravel.log
```

### Промт за code review

```
Направи code review на AI Tools Platform проект.

Фокус:
1. Сигурност: SQL injection, XSS, CSRF, input validation
2. Производителност: N+1 queries, ненужни API извиквания
3. Качество на кода: дублиране, naming conventions, TypeScript типове
4. Error handling: правилно обработване на грешки
5. UI/UX: responsive design, loading states, error states
6. Тестове: покритие и качество

Backend: Laravel best practices - Form Requests, Resource classes, Policy classes
Frontend: React best practices - custom hooks, error boundaries, memoization
```

---

## API документация

За пълна API документация вижте [API.md](./API.md).

### Бърз преглед на endpoints

#### Публични (без автентификация)

```
GET  /api/status              - Health check
POST /api/login               - Вход
POST /api/register            - Регистрация
GET  /api/tools               - Списък инструменти (с филтри и пагинация)
GET  /api/tools/{id}          - Детайли за инструмент
GET  /api/categories          - Списък категории
GET  /api/tags                - Списък тагове
GET  /api/roles               - Списък роли
```

#### Защитени (изискват Bearer token)

```
GET    /api/me                   - Текущ потребител
POST   /api/logout               - Изход
POST   /api/tools                - Създаване на инструмент
PUT    /api/tools/{id}           - Обновяване на инструмент
DELETE /api/tools/{id}           - Изтриване на инструмент
POST   /api/recommendations      - Добавяне на рейтинг/коментар
PUT    /api/recommendations/{id} - Обновяване на препоръка
DELETE /api/recommendations/{id} - Изтриване на препоръка
```

#### Админ (само Owner роля)

```
GET    /api/admin/stats           - Статистики за Dashboard
GET    /api/admin/tools           - Списък всички инструменти
PUT    /api/admin/tools/{id}/approve - Одобряване
PUT    /api/admin/tools/{id}/reject  - Отхвърляне
DELETE /api/admin/tools/{id}      - Изтриване
GET    /api/admin/users           - Списък потребители
GET    /api/admin/users/{id}      - Детайли за потребител
PUT    /api/admin/users/{id}      - Редактиране на потребител
GET    /api/admin/audit-logs      - Одит логове
```

---

## Структура на проекта

```
full-stack-starter-kit/
├── frontend/                  # Next.js 15 + React 19 + TypeScript
│   ├── app/                   # Pages (App Router)
│   │   ├── admin/             # Админ панел (Owner only)
│   │   ├── dashboard/         # Потребителски dashboard
│   │   ├── login/             # Вход
│   │   ├── register/          # Регистрация
│   │   ├── profile/           # Профил + Сигурност (2FA)
│   │   ├── tools/             # Инструменти (списък, детайли, нов)
│   │   ├── layout.tsx         # Root layout
│   │   └── page.tsx           # Landing page
│   ├── components/            # Reusable компоненти
│   │   ├── layout/            # AppLayout, Navbar, Sidebar
│   │   └── ui/                # Button, Card, Input, Toast, etc.
│   ├── contexts/              # React Context (Auth, Language)
│   ├── lib/                   # Utilities
│   │   ├── api.ts             # API client с auto Bearer token
│   │   ├── types.ts           # TypeScript интерфейси
│   │   └── adminApi.ts        # Admin API функции
│   └── package.json
├── backend/                   # Laravel 12 + PHP 8.2
│   ├── app/
│   │   ├── Http/Controllers/
│   │   │   ├── Api/           # API контролери
│   │   │   │   ├── AuthController.php
│   │   │   │   ├── AiToolController.php
│   │   │   │   ├── CategoryController.php
│   │   │   │   ├── TagController.php
│   │   │   │   ├── RoleController.php
│   │   │   │   ├── ToolRecommendationController.php
│   │   │   │   └── TwoFactorController.php
│   │   │   └── AdminController.php
│   │   └── Models/            # Eloquent модели
│   │       ├── User.php
│   │       ├── AiTool.php
│   │       ├── Category.php
│   │       ├── Tag.php
│   │       ├── Role.php
│   │       ├── ToolRecommendation.php
│   │       ├── UserLoginHistory.php
│   │       └── AuditLog.php
│   ├── database/
│   │   ├── migrations/        # Database миграции
│   │   └── seeders/           # Seed данни
│   ├── routes/api.php         # API routes
│   └── config/                # Laravel конфигурация
├── docker-compose.yml         # Docker Compose
├── README.md                  # Тази документация
├── DOCUMENTATION.md           # Подробна техническа документация
├── API.md                     # API reference
├── SETUP.md                   # Setup guide
└── DOCKER-SETUP.md            # Docker setup guide
```

---

## Отстраняване на проблеми

### Docker контейнерите не стартират

```bash
# Проверете дали Docker Desktop работи
docker ps

# Проверете за заети портове
lsof -i :3000
lsof -i :8001

# Вижте логовете
docker compose logs -f
```

### CORS грешки в браузъра

1. Проверете `backend/config/cors.php` за разрешените origins
2. Проверете `NEXT_PUBLIC_API_URL` в `frontend/.env.local`
3. Рестартирайте backend: `docker compose restart backend`

### Laravel грешки

```bash
# Изчистете кеша
docker compose exec backend php artisan cache:clear
docker compose exec backend php artisan config:clear

# Проверете .env файла
docker compose exec backend cat .env

# Регенерирайте APP_KEY
docker compose exec backend php artisan key:generate

# Проверете миграциите
docker compose exec backend php artisan migrate:status
```

### Frontend не зарежда

```bash
# Проверете логовете
docker compose logs frontend

# Рестартирайте
docker compose restart frontend

# Hard refresh в браузъра: Cmd+Shift+R / Ctrl+Shift+R
```

### API връща 401 Unauthenticated

1. Проверете дали имате валиден token в `localStorage`
2. Логнете се отново за нов token
3. Проверете дали Bearer header се изпраща правилно (Network tab в DevTools)

---

## Лиценз

MIT License

---

**Версия:** 1.0.0
**Последна актуализация:** Януари 2026
