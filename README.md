# 🚀 AI Tools Platform - Full-Stack Starter Kit

Модерна платформа за споделяне и управление на AI инструменти, изградена с Next.js 15, React 19, Laravel 12 и TypeScript.

## 📋 Съдържание

- [Възможности](#-възможности)
- [Технологичен стек](#-технологичен-стек)
- [Бърз старт](#-бърз-старт)
- [Инсталация](#-инсталация)
- [Docker Setup](#-docker-setup)
- [Ролева система](#-ролева-система)
- [Добавяне на инструменти](#-добавяне-на-инструменти)
- [API документация](#-api-документация)
- [Разработка](#-разработка)
- [AI Агенти](#-ai-агенти)
- [Тестване](#-тестване)

---

## ✨ Възможности

### 🔐 Автентикация и сигурност
- **Bearer Token автентикация** (Laravel Sanctum)
- **Двуфакторна автентикация (2FA)**
  - Email верификация с код (валиден 10 минути)
  - Authenticator приложения (TOTP)
  - Recovery codes за възстановяване на достъп
- **История на входовете** (device, browser, IP, platform)
- **Audit logging** за всички админ действия

### 👥 Ролева система и права
- **6 роли** с различни нива на достъп:
  - **Owner** - пълен административен достъп
  - **Backend Developer** - backend инструменти и ресурси
  - **Frontend Developer** - frontend инструменти
  - **QA Engineer** - testing и quality assurance инструменти
  - **Designer** - design и UI/UX инструменти
  - **Project Manager** - project management инструменти
- Персонализирани права за всяка роля
- Role-based middleware за защита на routes

### 🛠️ Управление на AI инструменти
- **CRUD операции** за AI инструменти
- **Категории и тагове** (many-to-many relationship)
- **Статуси**: Active, Pending, Archived
- **Филтриране и търсене** по име, описание, категория, тагове, роли
- **Views tracking** - броене на прегледи
- **Рейтинг система** (1-5 звезди)
- **Коментари и препоръки** от потребители
- Подробна информация: URL, документация, примери, how-to-use

### 📊 Admin панел
- **Dashboard със статистики**
  - Брой инструменти по статус
  - Инструменти по категория
  - Брой потребители
  - Последни инструменти
- **Управление на инструменти**
  - Одобряване/отхвърляне на pending инструменти
  - Филтриране и сортиране
  - Permanent deletion
- **Управление на потребители**
  - Списък на потребители
  - История на входове за всеки потребител
  - Редактиране на профили
- **Audit logs** - преглед на всички системни действия

### 🎨 Frontend възможности
- **Responsive UI** с Tailwind CSS
- **Dark/Light mode** (автоматично запазване на предпочитания)
- **Интернационализация** (i18n готовност)
- **Бързи форми** с валидация
- **Toast notifications** за обратна връзка
- **Skeleton loading states**
- **Оптимизирани изображения**

---

## 🛠️ Технологичен стек

### Frontend
- **Next.js 15.1.4** (App Router)
- **React 19.0.0** (React Server Components)
- **TypeScript 5.7.2**
- **Tailwind CSS 3.4.17**
- **PostCSS 8.4.49**

### Backend
- **Laravel 12** (PHP 8.2+)
- **SQLite** (development) / **MySQL 8.0** (production)
- **Redis 7** (caching & sessions)
- **Laravel Sanctum 4.2** (API authentication)
- **Google2FA 8.0** (Two-factor authentication)

### DevOps
- **Docker & Docker Compose**
- **Nginx** (reverse proxy)
- **Node.js 20 Alpine**
- **PHP 8.2 CLI**

### Портове
- **Frontend**: 3000 (dev) / 8200 (docker)
- **Backend**: 8001 (dev) / 8201 (docker)
- **MySQL**: 8203
- **Redis**: 8204
- **Tools Container**: 8205

---

## 🚀 Бърз старт

### Предпоставки
- Docker и Docker Compose
- Git

### 1. Clone на repository
```bash
git clone <repository-url>
cd full-stack-starter-kit
```

### 2. Стартиране с Docker (препоръчано)
```bash
# Стартиране на всички услуги с автоматична настройка
./start.sh
```

### 3. Достъп до приложението
- **Frontend**: http://localhost:8200
- **Backend API**: http://localhost:8201
- **API Status**: http://localhost:8201/api/status

### 4. Тестови потребители
След seed на базата данни ще имате достъп до:

**Admin (Owner):**
```
Email: admin@example.com
Password: password
```

**Backend Developer:**
```
Email: backend@example.com
Password: password
```

**Frontend Developer:**
```
Email: frontend@example.com
Password: password
```

### 5. Спиране на услугите
```bash
./stop.sh
```

---

## 📦 Инсталация

### Локална инсталация (без Docker)

#### Backend Setup
```bash
cd backend

# Инсталиране на dependencies
composer install

# Копиране на .env файл
cp .env.example .env

# Генериране на application key
php artisan key:generate

# Настройка на базата данни (редактирай .env)
# За SQLite (лесно за разработка):
DB_CONNECTION=sqlite
DB_DATABASE=/absolute/path/to/database.sqlite

# Или за MySQL:
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=ai_tools_platform
DB_USERNAME=root
DB_PASSWORD=your_password

# Създаване на SQLite файл (ако използваш SQLite)
touch database/database.sqlite

# Миграции и seeders
php artisan migrate --seed

# Стартиране на development server
php artisan serve --port=8001
```

#### Frontend Setup
```bash
cd frontend

# Инсталиране на dependencies
npm install

# Копиране на .env файл
cp .env.example .env.local

# Редактиране на .env.local
NEXT_PUBLIC_API_URL=http://localhost:8001

# Стартиране на development server
npm run dev
```

#### Redis Setup (опционално, за caching)
```bash
# Ubuntu/Debian
sudo apt-get install redis-server
sudo service redis-server start

# macOS
brew install redis
brew services start redis

# Конфигуриране в backend/.env
CACHE_STORE=redis
REDIS_HOST=127.0.0.1
REDIS_PASSWORD=null
REDIS_PORT=6379
```

---

## 🐳 Docker Setup

### Архитектура
```
┌─────────────────┐     ┌─────────────────┐
│   Frontend      │────▶│   Nginx Proxy   │
│   (Next.js)     │     │   (Port 8200)   │
│   Port 3000     │     └─────────────────┘
└─────────────────┘              │
                                 ▼
┌─────────────────┐     ┌─────────────────┐
│   Backend       │────▶│   Nginx Proxy   │
│   (Laravel)     │     │   (Port 8201)   │
│   PHP-FPM       │     └─────────────────┘
└─────────────────┘
         │
         ├──────▶ MySQL (Port 8203)
         │
         └──────▶ Redis (Port 8204)
```

### Управление на контейнери

#### Стартиране
```bash
# Стартиране на всички услуги
docker compose up -d

# Стартиране на конкретна услуга
docker compose up -d frontend
docker compose up -d backend

# Стартиране с rebuild
docker compose up -d --build
```

#### Проверка на статус
```bash
# Преглед на работещи контейнери
docker compose ps

# Преглед на логове
docker compose logs -f

# Логове за конкретна услуга
docker compose logs frontend -f
docker compose logs backend -f
docker compose logs php_fpm -f
```

#### Спиране и почистване
```bash
# Спиране на услугите
docker compose stop

# Спиране и премахване на контейнери
docker compose down

# Премахване на контейнери + volumes (ВНИМАНИЕ: изтрива данните!)
docker compose down -v
```

### Работа с контейнери

#### Frontend контейнер
```bash
# Влизане в контейнера
docker compose exec frontend sh

# Инсталиране на packages
docker compose exec frontend npm install package-name

# Рестартиране на dev server
docker compose restart frontend
```

#### Backend контейнер
```bash
# Влизане в PHP контейнера
docker compose exec php_fpm sh

# Laravel Artisan команди
docker compose exec php_fpm php artisan migrate
docker compose exec php_fpm php artisan db:seed
docker compose exec php_fpm php artisan cache:clear
docker compose exec php_fpm php artisan config:clear

# Composer команди
docker compose exec php_fpm composer install
docker compose exec php_fpm composer require package/name
```

#### База данни операции
```bash
# MySQL достъп
./db-manage.sh connect

# Или директно:
docker compose exec mysql mysql -u root -pvibecode-full-stack-starter-kit_mysql_pass vibecode-full-stack-starter-kit_app

# Redis достъп
./db-manage.sh redis

# Backup на базата
./db-manage.sh backup
```

### Troubleshooting

#### Проблем: Портове са заети
```bash
# Проверка кой процес използва порт
sudo lsof -i :8200
sudo lsof -i :8201

# Убиване на процес
sudo kill -9 <PID>
```

#### Проблем: Frontend не може да се свърже с Backend
```bash
# Проверка на .env.local файла
cat frontend/.env.local
# Трябва да е: NEXT_PUBLIC_API_URL=http://localhost:8201

# Рестартиране на контейнерите
docker compose restart frontend backend
```

#### Проблем: Database connection error
```bash
# Проверка дали MySQL работи
docker compose ps mysql

# Проверка на логове
docker compose logs mysql

# Рестартиране на MySQL
docker compose restart mysql

# Нова миграция
docker compose exec php_fpm php artisan migrate:fresh --seed
```

#### Проблем: Permission errors
```bash
# В backend контейнера
docker compose exec php_fpm chmod -R 775 storage bootstrap/cache
docker compose exec php_fpm chown -R www-data:www-data storage bootstrap/cache
```

---

## 👥 Ролева система

### Роли и права

| Роля | Възможности | Достъп до Admin панел |
|------|-------------|----------------------|
| **Owner** | Пълен административен достъп, управление на потребители, одобряване на инструменти | ✅ Пълен достъп |
| **Backend Developer** | Добавяне/редактиране на backend инструменти, преглед на документация | ❌ Само четене |
| **Frontend Developer** | Добавяне/редактиране на frontend инструменти | ❌ Само четене |
| **QA Engineer** | Добавяне на testing инструменти, коментиране и рейтинг | ❌ Само четене |
| **Designer** | Добавяне на design инструменти, качване на визуални материали | ❌ Само четене |
| **Project Manager** | Преглед на всички инструменти, управление на таскове | ❌ Само четене |

### Как работи роловата система?

#### 1. Регистрация с роля
При регистрация потребителят избира роля, която най-добре описва позицията му.

#### 2. Филтриране на инструменти по роля
Всеки инструмент може да бъде маркиран като "подходящ за" определени роли. Потребителите виждат инструменти, релевантни за тяхната роля.

```php
// Backend: Филтриране по роля
$tools = AiTool::forRole($user->role_id)->paginate(12);
```

#### 3. Middleware защита
Административните routes са защитени с middleware:

```php
Route::middleware(['auth:sanctum', 'role:owner'])->group(function () {
    Route::get('/admin/stats', [AdminController::class, 'stats']);
    Route::get('/admin/users', [AdminController::class, 'users']);
});
```

#### 4. Frontend защита
React компонентите проверяват ролята на потребителя:

```typescript
const { user } = useAuth();

if (user?.role?.name === 'owner') {
  // Покажи админ функционалности
}
```

### Добавяне на нова роля

#### 1. Създаване на роля в базата (Seeder или ръчно)
```php
// database/seeders/RoleSeeder.php
Role::create([
    'name' => 'data_scientist',
    'display_name' => 'Data Scientist',
    'description' => 'Работи с данни и ML модели'
]);
```

#### 2. Добавяне в frontend типове
```typescript
// frontend/lib/types.ts
export type RoleName =
  | 'owner'
  | 'backend_developer'
  | 'frontend_developer'
  | 'data_scientist'; // Нова роля
```

#### 3. Рестартиране и seed
```bash
docker compose exec php_fpm php artisan migrate:fresh --seed
```

---

## 🛠️ Добавяне на инструменти

### Процес на добавяне

#### 1. За обикновени потребители

**Стъпка 1: Влизане в системата**
```
Login → Dashboard → "Добави инструмент"
```

**Стъпка 2: Попълване на формата**
- **Име** (задължително): Име на инструмента
- **Описание** (задължително): Кратко описание
- **URL** (опционално): Линк към инструмента
- **Категория** (задължително): Избор от dropdown
- **Тагове** (опционално): Multiple selection
- **Подходящ за роли** (опционално): За кои роли е инструментът
- **Как се използва**: Инструкции за използване
- **Примери**: Примери за употреба
- **Лого URL**: Линк към лого изображение
- **Документация URL**: Линк към официална документация

**Стъпка 3: Подаване за одобрение**
След подаване, инструментът получава статус **"pending"** и чака одобрение от администратор.

#### 2. За администратори (Owner)

Администраторите могат:
- Да добавят инструменти директно като **"active"**
- Да одобряват/отхвърлят pending инструменти
- Да редактират всички инструменти
- Да архивират или изтриват инструменти

### API endpoints за инструменти

#### Добавяне на инструмент
```bash
POST /api/tools
Authorization: Bearer {token}
Content-Type: application/json

{
  "name": "ChatGPT",
  "description": "AI чатбот от OpenAI",
  "url": "https://chat.openai.com",
  "documentation_url": "https://platform.openai.com/docs",
  "category_id": 1,
  "tags": [1, 3, 5],
  "suitable_for_roles": [1, 2, 3],
  "how_to_use": "Отвори сайта, регистрирай се и започни чат",
  "examples": "Пример: Напиши ми код за React компонент",
  "logo_url": "https://example.com/logo.png"
}
```

#### Редактиране на инструмент
```bash
PUT /api/tools/{id}
Authorization: Bearer {token}
Content-Type: application/json

{
  "name": "Updated name",
  "description": "Updated description"
}
```

#### Изтриване на инструмент (само собствени или admin)
```bash
DELETE /api/tools/{id}
Authorization: Bearer {token}
```

### Формат на данните

#### Category структура
```json
{
  "id": 1,
  "name": "Text Generation",
  "slug": "text-generation",
  "description": "AI инструменти за генериране на текст",
  "icon": "✍️",
  "color": "#3B82F6"
}
```

#### Tag структура
```json
{
  "id": 1,
  "name": "NLP",
  "slug": "nlp",
  "color": "#10B981"
}
```

#### AiTool пълна структура
```json
{
  "id": 1,
  "name": "ChatGPT",
  "slug": "chatgpt",
  "description": "Мощен AI чатбот",
  "url": "https://chat.openai.com",
  "documentation_url": "https://platform.openai.com/docs",
  "logo_url": "https://example.com/chatgpt-logo.png",
  "images": ["https://example.com/screenshot1.png"],
  "how_to_use": "Инструкции...",
  "examples": "Примери...",
  "category_id": 1,
  "category": { /* Category object */ },
  "created_by": 5,
  "creator": { /* User object */ },
  "suitable_for_roles": [1, 2, 3],
  "status": "active",
  "views_count": 150,
  "tags": [ /* Tag objects */ ],
  "recommendations": [ /* Recommendation objects */ ],
  "average_rating": 4.5,
  "recommendations_count": 12,
  "created_at": "2025-01-15T10:30:00.000000Z",
  "updated_at": "2025-01-20T14:22:00.000000Z"
}
```

---

## 📖 API документация

### Базов URL
```
Development: http://localhost:8001
Docker: http://localhost:8201
Production: https://your-domain.com/api
```

### Автентикация
Всички защитени endpoints изискват Bearer token в header:
```
Authorization: Bearer {your_token_here}
```

### Public Endpoints

#### Health Check
```http
GET /api/status
```
**Отговор:**
```json
{
  "status": "ok",
  "message": "API is running"
}
```

#### Регистрация
```http
POST /api/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "password_confirmation": "password123",
  "role_id": 2
}
```
**Отговор:**
```json
{
  "user": { /* User object */ },
  "token": "1|abc123..."
}
```

#### Login
```http
POST /api/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "password123"
}
```
**Отговор:**
```json
{
  "user": { /* User object */ },
  "token": "2|xyz789...",
  "requires_2fa": false
}
```

#### Списък с категории
```http
GET /api/categories
```

#### Списък с инструменти (публични)
```http
GET /api/tools?category_id=1&tags=2,3&search=chatgpt&per_page=12&page=1
```

### Protected Endpoints

#### Logout
```http
POST /api/logout
Authorization: Bearer {token}
```

#### Текущ потребител
```http
GET /api/me
Authorization: Bearer {token}
```

#### Добавяне на инструмент
```http
POST /api/tools
Authorization: Bearer {token}
Content-Type: application/json

{ /* Tool data */ }
```

#### Добавяне на рейтинг/коментар
```http
POST /api/recommendations
Authorization: Bearer {token}
Content-Type: application/json

{
  "tool_id": 5,
  "rating": 5,
  "comment": "Страхотен инструмент!"
}
```

### Admin Endpoints (Owner only)

#### Dashboard статистики
```http
GET /api/admin/stats
Authorization: Bearer {token}
```

#### Списък потребители
```http
GET /api/admin/users?page=1&per_page=20
Authorization: Bearer {token}
```

#### Одобряване на инструмент
```http
PUT /api/admin/tools/{id}/approve
Authorization: Bearer {token}
```

**Пълна API документация:** Виж [API.md](API.md)

---

## 💻 Разработка

### Структура на проекта

```
full-stack-starter-kit/
├── frontend/
│   ├── app/                    # Next.js pages (App Router)
│   │   ├── page.tsx           # Home page
│   │   ├── login/             # Login page
│   │   ├── register/          # Register page
│   │   ├── dashboard/         # User dashboard
│   │   ├── tools/             # Tools pages
│   │   │   ├── page.tsx      # Tools list
│   │   │   ├── new/          # Add tool form
│   │   │   └── [id]/         # Tool detail
│   │   ├── profile/           # User profile & security
│   │   └── admin/             # Admin panel
│   ├── components/
│   │   ├── layout/           # Layout components (Navbar, Footer)
│   │   └── ui/               # Reusable UI components
│   ├── contexts/             # React contexts (Auth, Theme, Language)
│   ├── lib/                  # Utilities, API client, types
│   └── public/               # Static files
├── backend/
│   ├── app/
│   │   ├── Http/
│   │   │   ├── Controllers/Api/  # API controllers
│   │   │   └── Middleware/       # Custom middleware
│   │   └── Models/              # Eloquent models
│   ├── database/
│   │   ├── migrations/         # Database migrations
│   │   └── seeders/           # Database seeders
│   ├── routes/
│   │   └── api.php           # API routes
│   └── storage/              # Logs, cache, uploads
├── docker/                   # Docker configurations
├── nginx/                    # Nginx configs
└── docker-compose.yml        # Services orchestration
```

### Frontend разработка

#### Добавяне на нова страница
```typescript
// frontend/app/new-page/page.tsx
export default function NewPage() {
  return (
    <div>
      <h1>New Page</h1>
    </div>
  );
}
```

#### Използване на Auth context
```typescript
'use client';
import { useAuth } from '@/contexts/AuthContext';

export default function MyComponent() {
  const { user, isAuthenticated, login, logout } = useAuth();

  if (!isAuthenticated) {
    return <div>Please login</div>;
  }

  return <div>Hello, {user?.name}</div>;
}
```

#### API извикване
```typescript
import { apiClient } from '@/lib/api';

// GET request
const tools = await apiClient.get('/tools');

// POST request with authentication
const newTool = await apiClient.post('/tools', {
  name: 'My Tool',
  description: 'Description'
});
```

#### Добавяне на нов UI компонент
```typescript
// frontend/components/ui/MyComponent.tsx
interface MyComponentProps {
  title: string;
  children: React.ReactNode;
}

export default function MyComponent({ title, children }: MyComponentProps) {
  return (
    <div className="p-4 bg-white dark:bg-gray-800 rounded-lg">
      <h2 className="text-xl font-bold">{title}</h2>
      {children}
    </div>
  );
}
```

### Backend разработка

#### Създаване на нов Model
```bash
docker compose exec php_fpm php artisan make:model Product -m
```

#### Създаване на Controller
```bash
docker compose exec php_fpm php artisan make:controller Api/ProductController --api
```

#### Добавяне на API route
```php
// backend/routes/api.php
Route::middleware('auth:sanctum')->group(function () {
    Route::apiResource('products', ProductController::class);
});
```

#### Създаване на Migration
```bash
docker compose exec php_fpm php artisan make:migration create_products_table
```

```php
// database/migrations/xxxx_create_products_table.php
public function up()
{
    Schema::create('products', function (Blueprint $table) {
        $table->id();
        $table->string('name');
        $table->text('description');
        $table->decimal('price', 10, 2);
        $table->timestamps();
    });
}
```

#### Създаване на Seeder
```bash
docker compose exec php_fpm php artisan make:seeder ProductSeeder
```

```php
// database/seeders/ProductSeeder.php
public function run()
{
    Product::create([
        'name' => 'Sample Product',
        'description' => 'Description',
        'price' => 99.99
    ]);
}
```

#### Изпълнение на миграции
```bash
# Изпълнение на нови миграции
docker compose exec php_fpm php artisan migrate

# Рестартиране на базата с fresh migrations и seeders
docker compose exec php_fpm php artisan migrate:fresh --seed

# Rollback на последната миграция
docker compose exec php_fpm php artisan migrate:rollback
```

### Общи команди

#### Изчистване на кеш
```bash
# Backend cache
docker compose exec php_fpm php artisan cache:clear
docker compose exec php_fpm php artisan config:clear
docker compose exec php_fpm php artisan route:clear

# Frontend build cache
docker compose exec frontend npm run build
```

#### Логове
```bash
# Всички логове
docker compose logs -f

# Само backend
docker compose logs backend -f

# Само frontend
docker compose logs frontend -f

# Laravel logs
docker compose exec php_fpm tail -f storage/logs/laravel.log
```

#### Database operations
```bash
# MySQL shell
./db-manage.sh connect

# Redis CLI
./db-manage.sh redis

# Backup database
./db-manage.sh backup

# Import backup
./db-manage.sh restore backup.sql
```

---

## 🤖 AI Агенти

Този проект е перфектен за използване с AI агенти за разработка като **Claude Code**, **GitHub Copilot**, **Cursor** и други.

### Препоръчани начални промптове

#### 1. За ново внедряване на функционалност

```
Искам да добавя [функционалност] към AI Tools Platform проекта.

Контекст на проекта:
- Full-stack приложение: Laravel 12 backend + Next.js 15 frontend
- База данни: MySQL/SQLite с Eloquent ORM
- Автентикация: Laravel Sanctum
- API: RESTful с Bearer token auth
- Frontend: React 19 + TypeScript + Tailwind CSS

Моля:
1. Анализирай текущата структура на проекта
2. Предложи архитектура за новата функционалност
3. Създай необходимите migrations, models, controllers
4. Имплементирай API endpoints
5. Създай frontend компоненти и интеграция
6. Добави валидация и error handling
7. Тествай функционалността

Очаквам чист, следващ best practices код.
```

#### 2. За code review и оптимизация

```
Направи comprehensive code review на AI Tools Platform проекта.

Фокусирай се на:
1. **Security issues** (SQL injection, XSS, CSRF, authentication bypass)
2. **Performance bottlenecks** (N+1 queries, missing indexes, inefficient queries)
3. **Code quality** (DRY violations, излишен код, неизползвани импорти)
4. **Best practices** (naming conventions, структура, TypeScript типове)
5. **Frontend** (accessibility, performance, UX issues)
6. **Backend** (Laravel best practices, query optimization, caching)

Предложи конкретни подобрения с примери.
```

#### 3. За debugging на проблем

```
Имам проблем с [опиши проблема] в AI Tools Platform проекта.

Контекст:
- Проблемът се появява когато [опиши стъпки за репродукция]
- Error message: [вкопирай error]
- Файлове, които могат да са засегнати: [изброй файлове]

Моля:
1. Анализирай кода и намери причината
2. Предложи решение
3. Имплементирай fix
4. Тествай, че проблемът е решен
5. Добави коментари за разяснение (ако е сложно)
```

#### 4. За добавяне на нова страница/feature

```
Искам да добавя нова страница [име на страница] в проекта.

Изисквания:
- URL: /[url-path]
- Достъп: [публична / изисква login / само admin]
- Функционалности:
  * [функция 1]
  * [функция 2]
  * [функция 3]

Моля създай:
1. Backend API endpoints (ако е нужно)
2. Next.js page component
3. UI компоненти
4. API интеграция
5. Proper error handling
6. Loading states
7. Responsive design

Използвай съществуващия дизайн pattern от проекта.
```

#### 5. За database schema промени

```
Искам да добавя/променя database schema за [обяснение].

Промени:
- [таблица 1]: [промени]
- [таблица 2]: [промени]
- [нови релации]

Моля:
1. Създай migrations
2. Обнови/създай Eloquent models
3. Добави необходимите relationships
4. Обнови seeders
5. Адаптирай controllers и API responses
6. Обнови TypeScript типове във frontend
7. Тествай промените

Не забравяй rollback функционалност в migrations!
```

#### 6. За frontend компонент

```
Създай React компонент [име на компонент] с TypeScript.

Изисквания:
- Props: [опиши props]
- Функционалност: [опиши какво прави]
- Design: [Tailwind CSS, dark mode support, responsive]
- State management: [local state / context / API calls]

Компонентът трябва:
1. Да следва проектната структура
2. Да е напълно типизиран с TypeScript
3. Да поддържа dark mode
4. Да е responsive
5. Да има proper error states
6. Да е accessibility-friendly

Постави го в правилната директория според предназначението му.
```

#### 7. За API endpoint

```
Създай нов API endpoint в Laravel:

Endpoint: [METHOD] /api/[path]
Authentication: [required / optional / none]
Authorization: [роли, които имат достъп]

Request body:
```json
{
  "field1": "value",
  "field2": 123
}
```

Response:
```json
{
  "data": { ... },
  "message": "Success"
}
```

Моля:
1. Създай/обнови Controller
2. Добави route в routes/api.php
3. Имплементирай валидация с Form Request (ако е сложна)
4. Добави proper error handling
5. Обнови API.md документация
6. Обнови TypeScript типове във frontend
```

### AI Agent Best Practices

#### ✅ DO:
- Винаги анализирай съществуващия код преди промени
- Следвай проектните conventions (naming, structure, patterns)
- Добавяй TypeScript типове за всички нови структури
- Използвай съществуващите UI компоненти (Button, Card, Input и т.н.)
- Тествай промените преди commit
- Обновявай документацията при значими промени

#### ❌ DON'T:
- Не променяй core структурата без разговор
- Не добавяй dependencies без причина
- Не пренебрегвай security (винаги валидирай input, използвай auth)
- Не хардкодвай credentials или sensitive data
- Не забравяй за error handling
- Не игнорирай TypeScript errors

### Интеграция с Claude Code

Този проект е оптимизиран за работа с Claude Code CLI. За максимална ефективност:

```bash
# Стартирай Claude Code в проектната директория
cd full-stack-starter-kit
claude-code

# Примерна сесия
> Анализирай структурата на проекта и предложи подобрения

> Добави функционалност за favourite tools (like/unlike)

> Направи код review на AiToolController и оптимизирай queries

> Създай компонент за tool comparison (compare 2-3 tools side by side)
```

**Препоръки:**
- Използвай конкретни, ясни промптове
- Споменавай релевантни файлове и пътища
- Давай контекст за технологичния стек
- Искай обяснения за сложни решения

---

## 🧪 Тестване

### Backend тестове

```bash
# Изпълнение на всички тестове
docker compose exec php_fpm php artisan test

# Конкретен тест
docker compose exec php_fpm php artisan test --filter=AuthTest

# С coverage
docker compose exec php_fpm php artisan test --coverage
```

### Frontend тестове

```bash
# Unit тестове (ако са настроени)
docker compose exec frontend npm test

# E2E тестове (ако са настроени)
docker compose exec frontend npm run test:e2e
```

### Ръчно тестване

#### 1. Проверка на API endpoints
```bash
# Health check
curl http://localhost:8201/api/status

# Login
curl -X POST http://localhost:8201/api/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@example.com","password":"password"}'

# Get tools (с token)
curl http://localhost:8201/api/tools \
  -H "Authorization: Bearer YOUR_TOKEN"
```

#### 2. Frontend checks
- ✅ Регистрация работи
- ✅ Login работи
- ✅ 2FA работи (ако е активирано)
- ✅ Добавяне на tool работи
- ✅ Филтриране на tools работи
- ✅ Admin panel достъпен само за Owner
- ✅ Dark mode toggle работи
- ✅ Responsive design на мобилни устройства

---

## 📝 Полезни ресурси

### Документация
- [DOCUMENTATION.md](DOCUMENTATION.md) - Пълна документация на български
- [API.md](API.md) - Детайлна API референция
- [SETUP.md](SETUP.md) - Setup ръководство
- [DOCKER-SETUP.md](DOCKER-SETUP.md) - Docker специфична информация

### Външни ресурси
- [Laravel Documentation](https://laravel.com/docs)
- [Next.js Documentation](https://nextjs.org/docs)
- [React Documentation](https://react.dev)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [TypeScript Documentation](https://www.typescriptlang.org/docs)

---

## 🤝 Contributing

1. Fork проекта
2. Създай feature branch (`git checkout -b feature/amazing-feature`)
3. Commit промените (`git commit -m 'Add amazing feature'`)
4. Push към branch (`git push origin feature/amazing-feature`)
5. Отвори Pull Request

---

## 📄 License

Този проект е създаден за образователни цели.

---

## 🎯 Готов за представяне!

Приложението е напълно функционално и готово за използване. Включва:

✅ **Работеща автентикация** с 2FA
✅ **Ролева система** с 6 роли
✅ **CRUD операции** за AI инструменти
✅ **Рейтинг и коментари** система
✅ **Admin панел** с пълна функционалност
✅ **Responsive UI** с dark mode
✅ **Docker setup** за лесно deployment
✅ **Comprehensive документация**

### Бързи команди за представяне:

```bash
# Стартиране
./start.sh

# Отваряне в браузър
# Frontend: http://localhost:8200
# Backend: http://localhost:8201

# Login като admin
Email: admin@example.com
Password: password

# Спиране
./stop.sh
```

**Успех с представянето! 🚀**
