# 🤖 AI Agents Development Guide

Пълно ръководство за използване на AI агенти (Claude Code, GitHub Copilot, Cursor и др.) при разработка на AI Tools Platform.

## 📋 Съдържание

- [Въведение](#въведение)
- [Начални промптове за различни сценарии](#начални-промптове-за-различни-сценарии)
- [Best Practices](#best-practices)
- [Контекст на проекта за AI](#контекст-на-проекта-за-ai)
- [Типични задачи с примери](#типични-задачи-с-примери)
- [Troubleshooting с AI помощ](#troubleshooting-с-ai-помощ)
- [Advanced сценарии](#advanced-сценарии)

---

## Въведение

Този проект е оптимизиран за работа с AI асистенти. Всички AI агенти имат достъп до пълната документация и могат да помагат при:

- 🏗️ Архитектурни решения
- 💻 Писане на код (Frontend + Backend)
- 🐛 Debugging и fixing на проблеми
- 🧹 Code refactoring и cleanup
- 📝 Документация
- 🧪 Тестване
- 🚀 Deployment

---

## Начални промптове за различни сценарии

### 🚀 1. Стартиране на нов проект сесия

**Когато започваш нова сесия с AI агент:**

```
Здравей! Работя по AI Tools Platform проекта.

Контекст:
- Full-stack приложение: Laravel 12 (backend) + Next.js 15 (frontend)
- База данни: MySQL/SQLite с Eloquent ORM
- Автентикация: Laravel Sanctum с 2FA
- Frontend: React 19 + TypeScript + Tailwind CSS
- API: RESTful с Bearer token authentication
- Docker setup за development

Моля прегледай структурата на проекта и ми кажи какво забелязваш.
Готов съм да работя по [конкретна задача].
```

**Какво ще направи AI:**
- Ще сканира проектната структура
- Ще идентифицира ключови файлове
- Ще разбере архитектурата
- Ще е готов за конкретни задачи

---

### 🆕 2. Добавяне на нова функционалност

**Prompt template:**

```
Искам да добавя [ФУНКЦИОНАЛНОСТ] към AI Tools Platform.

Изисквания:
- [Изискване 1]
- [Изискване 2]
- [Изискване 3]

Роли с достъп: [all / authenticated / owner only / specific roles]

Моля:
1. Анализирай съществуващата структура
2. Предложи database schema (ако е нужно)
3. Създай backend API endpoints
4. Създай frontend UI и интеграция
5. Добави валидация и error handling
6. Тествай функционалността
7. Обнови документацията

Използвай съществуващите patterns от проекта.
```

**Примерна конкретна задача:**

```
Искам да добавя "Favourite tools" функционалност към AI Tools Platform.

Изисквания:
- Потребителите могат да добавят инструменти в любими (like/unlike)
- Бутон за favourite на всеки tool card
- Страница с любими инструменти (/profile/favourites)
- API endpoint за toggle favourite
- Показване на брой favourites на всеки инструмент

Роли с достъп: authenticated users only

Моля:
1. Анализирай съществуващата структура
2. Създай user_favourites таблица и migration
3. Създай API endpoint POST /api/tools/{id}/favourite
4. Обнови AiTool model с favourites relationship
5. Създай FavouriteButton React компонент
6. Създай страница /profile/favourites
7. Тествай функционалността

Използвай съществуващите patterns от проекта.
```

---

### 🔧 3. Refactoring и оптимизация

**Prompt за general refactoring:**

```
Моля направи comprehensive code review на AI Tools Platform проекта.

Фокусирай се на:

**Security:**
- SQL injection vulnerabilities
- XSS attacks
- CSRF protection
- Authentication bypass
- Proper input validation
- Sensitive data exposure

**Performance:**
- N+1 query problems
- Missing database indexes
- Inefficient queries
- Eager loading opportunities
- Caching opportunities
- Frontend bundle size

**Code Quality:**
- DRY violations (код, който се повтаря)
- Unused imports and variables
- Dead code
- Complex functions (за refactoring)
- Type safety (TypeScript)
- Naming conventions

**Best Practices:**
- Laravel best practices
- React/Next.js best practices
- API design patterns
- Error handling
- Logging
- Comments за сложна логика

За всеки issue:
1. Опиши проблема
2. Покажи текущия код
3. Предложи решение
4. Имплементирай fix (ако искам)

Започни с най-критичните issues първо.
```

**Prompt за конкретен файл:**

```
Моля прегледай и оптимизирай файла [FILE_PATH].

Какво трябва да провериш:
1. Performance issues (заявки, loops, complexity)
2. Security vulnerabilities
3. Code duplication
4. Възможности за refactoring
5. Type safety (ако е TypeScript)
6. Error handling
7. Best practices за [Laravel/React/Next.js]

Предложи конкретни подобрения с преди/след примери.
```

---

### 🐛 4. Debugging на проблем

**Prompt template:**

```
Имам проблем с [ОПИСАНИЕ НА ПРОБЛЕМА].

**Как да репродуцирам:**
1. [Стъпка 1]
2. [Стъпка 2]
3. [Стъпка 3]

**Очаквано поведение:**
[Какво очаквам да се случи]

**Реално поведение:**
[Какво всъщност се случва]

**Error message (ако има):**
```
[Пълен error message и stack trace]
```

**Засегнати файлове (предположение):**
- [Файл 1]
- [Файл 2]

**Environment:**
- Browser: [Chrome/Firefox/Safari]
- Device: [Desktop/Mobile]
- Docker: [Yes/No]

Моля:
1. Анализирай кода в засегнатите файлове
2. Идентифицирай root cause
3. Предложи решение
4. Имплементирай fix
5. Провери дали има подобни проблеми другаде
6. Тествай
```

**Конкретен пример:**

```
Имам проблем с login формата - след submit не се случва нищо.

**Как да репродуцирам:**
1. Отвори http://localhost:8200/login
2. Въведи email: admin@example.com
3. Въведи password: password
4. Натисни "Login"

**Очаквано поведение:**
Трябва да влезе в системата и да redirect-не към /dashboard

**Реално поведение:**
Формата се submit-ва, но нищо не се случва. Няма error message.

**Error message (ако има):**
В browser console виждам:
```
POST http://localhost:8201/api/login 404 (Not Found)
```

**Засегнати файлове (предположение):**
- frontend/app/login/page.tsx
- frontend/lib/api.ts
- backend/routes/api.php

**Environment:**
- Browser: Chrome 131
- Device: Desktop
- Docker: Yes

Моля:
1. Провери API route за login
2. Провери дали backend работи
3. Провери CORS settings
4. Провери frontend API URL configuration
5. Fix проблема
```

---

### 🎨 5. UI/UX подобрения

**Prompt template:**

```
Искам да подобря UI/UX на [СТРАНИЦА/КОМПОНЕНТ].

**Текущи проблеми:**
- [Проблем 1]
- [Проблем 2]

**Желани подобрения:**
- [Подобрение 1]
- [Подобрение 2]

**Design requirements:**
- Responsive (mobile, tablet, desktop)
- Dark mode support
- Tailwind CSS
- Следва дизайн pattern-а на проекта
- Accessibility (WCAG)

Моля:
1. Анализирай текущия UI
2. Предложи подобрения с mockup/описание
3. Имплементирай промените
4. Тествай на различни devices
5. Провери accessibility
```

**Конкретен пример:**

```
Искам да подобря UI на tools listing страницата (/tools).

**Текущи проблеми:**
- Tool cards са еднообразни, липсва визуална йерархия
- Не се виждат ratings и comments на първо място
- Филтрите са трудни за използване
- Няма empty state когато няма tools

**Желани подобрения:**
- Добави визуална индикация за rating (звезди)
- Покажи брой коментари
- Подобри filters UX (dropdown вместо checkboxes)
- Добави skeleton loading state
- Добави empty state с illustration
- Добави sort options (по rating, по дата, по views)

**Design requirements:**
- Responsive (mobile, tablet, desktop)
- Dark mode support
- Tailwind CSS
- Следва дизайн pattern-а на проекта

Моля:
1. Анализирай текущия UI (frontend/app/tools/page.tsx)
2. Предложи подобрения
3. Имплементирай промените
4. Тествай на различни devices
```

---

### 📊 6. Database промени

**Prompt template:**

```
Искам да направя database schema промени за [ОБЯСНЕНИЕ].

**Промени:**
- Нова таблица: [име, описание]
- Промяна в таблица: [име, промени]
- Нова релация: [между X и Y]

**Migrations:**
- [ ] Create migration файл
- [ ] Rollback функционалност
- [ ] Indexes за performance
- [ ] Foreign key constraints

**Models:**
- [ ] Eloquent model
- [ ] Relationships (hasMany, belongsTo, etc.)
- [ ] Scopes за често използвани queries
- [ ] Casts за data types

**Seeders:**
- [ ] Sample data
- [ ] Production-ready data (ако е нужно)

**Integration:**
- [ ] Controllers
- [ ] API routes
- [ ] Frontend TypeScript types
- [ ] API calls

Моля направи всичко това и тествай.
```

---

### 🧪 7. Тестване

**Prompt template:**

```
Искам да добавя тестове за [ФУНКЦИОНАЛНОСТ].

**Типове тестове:**
- [ ] Unit tests (individual functions)
- [ ] Integration tests (API endpoints)
- [ ] Feature tests (цели функционалности)
- [ ] E2E tests (user flows)

**Test coverage за:**
- [Feature 1]
- [Feature 2]
- [Edge case 1]
- [Error case 1]

**Test framework:**
- Backend: PHPUnit / Pest
- Frontend: Jest / Vitest (ако е setup-нато)

Моля:
1. Създай test files
2. Напиши comprehensive тестове
3. Включи happy path и edge cases
4. Изпълни тестовете и покажи резултатите
5. Fix failing tests
```

---

### 🔐 8. Security audit

**Prompt:**

```
Моля направи security audit на AI Tools Platform проекта.

**Фокусирай се на:**

1. **Authentication & Authorization:**
   - JWT/Token security
   - Session management
   - Password hashing
   - 2FA implementation
   - Role-based access control

2. **Input Validation:**
   - SQL injection
   - XSS attacks
   - CSRF protection
   - File upload validation
   - API input sanitization

3. **Data Protection:**
   - Sensitive data exposure
   - Encryption at rest
   - Secure communications (HTTPS)
   - Environment variables security

4. **API Security:**
   - Rate limiting
   - CORS configuration
   - Authentication bypass
   - Authorization bypass

5. **Dependencies:**
   - Vulnerable packages (npm audit, composer audit)
   - Outdated dependencies

За всеки issue:
1. Severity level (Critical/High/Medium/Low)
2. Описание на проблема
3. Как може да бъде exploit-нат
4. Препоръчано решение
5. Имплементирай fix (за критични issues)

Създай security report в SECURITY_AUDIT.md.
```

---

### 📚 9. Документация

**Prompt:**

```
Моля обнови/създай документация за [FEATURE/FILE/API].

**Изисквания:**
- Ясни примери с код
- API endpoint документация (ако е приложимо)
- Request/Response examples
- Error codes и handling
- Screenshots (опиши какви трябва да се добавят)
- Markdown formatting

**Структура:**
1. Описание
2. Предпоставки
3. Инсталация/Setup
4. Употреба с примери
5. API Reference
6. Troubleshooting
7. FAQ

Файл: [FILE_PATH] или създай нов
```

---

### 🚀 10. Deployment подготовка

**Prompt:**

```
Моля подготви проекта за production deployment.

**Checklist:**
- [ ] Environment variables validation
- [ ] Security hardening
- [ ] Performance optimization
- [ ] Database migrations tested
- [ ] Seeders за production data
- [ ] Error handling и logging
- [ ] CORS configuration за production
- [ ] SSL/HTTPS setup
- [ ] Docker optimization (production images)
- [ ] Health checks
- [ ] Monitoring setup
- [ ] Backup strategy
- [ ] Deployment documentation

**Platform:** [AWS/DigitalOcean/Heroku/Custom VPS]

Създай deployment checklist и guides.
```

---

## Best Practices

### ✅ DO:

1. **Давай контекст винаги**
   - Споменавай технологичния стек
   - Посочвай конкретни файлове
   - Обяснявай какво се опитваш да постигнеш

2. **Бъди конкретен**
   ```
   ❌ "Направи формата по-хубава"
   ✅ "Добави валидация на login формата за email и password, покажи error messages под полетата, добави loading state на бутона"
   ```

3. **Искай обяснения**
   ```
   "Обясни защо избра този подход вместо [алтернатива]"
   "Кои са trade-offs на това решение?"
   ```

4. **Review кода преди merge**
   - Винаги прегледай генерирания код
   - Тествай функционалността
   - Провери дали следва project conventions

5. **Итерирай**
   ```
   "Това е добро, но можеш ли да оптимизираш query-то с eager loading?"
   "Добави TypeScript типове и за response-а"
   ```

### ❌ DON'T:

1. **Не давай неясни промптове**
   ```
   ❌ "Направи нещо с базата"
   ❌ "Fix-ни тази страница"
   ❌ "Подобри кода"
   ```

2. **Не приемай слепо всичко**
   - AI може да сгреши
   - Винаги проверявай логиката
   - Тествай преди commit

3. **Не забравяй за security**
   ```
   "Провери дали input-ът е валидиран"
   "Добави authentication check"
   "Използвай parameterized queries"
   ```

4. **Не игнорирай TypeScript errors**
   ```
   "Fix всички TypeScript errors преди да приключиш"
   ```

5. **Не пренебрегвай документацията**
   ```
   "Обнови API.md с новите endpoints"
   "Добави JSDoc коментари за сложните функции"
   ```

---

## Контекст на проекта за AI

**Copy-paste този блок когато стартираш нова AI сесия:**

```
# AI Tools Platform - Project Context

## Tech Stack
- **Backend:** Laravel 12, PHP 8.2+, MySQL/SQLite, Redis
- **Frontend:** Next.js 15, React 19, TypeScript 5.7, Tailwind CSS
- **Auth:** Laravel Sanctum, 2FA (Email + TOTP)
- **Deployment:** Docker + Docker Compose

## Architecture
- RESTful API (backend serves API only)
- Next.js frontend consumes API
- Bearer token authentication
- Role-based access control (6 roles)
- Redis caching for performance

## Key Features
- AI tools catalog with CRUD
- Categories and tags (many-to-many)
- Rating and comments system
- User roles and permissions
- 2FA authentication
- Admin dashboard
- Audit logging

## Database Models
- User (with Role)
- Role (6 roles: owner, backend_dev, frontend_dev, qa, designer, pm)
- AiTool (status: active/pending/archived)
- Category
- Tag (many-to-many with AiTool)
- ToolRecommendation (rating + comment)
- UserLoginHistory
- AuditLog

## Project Structure
```
/frontend/app/          # Next.js pages
/frontend/components/   # React components
/frontend/lib/          # API client, types
/backend/app/Models/    # Eloquent models
/backend/app/Http/Controllers/Api/  # API controllers
/backend/routes/api.php # API routes
/backend/database/migrations/  # Migrations
```

## Conventions
- **Backend routes:** /api/{resource}
- **Frontend routes:** /{page}
- **API response:** { data: {...}, message: "..." }
- **Error response:** { error: "...", message: "..." }
- **Auth header:** Authorization: Bearer {token}
- **Naming:** camelCase (TS), snake_case (PHP)

## Environment
- Frontend: http://localhost:8200
- Backend: http://localhost:8201
- MySQL: port 8203
- Redis: port 8204

## Current Status
- ✅ Authentication with 2FA
- ✅ CRUD for tools
- ✅ Admin panel
- ✅ Ratings and comments
- ✅ Role system
- ✅ Docker setup
```

---

## Типични задачи с примери

### Задача 1: Добавяне на нов API endpoint

**Prompt:**
```
Създай API endpoint за search на tools с advanced filters.

Endpoint: GET /api/tools/search
Authentication: optional (показва само active ако не е logged in)

Query params:
- q (string): search text (в name, description, how_to_use)
- category (int): category_id
- tags (string): comma-separated tag IDs
- role (int): suitable_for_role
- rating_min (int): minimum rating (1-5)
- sort (string): "rating", "views", "created_at", "name"
- order (string): "asc", "desc"

Response:
{
  "data": [...tools...],
  "meta": {
    "total": 50,
    "per_page": 12,
    "current_page": 1
  }
}

Моля:
1. Създай метод в AiToolController
2. Добави route
3. Имплементирай search логика с Eloquent
4. Добави pagination
5. Тествай с curl
```

### Задача 2: Създаване на React компонент

**Prompt:**
```
Създай React компонент StarRating с TypeScript.

Props:
- value (number, 0-5): current rating
- onChange (function, optional): callback при промяна
- readonly (boolean): дали е само за четене
- size (string): "sm", "md", "lg"

Функционалност:
- Показва 5 звезди
- Hover effect (preview на rating)
- Click за set rating (ако не е readonly)
- Half stars support (4.5 показва 4.5 звезди)
- Responsive с Tailwind
- Dark mode support

Файл: frontend/components/ui/StarRating.tsx

Използвай SVG icons за звездите (можеш да използваш heroicons).
```

### Задача 3: Database migration

**Prompt:**
```
Създай migration за user_tool_views таблица.

Цел: Tracking кой user е гледал кой tool (за recommendations).

Columns:
- id (primary)
- user_id (foreign key to users)
- tool_id (foreign key to ai_tools)
- viewed_at (timestamp)
- device (string, nullable)
- timestamps

Indexes:
- Unique compound index (user_id, tool_id)
- Index on tool_id
- Index on viewed_at

Foreign keys:
- ON DELETE CASCADE

Rollback function също.

Моля:
1. Създай migration
2. Създай UserToolView model
3. Добави relationships в User и AiTool models
4. Създай seeder с sample data
```

### Задача 4: Performance optimization

**Prompt:**
```
Оптимизирай tool listing page за performance.

Текущи проблеми:
- N+1 queries при загрузка на tools (виждам 100+ queries)
- Липсват indexes
- Няма caching

Файлове:
- backend/app/Http/Controllers/Api/AiToolController.php (index method)
- backend/app/Models/AiTool.php

Моля:
1. Анализирай queries с Laravel debugbar
2. Добави eager loading за relationships
3. Добави database indexes (migration)
4. Имплементирай Redis caching (5 min TTL)
5. Покажи преди/след резултати (брой queries, време)
```

---

## Troubleshooting с AI помощ

### Проблем: "Cannot connect to backend API"

**Prompt:**
```
Frontend не може да се свърже с backend API.

Error: "Failed to fetch" в browser console

Провери:
1. Backend работи ли? (curl http://localhost:8201/api/status)
2. CORS settings в backend/.env
3. Frontend .env.local (NEXT_PUBLIC_API_URL)
4. Docker network settings
5. Nginx configuration

Дайми стъпки за debugging и fix-ни проблема.
```

### Проблем: "Migration fails"

**Prompt:**
```
Migration fails с error:

```
SQLSTATE[HY000]: General error: 1005 Can't create table
```

Migration: xxxx_create_tool_recommendations_table.php

Провери:
1. Foreign key constraints
2. Referenced table exists
3. Column types match
4. Engine type (InnoDB)

Fix migration файла и обясни какво беше проблемът.
```

### Проблем: "TypeScript errors"

**Prompt:**
```
Имам TypeScript errors във frontend:

```
Property 'recommendations' does not exist on type 'AiTool'
```

Файлове:
- frontend/lib/types.ts
- frontend/app/tools/[id]/page.tsx

Моля:
1. Провери types.ts дефиницията
2. Провери API response структура
3. Sync типовете с backend
4. Fix всички TypeScript errors
```

---

## Advanced сценарии

### Сценарий 1: Real-time features с WebSockets

**Prompt:**
```
Искам да добавя real-time notifications в проекта.

Use case:
- Admin одобрява tool → User получава notification
- Някой коментира на твоя tool → Notification
- Нов tool в любима категория → Notification

Technology:
- Laravel Broadcasting (Pusher/Socket.io/Redis)
- React hooks за subscriptions

Моля:
1. Анализирай options (Pusher vs self-hosted)
2. Препоръчай решение за този проект
3. Имплементирай backend broadcasting
4. Създай frontend notification система
5. Добави notifications UI
6. Тествай
```

### Сценарий 2: Advanced search с Elasticsearch

**Prompt:**
```
Текущото search е бавно при много tools. Искам да внедря Elasticsearch.

Requirements:
- Index всички tools
- Full-text search в multiple fields
- Faceted search (filters по category, tags, rating)
- Highlighting на search results
- Autocomplete suggestions

Моля:
1. Setup Elasticsearch в Docker
2. Създай tool indexing service
3. Laravel Scout integration
4. API endpoints за search
5. Frontend search UI с instant results
6. Migration strategy (index existing tools)
```

### Сценарий 3: API rate limiting и caching strategy

**Prompt:**
```
Искам да имплементирам sophisticated rate limiting и caching.

Rate Limiting:
- Public endpoints: 60 requests/min per IP
- Authenticated: 1000 requests/min per user
- Admin: unlimited
- Specific expensive endpoints: 10 requests/min

Caching Strategy:
- Tool listings: 5 min
- Individual tools: 15 min
- Categories/Tags: 1 hour
- Admin stats: 5 min
- User profile: no cache (always fresh)

Моля:
1. Имплементирай rate limiting (Laravel middleware)
2. Caching strategy с Redis
3. Cache invalidation при updates
4. Cache warming за popular pages
5. Monitoring и metrics
```

---

## Полезни команди при работа с AI

### Git workflow
```bash
# Създай feature branch за AI changes
git checkout -b ai/feature-name

# Commit след всяка функционална промяна
git add .
git commit -m "AI: Add feature X"

# Push за backup
git push origin ai/feature-name
```

### Testing workflow
```bash
# Backend tests
docker compose exec php_fpm php artisan test --filter=FeatureName

# Frontend build check
docker compose exec frontend npm run build

# API testing
curl -X POST http://localhost:8201/api/endpoint \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer TOKEN" \
  -d '{"key":"value"}'
```

### Monitoring AI changes
```bash
# Watch logs
docker compose logs -f --tail=100

# Check database changes
docker compose exec php_fpm php artisan migrate:status

# Check routes
docker compose exec php_fpm php artisan route:list | grep endpoint
```

---

## 🎯 Checklist след AI промени

След като AI направи промени, винаги провери:

- [ ] Кодът компилира без errors (TypeScript, PHP)
- [ ] Тестовете минават (ако има)
- [ ] Няма security vulnerabilities
- [ ] Follows project conventions (naming, structure)
- [ ] Error handling е имплементирано
- [ ] Валидация на input данни
- [ ] API endpoint-ите са документирани
- [ ] TypeScript типовете са обновени
- [ ] Database migrations имат rollback
- [ ] UI е responsive и dark mode compatible
- [ ] Commit message-ите са смислени
- [ ] Документацията е обновена (ако е нужно)

---

## 🚀 Заключение

Използвай AI агентите като power tool, но винаги:

1. **Давай ясен контекст** - AI трябва да разбере проекта
2. **Бъди конкретен** - Точни изисквания = по-добри резултати
3. **Review кода** - AI не е безгрешен
4. **Тествай** - Винаги тествай генерирания код
5. **Итерирай** - Refine резултатите с follow-up промптове
6. **Документирай** - Обновявай документацията

**Happy coding with AI! 🤖✨**
