<<<<<<< HEAD
# OmniManga - Unified Manga, Anime & Light Novel Tracker & Legal Aggregator

OmniManga is a full-stack web application designed for manga, manhwa, manhua, comics, light novel, and anime enthusiasts. It indexes official digital reading/streaming platforms (free & subscription) and physical bookstore shopping links with multi-currency pricing (USD, EUR, JPY, GBP, INR), while maintaining strict anti-piracy compliance.

---

## 🌟 Key Features

1. **Cross-Media Linking (Real-Time AniList GraphQL)**
   - Connects any title across formats: **Manga ↔ Anime ↔ Light Novel**.
   - View streaming platforms (Crunchyroll, Netflix, HIDIVE, etc.) and original light novel publishers.

2. **Compliance & Anti-Trespass Engine**
   - Whitelist-only policy adhering strictly to `robots.txt` and anti-trespass laws.
   - Built-in AdGuard DNS automated protection script.

3. **Multi-Currency Physical Volume Shopping**
   - Real-time price conversion for physical tankōbon and book editions across USD ($), EUR (€), JPY (¥), GBP (£), and INR (₹).

4. **Release Tracker & Notification Engine**
   - Track reading/watching progress and receive visual drop alerts for newly published chapters and episodes.

---

## 🚀 Quick Local Setup

### 1. Backend (FastAPI)
```bash
cd backend
python -m pip install -r requirements.txt
python -m uvicorn app.main:app --host 127.0.0.1 --port 8000 --reload
```

### 2. Frontend (React + Vite)
```bash
cd frontend
npm install
npm run dev
```

Open `http://localhost:5173` in your browser.

---

## 🌐 Free Deployment Guide: Render.com

This repository is pre-configured with a `render.yaml` Blueprint for 1-click deployment on Render's free tier.

### Option A: Automatic Blueprint Deployment (Recommended)

1. **Push to GitHub**:
   ```bash
   git add .
   git commit -m "Initial commit of OmniManga"
   git branch -M main
   git remote add origin https://github.com/<YOUR_USERNAME>/omnimanga.git
   git push -u origin main
   ```

2. **Deploy on Render**:
   - Go to [dashboard.render.com/blueprints](https://dashboard.render.com/blueprints).
   - Click **New Blueprint Instance**.
   - Connect your `omnimanga` GitHub repository.
   - Render will automatically detect `render.yaml` and configure both the FastAPI Backend and the Vite Frontend.
   - Click **Apply**.

---

### Option B: Manual Setup on Render

#### 1. Backend Service (FastAPI)
- **Service Type**: Web Service
- **Name**: `omnimanga-backend`
- **Root Directory**: `backend`
- **Runtime**: Python 3
- **Build Command**: `pip install -r requirements.txt`
- **Start Command**: `uvicorn app.main:app --host 0.0.0.0 --port $PORT`
- **Instance Type**: Free

#### 2. Frontend Service (Vite React)
- **Service Type**: Static Site
- **Name**: `omnimanga-frontend`
- **Root Directory**: `frontend`
- **Build Command**: `npm install && npm run build`
- **Publish Directory**: `dist`
- **Environment Variables**:
  - `VITE_API_URL`: `https://omnimanga-backend.onrender.com` *(Replace with your actual backend URL from step 1)*

---

## 🛠 Tech Stack

- **Backend**: Python 3.11+, FastAPI, Uvicorn, httpx, BeautifulSoup4, Cachetools
- **Frontend**: React 19, Vite, Lucide Icons, Vanilla CSS Design System
- **APIs & Data**: AniList GraphQL API, MangaDex API, Open Library Books API
=======
# Manga_tracker_really
>>>>>>> origin/main
