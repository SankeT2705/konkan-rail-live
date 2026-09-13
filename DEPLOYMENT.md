# 🚀 Konkan Rail Live — Complete Deployment Guide

This guide details multiple production deployment strategies for **Konkan Rail Live**. The project is 100% deployment-ready with configuration files for Docker, Render, Vercel, Netlify, Railway, and traditional Linux VPS servers.

---

## 🏗️ Architecture Overview

| Component | Technology | Role | Port (Default) |
|---|---|---|---|
| **Backend** | Node.js 20, Express, `ws`, Cheerio | Polls Konkan Railway JSP endpoint every 30s, caches in-memory, broadcasts via WebSocket & REST | `3001` |
| **Frontend** | React 19, Vite, TailwindCSS v4, Leaflet | Single Page Application (SPA) with real-time schematic track, Leaflet map, and detail drawer | `5173` (dev) / `80` (prod) |

---

## 🌟 Option 1: Recommended 100% Free Cloud Deployment (Render + Vercel)

This is the easiest and most popular setup for zero-cost hosting.

### Step 1: Deploy the Backend on Render.com

1. Push your repository to GitHub / GitLab.
2. Sign in to [Render.com](https://render.com) and click **New +** ➔ **Web Service**.
3. Connect your Git repository.
4. Configure the service:
   * **Name**: `konkan-rail-backend`
   * **Root Directory**: `backend`
   * **Environment**: `Node`
   * **Build Command**: `npm install && npm run build`
   * **Start Command**: `npm start`
   * **Instance Type**: `Free`
5. Under **Environment Variables**, add:
   * `PORT`: `10000` (Render sets this automatically)
   * `CORS_ORIGIN`: `*` (or your frontend domain once deployed)
   * `SCRAPE_INTERVAL_MS`: `30000`
   * `NODE_ENV`: `production`
6. Click **Create Web Service**. Wait for the build to finish.
7. Note your public backend URL, e.g.:
   ```
   https://konkan-rail-backend.onrender.com
   ```
   Verify it by opening `https://konkan-rail-backend.onrender.com/api/health` in your browser. It should return `{"status":"ok",...}`.

---

### Step 2: Deploy on Vercel (Self-Contained Full-Stack Serverless)

The project includes native Vercel Serverless Functions (`api/trains.ts` and `api/health.ts`). This means **Vercel can host the entire app (Frontend + API Scraper) without needing a separate backend server!**

1. Sign in to [Vercel](https://vercel.com) and click **Add New...** ➔ **Project**.
2. Select your repository.
3. In the project setup screen:
   * **Framework Preset**: `Vite`
   * **Root Directory**: Click `Edit` and select `frontend` (or keep root `./` as both are supported)
   * **Build Command**: `npm run build`
   * **Output Directory**: `dist`
4. **Environment Variables** (Optional):
   * If using the built-in Vercel serverless scraper, **leave `VITE_API_URL` blank / unset**. The app will automatically connect to its own same-origin `/api/trains` endpoint!
   * If you have deployed a persistent WebSocket backend on Render/Railway, set `VITE_API_URL` to your backend URL (e.g. `https://your-custom-backend.onrender.com`). If that external backend is ever sleeping or down, the frontend automatically falls back to same-origin Vercel serverless endpoints.
5. Click **Deploy**.
6. The included `vercel.json` automatically handles client-side SPA routing (`/train/:trainNumber` and `/station/:code`) and serverless API routing (`/api/*`).

---

## ⚡ Option 2: 1-Click Render Blueprint (`render.yaml`)

The repository includes a ready-to-use [`render.yaml`](./render.yaml) blueprint that deploys both backend and frontend simultaneously.

1. Push this repository to GitHub.
2. In [Render Dashboard](https://dashboard.render.com), click **New +** ➔ **Blueprint**.
3. Select this repository.
4. Render will read `render.yaml`, create both services, wire environment variables, and deploy them together.

---

## 🐳 Option 3: Docker & Docker Compose (Any Server / Local)

Deploy both the backend and frontend containers with a single command.

### Prerequisites
* Docker and Docker Compose installed (`docker --version`, `docker compose version`).

### Run the Stack

```bash
# 1. Clone your repo
git clone https://github.com/your-username/konkan-rail-live.git
cd konkan-rail-live

# 2. Build and launch containers in background
docker compose up -d --build

# 3. Check container status
docker compose ps

# 4. View live logs
docker compose logs -f
```

* **Frontend**: Open `http://localhost:80` (or your server's public IP).
* **Backend API**: Accessible at `http://localhost:3001/api/health`.

### Production Docker Environment Variables
To point the frontend container to your public domain, edit `docker-compose.yml` build args:
```yaml
args:
  - VITE_API_URL=https://api.yourdomain.com
  - VITE_WS_URL=wss://api.yourdomain.com/ws/trains
```

---

## 🚂 Option 4: Railway.app Deployment

1. Sign in to [Railway.app](https://railway.app) and create a **New Project**.
2. Deploy from GitHub Repo.
3. Railway detects the root [`Procfile`](./Procfile) and [`package.json`](./package.json).
4. Set environment variables in Railway dashboard:
   * `PORT`: `3001`
   * `NODE_ENV`: `production`
5. Railway provides an automatic SSL `https://...` domain with native WebSocket support.

---

## 🖥️ Option 5: Self-Hosted Linux VPS (Ubuntu / Debian + Nginx + SSL)

For maximum performance on your own VPS (DigitalOcean, AWS EC2, Hetzner, Linode):

### 1. Install Node.js 20 & Nginx

```bash
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs nginx certbot python3-certbot-nginx
```

### 2. Clone & Build the Application

```bash
cd /var/www
sudo git clone https://github.com/your-username/konkan-rail-live.git
cd konkan-rail-live
sudo npm install
sudo npm run build
```

### 3. Create a systemd Service for Backend

Create `/etc/systemd/system/konkan-rail.service`:
```ini
[Unit]
Description=Konkan Rail Live Backend Service
After=network.target

[Service]
Type=simple
User=www-data
WorkingDirectory=/var/www/konkan-rail-live/backend
ExecStart=/usr/bin/npm start
Restart=always
RestartSec=10
Environment=NODE_ENV=production
Environment=PORT=3001

[Install]
WantedBy=multi-user.target
```

Enable and start the service:
```bash
sudo systemctl daemon-reload
sudo systemctl enable konkan-rail
sudo systemctl start konkan-rail
sudo systemctl status konkan-rail
```

### 4. Configure Nginx Reverse Proxy with WebSocket Support

Create `/etc/nginx/sites-available/konkan-rail`:
```nginx
server {
    listen 80;
    server_name yourdomain.com api.yourdomain.com;

    # Frontend Static SPA
    location / {
        root /var/www/konkan-rail-live/frontend/dist;
        index index.html;
        try_files $uri $uri/ /index.html;
    }

    # Backend REST API
    location /api/ {
        proxy_pass http://127.0.0.1:3001/api/;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    # Backend WebSocket
    location /ws/ {
        proxy_pass http://127.0.0.1:3001/ws/;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "Upgrade";
        proxy_set_header Host $host;
        proxy_read_timeout 86400s;
        proxy_send_timeout 86400s;
    }
}
```

Enable the site and obtain a free SSL certificate:
```bash
sudo ln -s /etc/nginx/sites-available/konkan-rail /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
sudo certbot --nginx -d yourdomain.com -d api.yourdomain.com
```

---

## 📋 Environment Variables Reference

### Backend (`backend/.env`)

| Variable | Default | Description |
|---|---|---|
| `PORT` | `3001` | HTTP server port |
| `CORS_ORIGIN` | `*` | Allowed CORS origins (e.g. `https://yourdomain.com` or `*`) |
| `SCRAPE_INTERVAL_MS` | `30000` | Scrape frequency in milliseconds (30 seconds) |
| `UPSTREAM_URL` | `https://konkanrailway.com/VisualTrain/otrktp0100Table.jsp` | Konkan Railway live table endpoint |
| `NODE_ENV` | `development` | Environment mode (`production` / `development`) |
| `CONTACT_EMAIL` | `sanketbobhate07@gmail.com` | Contact email for HTTP User-Agent header |

### Frontend (`frontend/.env`)

| Variable | Default | Description |
|---|---|---|
| `VITE_API_URL` | `http://localhost:3001` | Public backend HTTP/REST URL |
| `VITE_WS_URL` | Derived from `VITE_API_URL` | Public backend WebSocket endpoint (e.g. `wss://api.yourdomain.com/ws/trains`) |

---

## 🛠️ Verification & Health Checks

Once deployed, verify your live instances:

1. **Backend Health Check**:
   ```bash
   curl https://your-backend-domain/api/health
   # Expected: {"status":"ok","stale":false,"trainCount":27,...}
   ```
2. **Backend Live Trains JSON**:
   ```bash
   curl https://your-backend-domain/api/trains
   # Expected: {"success":true,"data":[...],"stale":false,...}
   ```
3. **Frontend In-Browser Verification**:
   * Open your frontend domain.
   * Verify the top header displays the glowing green dot: `Live`.
   * Verify trains animate along the track and Leaflet map.
   * Click any train: verify the slide-over drawer displays accurate Origin ➔ Destination distance progress and punctuality metrics.
