# 🚂 Konkan Rail Live — Real-Time Train Tracker

A full-stack, real-time train tracking web application for the scenic Konkan Railway route (**Roha → Surathkal / Thokur, ~738 km, 70 stations**).

It features an independent scraper and cache backend paired with a modern React + TypeScript frontend that leapfrogs the official Konkan Railway site in design, responsiveness, and UX.

---

## 📸 Features

- **Real-Time Position Tracking**: Live train positions updated automatically every 30 seconds.
- **Interactive Schematic Track View**: Horizontal scrollable track with all 70 stations, state borders (Maharashtra, Goa, Karnataka), and smooth train marker animations.
- **Geographic Map View**: Interactive Leaflet coastal route map with station pins and live moving train markers.
- **Instant Search & Filter**: Filter by train number, train name, station name, category (Express, Superfast, Passenger, Premium), direction (Northbound / Southbound), and delayed trains.
- **Slide-Over Train Detail Panel**: Live delay calculation, current station, schedule vs actual timing, route progress bar, and delay trend sparkline.
- **Bilingual (English / Hindi)**: Instant UI and station localization toggle.
- **Dark / Light / High-Contrast Themes**: Curated modern themes tailored for high legibility.
- **Deep Linking**: Shareable links for individual trains (`/train/:trainNumber`) and stations (`/station/:code`).
- **Resilient Connectivity**: Live WebSocket real-time updates with automatic reconnection and instant REST initial loading fallback.

---

## 🛠️ Architecture

```
KR/
├── backend/                  # Node.js + Express + WebSocket + Cheerio scraper
│   ├── src/
│   │   ├── index.ts          # Server bootstrap (Express + WS on /ws/trains)
│   │   ├── scrapeService.ts  # Cheerio scraper, 30s cron, diffing & WS broadcast
│   │   ├── cache.ts          # In-memory snapshot cache & delay history store
│   │   ├── stations.ts       # Static 70-station dataset (km, lat/lng, codes)
│   │   ├── routes/           # REST endpoints (/api/health, /api/trains, /api/stations)
│   │   └── types.ts          # Shared TypeScript models
│   ├── fixtures/sample.html  # Upstream fixture for unit tests
│   └── tests/parser.test.ts  # Vitest test suite
│
├── frontend/                 # React 19 + Vite + TypeScript + Tailwind CSS v4
│   ├── src/
│   │   ├── App.tsx           # Main application shell with routing
│   │   ├── components/       # Header, Footer, TrackView, MapView, TrainDetail, SearchBar
│   │   ├── store/            # Zustand train store
│   │   ├── hooks/            # useWebSocket (with instant REST fallback)
│   │   ├── i18n/             # English and Hindi dictionary
│   │   └── data/stations.ts  # 70 stations static coordinates & metadata
│   └── vercel.json           # SPA rewrites & caching rules
│
├── dev.js                    # Cross-platform local runner
└── package.json              # Monorepo root scripts
```

---

## 🚀 How to Run Locally

### Prerequisites
- Node.js 18+ (tested on Node v20 & v22)
- npm 9+

### Option 1: Run Everything Together (Recommended)
From the project root directory:

```bash
# 1. Install dependencies (if not already installed)
cd backend && npm install
cd ../frontend && npm install
cd ..

# 2. Start both backend and frontend concurrently
npm run dev
```

- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:3001
- **API Health Check**: http://localhost:3001/api/health

---

### Option 2: Run Separately in Two Terminals

#### Terminal 1 — Backend:
```bash
cd backend
npm run dev
```

#### Terminal 2 — Frontend:
```bash
cd frontend
npm run dev
```

---

## 🧪 Running Tests & Builds

```bash
# Run backend vitest parser unit tests
npm test

# Build both backend and frontend for production
npm run build
```

---

## 🌐 Production Deployment

The project is fully configured and deployment-ready across cloud providers and Docker:

* **Complete Step-by-Step Guide**: See [`DEPLOYMENT.md`](./DEPLOYMENT.md) for full instructions covering Render, Vercel, Railway, Docker, and Linux VPS.
* **1-Click Render Blueprint**: [`render.yaml`](./render.yaml) automatically provisions both backend web service and frontend static site.
* **Docker & Docker Compose**: Run `docker compose up -d --build` to deploy the entire production stack locally or on any cloud server.
* **SPA Routing Fallbacks**: Pre-configured for Vercel ([`vercel.json`](./frontend/vercel.json)), Netlify/Cloudflare ([`_redirects`](./frontend/public/_redirects)), and Nginx ([`nginx.conf`](./frontend/nginx.conf)).

### Quick Cloud Setup (Free Tier):
1. **Backend on Render**: Web Service, Root Directory: `backend`, Build: `npm install && npm run build`, Start: `npm start`.
2. **Frontend on Vercel**: Root Directory: `frontend`, Framework: `Vite`, Build: `npm run build`, Output: `dist`.
3. Set `VITE_API_URL` on Vercel to your Render URL. (WebSocket `wss://` is auto-derived).

---

## ⚖️ Legal & Disclaimer

> **Unofficial Project**: This project is not affiliated with, endorsed by, or sponsored by Konkan Railway Corporation Ltd. (KRCL) or Indian Railways. Live data is scraped from publicly accessible pages on a best-effort basis and may be delayed or inaccurate. Always verify with official Indian Railways channels (e.g., NTES / IRCTC) before travel.
