# AI Tools Platform - Setup Guide

## 🚀 Quick Start

### Prerequisites

- Docker Desktop installed and running
- Git installed
- Ports 8200-8205 available

### Initial Setup

1. **Clone and checkout the branch:**
   ```bash
   git clone <repository-url>
   cd full-stack-starter-kit
   git checkout claude/build-ui-layout-2AJsZ
   ```

2. **Copy environment files:**
   ```bash
   # Backend
   cp backend/.env.example backend/.env

   # Frontend (already configured)
   cp frontend/.env.example frontend/.env.local
   ```

3. **Start Docker containers:**
   ```bash
   ./start.sh
   # Or manually:
   docker compose up -d
   ```

4. **Wait for containers to be healthy (30-60 seconds):**
   ```bash
   docker compose ps
   ```

5. **Initialize Laravel:**
   ```bash
   # Generate application key
   docker compose exec php_fpm php artisan key:generate

   # Run database migrations and seeders
   docker compose exec php_fpm php artisan migrate:fresh --seed
   ```

6. **Access the application:**
   - **Frontend**: http://localhost:8200
   - **Backend API**: http://localhost:8201/api
   - **API Status**: http://localhost:8201/api/status

---

## 📋 Services Overview

| Service | Port | Description |
|---------|------|-------------|
| Frontend (Next.js) | 8200 | React UI with Tailwind CSS |
| Backend (Nginx) | 8201 | Laravel API reverse proxy |
| PHP-FPM | 8202 | Laravel application server |
| MySQL | 8203 | Database server |
| Redis | 8204 | Cache and sessions |
| Tools | 8205 | Development utilities |

---

## 🧪 Testing the Integration

### 1. Test API Endpoints

```bash
# Health check
curl http://localhost:8201/api/status

# Get roles (public)
curl http://localhost:8201/api/roles

# Get categories (public)
curl http://localhost:8201/api/categories

# Get tools (public)
curl http://localhost:8201/api/tools
```

### 2. Test Authentication Flow

```bash
# Register a new user
curl -X POST http://localhost:8201/api/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "password": "password123",
    "password_confirmation": "password123",
    "role_id": 1
  }'

# Login
curl -X POST http://localhost:8201/api/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123"
  }'
```

Save the `token` from the response and use it for authenticated requests:

```bash
# Get authenticated user info
curl http://localhost:8201/api/me \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"

# Create a tool (authenticated)
curl -X POST http://localhost:8201/api/tools \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "New AI Tool",
    "description": "Description here",
    "url": "https://example.com",
    "category_id": 1,
    "suitable_for_roles": [1, 2]
  }'
```

### 3. Test Frontend

1. Open http://localhost:8200 in your browser
2. You should see the **AI Tools Platform** landing page
3. Click **"Към Dashboard"** - should redirect to login if not authenticated
4. Click **"Разгледай инструменти"** - should show tools list
5. Register a new account or login
6. Test all features:
   - Dashboard with statistics
   - Tools list with filters
   - Add new tool
   - View tool details
   - Profile page

---

## 🔧 Development Commands

### Backend (Laravel)

```bash
# Access PHP container
docker compose exec php_fpm bash

# Run artisan commands
docker compose exec php_fpm php artisan migrate
docker compose exec php_fpm php artisan db:seed
docker compose exec php_fpm php artisan tinker
docker compose exec php_fpm php artisan route:list

# Install Composer packages
docker compose exec php_fpm composer install
docker compose exec php_fpm composer require package-name

# Clear cache
docker compose exec php_fpm php artisan cache:clear
docker compose exec php_fpm php artisan config:clear
docker compose exec php_fpm php artisan route:clear
```

### Frontend (Next.js)

```bash
# Access frontend container
docker compose exec frontend sh

# Install npm packages
docker compose exec frontend npm install
docker compose exec frontend npm install package-name

# Build for production
docker compose exec frontend npm run build
```

### Database

```bash
# Connect to MySQL
docker compose exec mysql mysql -u root -pvibecode-full-stack-starter-kit_mysql_pass vibecode-full-stack-starter-kit_app

# Or use the helper script
./db-manage.sh connect

# Create backup
./db-manage.sh backup

# Connect to Redis
docker compose exec redis redis-cli -a vibecode-full-stack-starter-kit_redis_pass
```

