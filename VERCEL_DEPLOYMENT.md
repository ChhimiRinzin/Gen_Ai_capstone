# RoadSentry AI — Vercel Production Deployment Guide 🇧🇹
### Intelligent Road Safety & Infrastructure Audit Intelligence Platform for Bhutan

This document provides exact, battle-tested instructions for deploying the **RoadSentry AI** platform to **Vercel** with zero-database session security and server-side Groq AI API protection.

---

## 1. Architecture Overview on Vercel

RoadSentry AI is engineered for high-performance, edge-optimized execution:
- **Frontend Layer:** High-performance React 19 SPA bundled with Vite, served via Vercel’s global Edge CDN.
- **Serverless API Layer (`/api/*`):**
  - `/api/health`: System health diagnostic probe returning operational readiness.
  - `/api/groq`: Server-side proxy for Groq `llama-3.3-70b-versatile` and `llama-3.2-11b-vision-preview`, ensuring `GROQ_API_KEY` is **never exposed** in client bundles.
- **AI Inference:** Browser-side WebAssembly / Canvas computer vision pipeline (Laplacian blur variance, Canny structural edge detection, CLAHE enhancement, and YOLOv8 RDD2022 bounding-box scoring).
- **Session Architecture:** 100% ephemeral in-memory state. Strictly zero persistent database (no SQLite, PostgreSQL, MongoDB, or Firebase).

---

## 2. Prerequisites
1. A **GitHub account** (https://github.com).
2. A **Vercel account** (https://vercel.com) — Free Hobby plan is 100% compatible.
3. An optional **Groq API key** from https://console.groq.com/keys (the application includes built-in grounded fallbacks if omitted).

---

## 3. Step-by-Step GitHub & Vercel Deployment

### Step 1: Push Project to GitHub
In your local terminal or GitHub Codespaces:
```bash
# Initialize git if not already present
git init
git add .
git commit -m "feat: RoadSentry AI Vercel production readiness"

# Create a new repository on GitHub (e.g. roadsentry-ai) and link it
git branch -M main
git remote add origin https://github.com/<YOUR_GITHUB_USERNAME>/roadsentry-ai.git
git push -u origin main
```

### Step 2: Import into Vercel
1. Log in to [Vercel Dashboard](https://vercel.com/dashboard).
2. Click **Add New... > Project**.
3. Select your `roadsentry-ai` GitHub repository and click **Import**.

### Step 3: Project Configuration Settings
Verify the detected settings match:
- **Framework Preset:** `Vite` (automatically detected from `vercel.json`).
- **Root Directory:** `./` (leave default repository root).
- **Build Command:** `npm run build`
- **Output Directory:** `dist`
- **Install Command:** `npm install`

### Step 4: Configure Environment Variables
Under the **Environment Variables** section, add:
| Variable Name | Value | Purpose |
|:---|:---|:---|
| `GROQ_API_KEY` | `gsk_...` | Your secret Groq API key for server-side inference |
| `GROQ_TEXT_MODEL` | `llama-3.3-70b-versatile` | Text reasoning and audit assistant model |
| `GROQ_VISION_MODEL` | `llama-3.2-11b-vision-preview` | Multimodal road inspection vision model |
| `NODE_ENV` | `production` | Production environment flag |

> **Security Note:** Never prefix server-side keys with `NEXT_PUBLIC_` or `VITE_`. Vercel serverless functions in `/api/` access `process.env.GROQ_API_KEY` securely without client exposure.

### Step 5: Click Deploy
1. Click **Deploy**.
2. Vercel will install dependencies, compile the TypeScript bundle (`vite build`), and deploy the `/api/` serverless functions in ~45 seconds.
3. Once complete, you will receive a public production URL (e.g., `https://roadsentry-ai.vercel.app`).

---

## 4. Post-Deployment Verification Workflow

Once deployed, verify the live platform using this sequence:

1. **System Health Verification:**
   - Open your deployed Vercel URL.
   - Click the **Gear icon (Settings)** in the top right.
   - Inspect the **Vercel Production & Engine Diagnostics** card:
     - Frontend Engine: `React 19 / Vite`
     - Server Groq Proxy: `Server Key Active` (or `Fallback Mode` if key wasn't set)
     - YOLO RDD2022: `Ready (WASM)`
     - Persistent DB: `Zero DB (Secure Session)`

2. **Test Real Road Hazard Detection (AI Road Inspector):**
   - Click **AI Road Inspector** in the top navigation.
   - Select a Bhutan scenario (e.g., *Chukha PNH-1 Lifeline Highway* or *Dochula Pass PNH-2*).
   - Verify that:
     - Laplacian blur score and brightness metrics calculate in real-time.
     - Canny structural edge fractures render on canvas.
     - YOLO bounding boxes detect `D40 Pothole` or `D20 Alligator Crack`.
     - Multi-Factor Risk Score calculates with mathematical factor breakdown.

3. **Test Infrastructure Audit & 5C Finding Generation:**
   - Navigate to **Infrastructure Audit**.
   - Under *Criteria vs Condition*, compare the active inspection against *DoST Standard Spec Clause 402.3*.
   - Click **Synthesize Structured 5C Audit Finding**.
   - Verify that the 5 sections appear: *Criteria, Condition, Cause (with mandatory unverified notice), Consequence, and Corrective Action*.
   - Modify the auditor verification status and save changes.

4. **Test Bhutan Hazard Map:**
   - Navigate to **Bhutan Hazard Map**.
   - Verify that Leaflet tiles load with incident pins centered on Bhutan (`[27.5142, 90.4336]`).
   - Click a marker to inspect details, risk level, and GPS coordinates.

5. **Test Report Dossier Exports:**
   - Navigate to **AI Reports**.
   - Test **Print / Save PDF**, **Export DOCX/MD**, **Export CSV**, and **Full Session JSON**.
   - Verify that exported documents feature the mandatory audit disclaimer:
     `"AI-Assisted Draft Audit Report — Subject to Professional Auditor Review."`

---

## 5. Troubleshooting & FAQ

### Issue 1: Groq calls return "Fallback Mode"
- **Cause:** `GROQ_API_KEY` was not configured or has not been deployed to Vercel production.
- **Fix:** In Vercel, navigate to **Settings > Environment Variables**, add `GROQ_API_KEY`, then trigger a redeploy (**Deployments > ... > Redeploy**).

### Issue 2: Request Entity Too Large (413)
- **Cause:** Uploading massive 4K raw video directly to API routes.
- **Fix:** RoadSentry AI extracts frames browser-side on HTML5 canvas before transmission, staying well within Vercel's 4.5MB serverless payload limit.

### Issue 3: Map rendering issues on mobile
- **Fix:** RoadSentry AI uses responsive Leaflet containers with relative dimensions and touch pan/zoom support.
