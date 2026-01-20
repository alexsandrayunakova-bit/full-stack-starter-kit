# 📚 Документация на AI Tools Platform

**Дата на създаване:** Януари 2026  
**Версия:** 1.0.0  
**Статус:** В разработка

---

## 📋 Съдържание

1. [Общ преглед](#общ-преглед)
2. [Технологичен стек](#технологичен-стек)
3. [Backend структура](#backend-структура)
4. [Frontend структура](#frontend-структура)
5. [Database схема](#database-схема)
6. [API Endpoints](#api-endpoints)
7. [Автентификация](#автентификация)
8. [Функционалности](#функционалности)
9. [Какво остава за довършване](#какво-остава-за-довършване)
10. [Инструкции за стартиране](#инструкции-за-стартиране)

---

## 🎯 Общ преглед

AI Tools Platform е full-stack приложение за управление на AI инструменти. Системата позволява на потребителите да добавят, преглеждат, редактират и изтриват AI инструменти с различни категории, тагове и роли.

### Постигнато до момента:

✅ **Backend:**
- Пълна database структура с миграции
- Tag система с many-to-many релация
- API endpoints за всички основни операции
- Автентификация с Bearer token (Laravel Sanctum)
- CRUD операции за tools, categories, tags, roles

✅ **Frontend:**
- Форма за добавяне на нови tools
- Списък с tools с филтриране
- Dropdown за категории
- Checkboxes за роли
- Toggle бутони за тагове
- Responsive UI с Tailwind CSS

✅ **Успешно тествано:**
- Добавяне на първия tool в системата
- Всички API endpoints работят
- Автентификация работи

---

## 🛠 Технологичен стек

### Backend
- **Framework:** Laravel 11.x
- **PHP:** 8.2+
- **Database:** MySQL 8.0
- **Cache:** Redis 7
- **Authentication:** Laravel Sanctum
- **Web Server:** Nginx

### Frontend
- **Framework:** Next.js 14+ (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **State Management:** React Hooks
- **HTTP Client:** Fetch API

### Infrastructure
- **Containerization:** Docker & Docker Compose
- **Ports:**
  - Frontend: 3000 (dev) / 8200 (docker)
  - Backend API: 8201
  - MySQL: 8203
  - Redis: 8204

---

## 🗄 Backend структура

### Модели (Models)

#### 1. AiTool (`app/Models/AiTool.php`)

**Полета:**
- `id` - Primary key
- `name` - Име на инструмента
- `slug` - URL-friendly идентификатор
- `description` - Описание
- `url` - Линк към инструмента
- `documentation_url` - Линк към документацията
- `how_to_use` - Инструкции за използване
- `examples` - Примери за използване
- `logo_url` - URL към лого
- `images` - JSON масив с изображения
- `category_id` - Foreign key към categories
- `created_by` - Foreign key към users
- `suitable_for_roles` - JSON масив с role IDs
- `status` - Статус (active, pending, archived)
- `views_count` - Брой прегледи
- `created_at`, `updated_at` - Timestamps

**Релации:**
- `belongsTo(Category)` - Категория
- `belongsTo(User)` - Създател (creator)
- `hasMany(ToolRecommendation)` - Препоръки
- `belongsToMany(Tag)` - Тагове (many-to-many)

**Scopes:**
- `active()` - Активни tools
- `byCategory($categoryId)` - Филтриране по категория
- `forRole($roleId)` - Филтриране по роля

**Методи:**
- `incrementViews()` - Увеличава брояча на прегледи
- `getAverageRatingAttribute()` - Средна оценка
- `getRecommendationsCountAttribute()` - Брой препоръки

#### 2. Tag (`app/Models/Tag.php`)

**Полета:**
- `id` - Primary key
- `name` - Име на тага
- `slug` - URL-friendly идентификатор
- `color` - Цвят за визуализация (hex)
- `created_at`, `updated_at` - Timestamps

**Релации:**
- `belongsToMany(AiTool)` - AI инструменти

#### 3. Category (`app/Models/Category.php`)

**Полета:**
- `id` - Primary key
- `name` - Име на категорията
- `slug` - URL-friendly идентификатор
- `description` - Описание
- `created_at`, `updated_at` - Timestamps

**Релации:**
- `hasMany(AiTool)` - AI инструменти

#### 4. Role (`app/Models/Role.php`)

**Полета:**
- `id` - Primary key
- `name` - Име на ролята (slug)
- `display_name` - Показвано име
- `created_at`, `updated_at` - Timestamps

#### 5. User (`app/Models/User.php`)

**Разширени функционалности:**
- `hasRole($roleName)` - Проверка за роля
- `isOwner()` - Проверка дали е owner
- `role()` - Релация към Role

#### 6. ToolRecommendation (`app/Models/ToolRecommendation.php`)

**Полета:**
- `id` - Primary key
- `tool_id` - Foreign key към ai_tools
- `user_id` - Foreign key към users
- `rating` - Оценка (1-5)
- `comment` - Коментар
- `created_at`, `updated_at` - Timestamps

---

### Контролери (Controllers)

#### 1. AiToolController (`app/Http/Controllers/Api/AiToolController.php`)

**Методи:**

- **`index(Request $request)`** - GET `/api/tools`
  - Връща списък с tools
  - Поддържа филтриране по: category_id, tags, search
  - Поддържа сортиране: sort_by, sort_order
  - Pagination: per_page
  - Eager loading: category, creator.role, recommendations, tags

- **`store(Request $request)`** - POST `/api/tools`
  - Създава нов tool
  - Изисква автентификация
  - Валидация на входните данни
  - Обработка на изображения
  - Sync на тагове

- **`show($id)`** - GET `/api/tools/{id}`
  - Връща детайли за tool
  - Увеличава views_count
  - Eager loading: category, creator.role, recommendations

- **`update(Request $request, $id)`** - PUT `/api/tools/{id}`
  - Обновява tool
  - Изисква автентификация
  - Проверка за права (owner или creator)

- **`destroy(Request $request, $id)`** - DELETE `/api/tools/{id}`
  - Изтрива tool
  - Изисква автентификация
  - Проверка за права (owner или creator)

#### 2. CategoryController (`app/Http/Controllers/Api/CategoryController.php`)

- **`index()`** - GET `/api/categories` - Списък с категории
- **`show($slug)`** - GET `/api/categories/{slug}` - Детайли за категория

#### 3. TagController (`app/Http/Controllers/Api/TagController.php`)

- **`index()`** - GET `/api/tags` - Списък с тагове
- **`show($id)`** - GET `/api/tags/{id}` - Детайли за таг

#### 4. RoleController (`app/Http/Controllers/Api/RoleController.php`)

- **`index()`** - GET `/api/roles` - Списък с роли
- **`show($id)`** - GET `/api/roles/{id}` - Детайли за роля

#### 5. AuthController (`app/Http/Controllers/Api/AuthController.php`)

- **`login(Request $request)`** - POST `/api/login` - Вход
- **`register(Request $request)`** - POST `/api/register` - Регистрация
- **`logout(Request $request)`** - POST `/api/logout` - Изход (изисква auth)
- **`me(Request $request)`** - GET `/api/me` - Текущ потребител (изисква auth)

---

## 🎨 Frontend структура

### Страници (Pages)

#### 1. `/tools` - Списък с tools (`src/app/tools/page.tsx`)

**Функционалности:**
- Показва всички tools в grid layout
- Филтриране по:
  - Име (search)
  - Категория (dropdown)
  - Роля (dropdown)
  - Таг (dropdown)
- Responsive design (1/2/3 колони)
- Линк към детайлна страница

**Компоненти:**
- Search input
- Filter dropdowns
- Tool cards с:
  - Име и категория
  - Описание (truncated)
  - Роли и тагове
  - Линкове към tool и документация

#### 2. `/tools/new` - Добавяне на нов tool (`src/app/tools/new/page.tsx`)

**Форма с полета:**
- **Основни данни:**
  - Име (name) - required
  - URL (url) - optional
  - Documentation URL (documentation_url) - optional
  - Описание (description) - required, textarea
  - Как се използва (how_to_use) - optional, textarea
  - Примери (examples) - optional, textarea
  - Logo URL (logo_url) - optional

- **Категория:**
  - Dropdown с всички категории - required

- **Роли:**
  - Checkboxes за всяка роля
  - Множествен избор

- **Тагове:**
  - Toggle бутони с цветове
  - Множествен избор

- **Изображения:**
  - Input за URLs (временно)
  - В бъдеще: file upload

**Валидация:**
- Frontend валидация
- Backend валидация чрез Laravel

**Автентификация:**
- Проверка за token
- Пренасочване към /login ако няма token

#### 3. `/tools/[id]` - Детайлна страница (`src/app/tools/[id]/page.tsx`)

**Функционалности:**
- Показва пълна информация за tool
- Header с лого и име
- Описание
- Линкове (URL и документация)
- Инструкции за използване
- Примери
- Тагове с цветове
- Галерия с изображения
- Информация за създателя
- Бутони за редактиране и изтриване

**Статус:** В процес на разработка (има проблем с зареждането на данни)

#### 4. `/login` - Вход (`src/app/login/page.tsx`)

**Функционалности:**
- Форма за вход (email, password)
- Валидация
- Запазване на token в localStorage
- Пренасочване след успешен вход

#### 5. `/dashboard` - Dashboard (`src/app/dashboard/page.tsx`)

**Функционалности:**
- Показва информация за текущия потребител
- Бутон за изход

---

### Контексти (Contexts)

#### AuthContext (`src/contexts/AuthContext.tsx`)

**Функционалности:**
- Управление на автентификация
- Проверка за token
- Автоматично пренасочване

---

### Utilities

#### API Client (`src/lib/api.ts`)

**Функционалности:**
- Axios конфигурация
- Автоматично добавяне на Authorization header
- Base URL конфигурация

---

## 🗃 Database схема

### Таблици

#### 1. `users`
```sql
- id (bigint, primary)
- name (string)
- email (string, unique)
- email_verified_at (timestamp, nullable)
- password (string)
- role_id (foreign key -> roles.id)
- created_at, updated_at
```

#### 2. `roles`
```sql
- id (bigint, primary)
- name (string, unique)
- display_name (string)
- created_at, updated_at
```

#### 3. `categories`
```sql
- id (bigint, primary)
- name (string)
- slug (string, unique)
- description (text, nullable)
- created_at, updated_at
```

#### 4. `ai_tools`
```sql
- id (bigint, primary)
- name (string)
- slug (string, unique)
- description (text)
- url (string, nullable)
- documentation_url (string, nullable)
- how_to_use (text, nullable)
- examples (text, nullable)
- logo_url (string, nullable)
- images (json, nullable)
- category_id (foreign key -> categories.id)
- created_by (foreign key -> users.id)
- suitable_for_roles (json, nullable)
- status (enum: active, pending, archived)
- views_count (integer, default: 0)
- created_at, updated_at

Indexes:
- category_id, status
- created_by
```

#### 5. `tags`
```sql
- id (bigint, primary)
- name (string)
- slug (string, unique)
- color (string)
- created_at, updated_at
```

#### 6. `ai_tool_tag` (pivot table)
```sql
- id (bigint, primary)
- ai_tool_id (foreign key -> ai_tools.id)
- tag_id (foreign key -> tags.id)
- created_at, updated_at

Unique constraint: ai_tool_id, tag_id
```

#### 7. `tool_recommendations`
```sql
- id (bigint, primary)
- tool_id (foreign key -> ai_tools.id)
- user_id (foreign key -> users.id)
- rating (integer, 1-5)
- comment (text, nullable)
- created_at, updated_at
```

#### 8. `personal_access_tokens` (Laravel Sanctum)
```sql
- id (bigint, primary)
- tokenable_type (string)
- tokenable_id (bigint)
- name (string)
- token (string, unique)
- abilities (text, nullable)
- last_used_at (timestamp, nullable)
- expires_at (timestamp, nullable)
- created_at, updated_at
```

### Релации

```
Users 1:N AiTools (created_by)
Users 1:N ToolRecommendations
Categories 1:N AiTools
Roles 1:N Users
AiTools N:M Tags (through ai_tool_tag)
AiTools 1:N ToolRecommendations
```

---

## 🔌 API Endpoints

### Публични endpoints (без автентификация)

#### Автентификация
- `POST /api/login` - Вход
- `POST /api/register` - Регистрация

#### Категории
- `GET /api/categories` - Списък с категории
- `GET /api/categories/{slug}` - Детайли за категория

#### Тагове
- `GET /api/tags` - Списък с тагове
- `GET /api/tags/{id}` - Детайли за таг

#### Роли
- `GET /api/roles` - Списък с роли
- `GET /api/roles/{id}` - Детайли за роля

#### Tools
- `GET /api/tools` - Списък с tools
  - Query parameters:
    - `category_id` - Филтриране по категория
    - `tags` - Филтриране по тагове (array)
    - `search` - Търсене по име/описание
    - `sort_by` - Поле за сортиране (default: created_at)
    - `sort_order` - Посока (asc/desc, default: desc)
    - `per_page` - Брой на страница (default: 12)
- `GET /api/tools/{id}` - Детайли за tool

#### Статус
- `GET /api/status` - Health check

---

### Защитени endpoints (изискват автентификация)

**Header:** `Authorization: Bearer {token}`

#### Автентификация
- `POST /api/logout` - Изход
- `GET /api/me` - Текущ потребител

#### Tools
- `POST /api/tools` - Създаване на tool
  - Body: JSON с данни за tool
- `PUT /api/tools/{id}` - Обновяване на tool
  - Body: JSON с данни за tool
- `DELETE /api/tools/{id}` - Изтриване на tool

#### Препоръки
- `POST /api/recommendations` - Създаване на препоръка
- `PUT /api/recommendations/{id}` - Обновяване на препоръка
- `DELETE /api/recommendations/{id}` - Изтриване на препоръка

---

## 🔐 Автентификация

### Laravel Sanctum

Системата използва Laravel Sanctum за token-based автентификация.

**Как работи:**

1. **Вход:**
   ```javascript
   POST /api/login
   Body: { email, password }
   Response: { token, user }
   ```

2. **Запазване на token:**
   - Token се запазва в `localStorage` като `token`
   - Frontend автоматично добавя `Authorization: Bearer {token}` header

3. **Използване:**
   - Всички защитени endpoints изискват валиден token
   - Token се проверява автоматично от Laravel Sanctum middleware

4. **Изход:**
   ```javascript
   POST /api/logout
   Headers: { Authorization: Bearer {token} }
   ```
   - Token се изтрива от базата данни
   - Frontend изтрива token от localStorage

### Роли

Системата поддържа следните роли:
- `owner` - Собственик (пълни права)
- `backend` - Backend Developer
- `frontend` - Frontend Developer
- `qa` - QA Engineer
- `designer` - Designer
- `pm` - Project Manager

**Проверка за права:**
- Създателят на tool може да го редактира/изтрие
- Owner може да редактира/изтрие всеки tool

---

## ✨ Функционалности

### Реализирани

#### 1. Управление на Tools
- ✅ Добавяне на нов tool
- ✅ Преглед на списък с tools
- ✅ Филтриране по категория, роля, таг, име
- ✅ Детайлна страница (в процес на дебъгване)

#### 2. Категории
- ✅ Dropdown в формата за добавяне
- ✅ Показване в списъка с tools
- ✅ API endpoint за всички категории

#### 3. Тагове
- ✅ Many-to-many релация с tools
- ✅ Toggle бутони с цветове в формата
- ✅ Показване в списъка и детайлната страница
- ✅ API endpoint за всички тагове

#### 4. Роли
- ✅ Checkboxes в формата
- ✅ JSON поле `suitable_for_roles` в ai_tools
- ✅ Показване в списъка с tools
- ✅ API endpoint за всички роли

#### 5. Автентификация
- ✅ Login форма
- ✅ Register функционалност
- ✅ Token-based автентификация
- ✅ Защитени endpoints
- ✅ Автоматично добавяне на Authorization header

#### 6. UI/UX
- ✅ Responsive design
- ✅ Tailwind CSS стилизация
- ✅ Loading states
- ✅ Error handling
- ✅ Български език

---

## 🚧 Какво остава за довършване

### Приоритет 1 (Критично)

#### 1. Детайлна страница (`/tools/[id]`)
- ⚠️ **Проблем:** "Tool not found" грешка
- **Задачи:**
  - Дебъгване на API заявката
  - Проверка на ID формата (число vs string)
  - Подобряване на error handling
  - Тестване с реални данни

#### 2. Редактиране на tool (`/tools/[id]/edit`)
- **Задачи:**
  - Създаване на edit страница
  - Зареждане на съществуващи данни
  - Обновяване на данни чрез PUT request
  - Валидация
  - Успешно съобщение след обновяване

#### 3. Изтриване на tool
- **Задачи:**
  - Потвърждение преди изтриване
  - DELETE request към API
  - Пренасочване след изтриване
  - Error handling

### Приоритет 2 (Важно)

#### 4. Upload на изображения
- **Текущо:** Само URL input
- **Задачи:**
  - File input за изображения
  - Upload към backend
  - Обработка на файлове в Laravel
  - Запазване в storage
  - Показване на заредени изображения

#### 5. Подобрения на UI/UX
- **Задачи:**
  - Loading skeletons вместо спинъри
  - Toast notifications за успех/грешки
  - По-добри error messages
  - Confirmation dialogs
  - Success animations
  - Empty states

#### 6. Търсене и филтриране
- **Задачи:**
  - По-добро търсене (debounce)
  - Комбинирани филтри
  - Запазване на филтри в URL
  - Clear filters бутон

### Приоритет 3 (Подобрения)

#### 7. Препоръки (Recommendations)
- **Задачи:**
  - Форма за добавяне на препоръка
  - Показване на препоръки в детайлната страница
  - Рейтинг система (звезди)
  - Коментари

#### 8. Статистики
- **Задачи:**
  - Dashboard с статистики
  - Най-преглеждани tools
  - Най-оценени tools
  - Графики

#### 9. Потребителски профили
- **Задачи:**
  - Профилна страница
  - Моите tools
  - Моите препоръки
  - Редактиране на профил

#### 10. SEO оптимизация
- **Задачи:**
  - Meta tags
  - Open Graph tags
  - Sitemap
  - Structured data

---

## 🚀 Инструкции за стартиране

### Предварителни изисквания

- Docker и Docker Compose
- Git

### Стъпки

#### 1. Клониране на проекта
```bash
git clone <repository-url>
cd full-stack-starter-kit
```

#### 2. Стартиране на средата
```bash
./start.sh
```

Това ще:
- Стартира всички Docker контейнери
- Настрои Laravel (ако е необходимо)
- Стартира миграциите
- Зареди seeders (ако има)

#### 3. Доступ до приложението

- **Frontend:** http://localhost:3000 (или 8200 в Docker)
- **Backend API:** http://localhost:8201
- **API Status:** http://localhost:8201/api/status

#### 4. Първоначална настройка

##### Backend (.env файл)
```env
APP_NAME="AI Tools Platform"
APP_ENV=local
APP_KEY=base64:...
APP_DEBUG=true
APP_URL=http://localhost:8201

DB_CONNECTION=mysql
DB_HOST=mysql
DB_PORT=3306
DB_DATABASE=vibecode-full-stack-starter-kit_app
DB_USERNAME=root
DB_PASSWORD=vibecode-full-stack-starter-kit_mysql_pass

SANCTUM_STATEFUL_DOMAINS=localhost:3000,localhost:8200
```

##### Frontend (.env.local файл)
```env
NEXT_PUBLIC_API_URL=http://localhost:8201
```

#### 5. Database операции

```bash
# Миграции
docker compose exec php_fpm php artisan migrate

# Seeders
docker compose exec php_fpm php artisan db:seed

# Rollback
docker compose exec php_fpm php artisan migrate:rollback
```

#### 6. Спиране на средата
```bash
./stop.sh
```

---

## 📝 Полезни команди

### Backend
```bash
# Artisan команди
docker compose exec php_fpm php artisan [command]

# Composer
docker compose exec php_fpm composer [command]

# Logs
docker compose logs php_fpm -f
docker compose logs backend -f
```

### Frontend
```bash
# NPM команди
docker compose exec frontend npm [command]

# Logs
docker compose logs frontend -f
```

### Database
```bash
# Connect to MySQL
./db-manage.sh connect

# Backup
./db-manage.sh backup

# Redis CLI
./db-manage.sh redis
```

---

## 🐛 Известни проблеми

### 1. Детайлна страница не зарежда данни
- **Статус:** В процес на дебъгване
- **Симптоми:** "Tool not found" грешка
- **Възможни причини:**
  - Неправилен ID формат
  - API endpoint не връща правилни данни
  - CORS проблеми
- **Решение:** Проверка на конзолата за error messages

### 2. Изображения - само URLs
- **Статус:** Планирано
- **Решение:** Имплементация на file upload

---

## 📞 Поддръжка

За въпроси и проблеми:
1. Провери конзолата на браузъра за errors
2. Провери backend logs: `docker compose logs php_fpm -f`
3. Провери API response в Network tab
4. Провери database за данни

---

## 📄 Лиценз

[Добави лиценз според нуждите]

---

**Последна актуализация:** Януари 2026  
**Автор:** Development Team