---

## 🛠️ Troubleshooting

### Docker containers not starting

1. Check Docker Desktop is running
2. Check ports are not in use:
   ```bash
   lsof -i :8200
   lsof -i :8201
   # etc...
   ```
3. View logs:
   ```bash
   docker compose logs -f
   docker compose logs frontend
   docker compose logs backend
   ```

### Laravel errors

1. Clear cache:
   ```bash
   docker compose exec php_fpm php artisan cache:clear
   docker compose exec php_fpm php artisan config:clear
   ```

2. Check .env file exists:
   ```bash
   ls -la backend/.env
   ```

3. Regenerate app key:
   ```bash
   docker compose exec php_fpm php artisan key:generate
   ```

4. Check database connection:
   ```bash
   docker compose exec php_fpm php artisan migrate:status
   ```

### Frontend not loading

1. Check if Next.js is building:
   ```bash
   docker compose logs frontend
   ```

2. Check .env.local:
   ```bash
   cat frontend/.env.local
   # Should show: NEXT_PUBLIC_API_URL=http://localhost:8201/api
   ```

3. Restart frontend:
   ```bash
   docker compose restart frontend
   ```

4. Hard refresh browser: `Cmd + Shift + R`

### CORS errors

If you see CORS errors in browser console:

1. Check backend/bootstrap/app.php has CORS middleware
2. Verify API URL in frontend/.env.local
3. Restart backend:
   ```bash
   docker compose restart backend php_fpm
   ```

---

## 📊 Database Schema

The application uses the following main tables:

- `users` - User accounts
- `roles` - User roles (Developer, Designer, PM, Manager, Owner)
- `categories` - Tool categories
- `tags` - Tool tags with colors
- `ai_tools` - AI tools catalog
- `tool_recommendations` - User reviews and ratings
- `role_tool` - Many-to-many relationship for suitable roles

---

## 🔐 Default Credentials

After running seeders, you can login with:

```
Email: owner@example.com
Password: password
Role: Owner (full access)
```

Or create your own account via registration.

---

## 🚢 Production Deployment

### Environment Variables

Update these in production:

**Backend (.env):**
```env
APP_ENV=production
APP_DEBUG=false
APP_URL=https://your-domain.com

DB_CONNECTION=mysql
DB_HOST=your-db-host
DB_DATABASE=your-db-name
DB_USERNAME=your-db-user
DB_PASSWORD=your-secure-password

REDIS_HOST=your-redis-host
REDIS_PASSWORD=your-redis-password
```

**Frontend (.env.local):**
```env
NEXT_PUBLIC_API_URL=https://api.your-domain.com/api
```

### Build Commands

```bash
# Backend - optimize for production
docker compose exec php_fpm php artisan config:cache
docker compose exec php_fpm php artisan route:cache
docker compose exec php_fpm php artisan view:cache
docker compose exec php_fpm composer install --optimize-autoloader --no-dev

# Frontend - build production bundle
docker compose exec frontend npm run build
docker compose exec frontend npm start
```

### Security Checklist

- [ ] Change all default passwords
- [ ] Enable HTTPS/SSL
- [ ] Set `APP_DEBUG=false`
- [ ] Configure proper CORS origins
- [ ] Set secure session cookies
- [ ] Enable rate limiting
- [ ] Set up firewall rules
- [ ] Regular backups configured
- [ ] Update dependencies regularly

---

## 📝 Additional Resources

- **Laravel Documentation**: https://laravel.com/docs
- **Next.js Documentation**: https://nextjs.org/docs
- **Tailwind CSS**: https://tailwindcss.com/docs
- **Docker Compose**: https://docs.docker.com/compose/

---

## 🆘 Getting Help

If you encounter issues:

1. Check logs: `docker compose logs -f`
2. Review this guide carefully
3. Check Laravel logs: `backend/storage/logs/laravel.log`
4. Open an issue in the repository

---

**Last Updated**: January 2026
**Version**: 1.0.0
