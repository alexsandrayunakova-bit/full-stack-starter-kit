# 🐳 Docker Setup Guide

This project now runs completely in Docker containers. No need to install PHP, Composer, Node.js, or npm locally!

## ✅ Prerequisites

- Docker Desktop installed and running (✓ You already have this!)

## 🚀 Quick Start

### Start Everything

Open your terminal in Cursor and run:

```bash
docker compose up
```

This will:
- ✅ Install all PHP dependencies (Composer)
- ✅ Install all Node.js dependencies (npm)
- ✅ Set up SQLite database
- ✅ Run Laravel migrations
- ✅ Start backend server on http://localhost:8001
- ✅ Start frontend server on http://localhost:3000

**First time setup takes 2-3 minutes. Subsequent starts are much faster!**

### Stop Everything

Press `Ctrl+C` in the terminal, or in a new terminal:

```bash
docker compose down
```

### View Logs

If you want to see what's happening:

```bash
docker compose logs -f
```

Press `Ctrl+C` to stop viewing logs.

### View Backend Logs Only

```bash
docker compose logs -f backend
```

### View Frontend Logs Only

```bash
docker compose logs -f frontend
```

### Restart Services

```bash
docker compose restart
```

## 🌐 Access Your Application

- **Frontend (Next.js)**: http://localhost:3000
- **Backend API (Laravel)**: http://localhost:8001

## 🔧 Running Laravel Commands

If you need to run artisan commands:

```bash
docker compose exec backend php artisan migrate
docker compose exec backend php artisan cache:clear
docker compose exec backend php artisan route:list
```

## 📦 Installing New Packages

### Backend (Laravel/PHP)

```bash
docker compose exec backend composer require package-name
```

### Frontend (Next.js/Node)

```bash
docker compose exec frontend npm install package-name
```

## 🧹 Clean Restart

If something goes wrong, you can do a clean restart:

```bash
docker compose down
docker compose up --build
```

## 💡 Tips

- **Leave Docker Desktop running** - it needs to be open for containers to work
- **First startup is slow** - Docker downloads images and installs dependencies
- **Subsequent startups are fast** - everything is cached
- **Database persists** - your SQLite database stays even when you stop containers
- **Code changes are instant** - both Laravel and Next.js will hot-reload when you edit files

## 🆘 Troubleshooting

### "Port already in use"

If you get port errors, stop any local Laravel or Next.js servers first:

```bash
# Kill any process on port 8001
lsof -ti:8001 | xargs kill -9

# Kill any process on port 3000
lsof -ti:3000 | xargs kill -9
```

Then try `docker compose up` again.

### "Cannot connect to Docker daemon"

Make sure Docker Desktop is running. You should see the Docker icon in your menu bar.

### Fresh Start

To completely reset everything (⚠️ This will delete your database):

```bash
docker compose down -v
docker compose up
```

---

## 🎯 Your Login Credentials

- **Email**: alex.sandra.yunakova@gmail.com
- **Password**: Sandra1991

Access the admin panel at: http://localhost:3000/admin

---

**That's it! Everything should now work on your Mac, Windows, or any system with Docker!** 🎉
