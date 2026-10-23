# MediaMate — Free Multi-Platform Media Toolkit 🚀

MediaMate is an ethical, high-performance, and compliant media toolkit built with **Next.js (App Router)**, **TypeScript**, and **Tailwind CSS**. Designed from the ground up for a **$0 budget**, MediaMate operates strictly with permitted official endpoints (such as public oEmbed specifications) and direct media probing without fragile, unauthorized scraping hacks.

---

## 🌟 Supported Features & Platform Policies

| Platform / Tool | Supported Features | Legal & Technical Method | Notes |
| :--- | :--- | :--- | :--- |
| **Direct Media Files** | Size detection, MIME probe, preview & streaming download | HTTP `HEAD` & `GET` Streaming | Supports `.mp4`, `.webm`, `.png`, `.jpg`, `.mp3` up to 100 MB. |
| **YouTube** | Title, author, privacy embed player, max-res thumbnail | Official YouTube oEmbed API | Direct video stream extraction is not permitted under YouTube Developer Terms. |
| **TikTok** | Title, author, authorized preview embed, thumbnail | Official TikTok oEmbed API | Watermark bypass/raw ripping is prohibited. |
| **Instagram** | Creator attribution, preview, thumbnail | Official Instagram oEmbed API | Public posts only; private accounts are not accessed. |
| **Pinterest & Facebook** | Transparent status disclosure | Labeled as Unsupported | Requires paid commercial partner credentials ($0 budget limitation). |

---

## 🔒 Security & Safe Operation

1. **Zero Fake Functionality**: MediaMate never creates fake download buttons or invented metadata. If an action is not genuinely supported, it is clearly explained.
2. **SSRF Protection (`lib/validation/ssrf.ts`)**: Rejects requests targeting `localhost`, loopbacks, private IPv4 subnets (`10.0.0.0/8`, `172.16.0.0/12`, `192.168.0.0/16`), cloud instance metadata endpoints (`169.254.169.254`), and unsafe protocols (`ftp:`, `file:`, `javascript:`).
3. **No Private Cookies or Passwords**: The app never prompts users for their social media passwords or session tokens.
4. **$0 Budget & Browser-Only History**: MediaMate stores your recent link history strictly in your browser's local `localStorage`. No server database is required.

---

## 📁 Modular Adapter Architecture

```
src/
├── lib/
│   ├── validation/
│   │   └── ssrf.ts              # High-security SSRF & private IP blocker
│   └── platforms/
│       ├── types.ts             # Unified MediaInspectResult & IPlatformAdapter interfaces
│       ├── direct.ts            # Direct media file prober & streaming adapter
│       ├── youtube.ts           # Official YouTube oEmbed adapter
│       ├── tiktok.ts            # Official TikTok oEmbed adapter
│       ├── instagram.ts         # Official Instagram oEmbed adapter
│       ├── unsupported.ts       # Honest transparent handler for restricted platforms
│       └── index.ts             # Platform detector and inspection dispatcher
├── app/
│   ├── api/media/
│   │   ├── inspect/route.ts     # POST /api/media/inspect
│   │   └── download/route.ts    # GET /api/media/download (streaming proxy for permitted files)
│   ├── privacy/page.tsx         # Privacy policy page
│   ├── terms/page.tsx           # Terms of service page
│   ├── layout.tsx               # SEO, OpenGraph metadata, and HTML layout
│   └── page.tsx                 # Responsive MediaMate dashboard
└── components/
    ├── Header.tsx               # Brand logo & history button
    ├── HeroSection.tsx          # Headline & value proposition
    ├── MediaInspector.tsx       # URL input with sample links & platform selector
    ├── ResultDisplay.tsx        # Verified media card, genuine preview & actions
    ├── ToolsGrid.tsx            # Available media tools showcase
    ├── HistoryDrawer.tsx        # Client-side local history slide-over
    ├── FAQSection.tsx           # Common beginner questions & legal transparency
    └── Footer.tsx               # Compliance notice & legal links
```

---

## 🛠️ Getting Started ($0 Local Setup)

### 1. Install Dependencies
```bash
npm install
```

### 2. Run Test Suite
MediaMate includes 35 automated tests covering SSRF security guards, direct media inspection, and platform adapters:
```bash
npm test
```

### 3. Run Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) to inspect and preview media links.

---

## 🚀 Free Deployment Guide

MediaMate is designed to deploy for **$0/month** on popular free-tier platforms:

### Option A: Vercel (Recommended)
1. Push your repository to GitHub.
2. Import the project into [Vercel](https://vercel.com).
3. Vercel automatically detects Next.js. Click **Deploy**.
4. Standard Serverless Functions handle `POST /api/media/inspect` and streaming downloads up to Vercel's free limits (10-second timeout, 4.5 MB serverless body limits for direct response streaming).

### Option B: Render or Railway Free Tier
1. Connect your repository.
2. Set build command: `npm run build`.
3. Set start command: `npm start`.
