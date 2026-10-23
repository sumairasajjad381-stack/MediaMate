# InstaArchiver 🚀

A high-throughput, security-hardened Instagram media extraction, processing, and archival system built with **Next.js (App Router)**, **TypeScript**, **Prisma ORM**, and **Tailwind CSS**.

---

## 🌟 Key Features

- **Guest Ready (Zero Friction)**: Instant download of Instagram Reels, Posts, Carousels, and Stories without requiring an account.
- **Optional Cloud Archival**: Optional user registration and authentication (salted bcrypt password hashing + secure HTTP-only JWT sessions) to organize saved media into personal libraries.
- **Carousel & Multi-Slide Support**: Automatically discovers and separates all items in a carousel post for individual or batch downloading.
- **On-The-Fly Batch Zip Archiving**: Streamed compression (`archiver`) allows one-click downloading of multiple assets in a `.zip` without storing temporary zip files on the host disk.
- **Storage Driver Abstraction**:
  - `LocalStorageDriver` out-of-the-box (zero external cloud dependencies for local dev).
  - Drop-in `S3StorageDriver` for production deployments on AWS S3, Cloudflare R2, or MinIO.
- **Content-Addressable Storage (SHA-256 Deduplication)**: Automatically calculates cryptographic hashes to prevent duplicate media files from consuming redundant storage.
- **Resilient Multi-Tier Scraper**:
  1. Internal Instagram JSON/GraphQL endpoints with browser impersonation headers.
  2. Fallback HTML script/OpenGraph meta parsing.
  3. Official oEmbed API fallback.
  4. Optional authenticated scraping via `.env` session cookies for age-restricted / private posts.

---

## 🔒 Security Architecture

1. **SSRF Mitigation**: Strict validation whitelist ensures outgoing extraction requests can *only* resolve to legitimate Instagram domains (`instagram.com`, `instagr.am`), preventing internal network scans.
2. **Zero-Trust Input Validation**: 100% of API endpoints enforce strict Zod schemas against input manipulation and parameter tampering.
3. **Password Security**: Passwords hashed with `bcryptjs` using 12 salt rounds; minimum complexity requirements enforced.
4. **No Hardcoded Secrets**: All keys, database credentials, and secrets are strictly read from validated environment variables (`src/lib/config.ts`), failing fast on startup if misconfigured.
5. **Rate Limiting**: Integrated token bucket rate limiter protects against abusive request spikes and IP throttling.

---

## 📁 Codebase Organization

```
├── prisma/
│   └── schema.prisma         # Database schema (User, DownloadJob, MediaFile, Collection)
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   ├── auth/         # Register, Login, Me, Logout endpoints
│   │   │   ├── extract/      # Metadata preview endpoint
│   │   │   ├── archive/      # Media download and archival endpoint
│   │   │   ├── media/        # Stream single file & on-the-fly batch zip endpoint
│   │   │   └── history/      # Download history & pagination
│   │   ├── globals.css       # Tailwind & custom Instagram dark UI styles
│   │   ├── layout.tsx        # Root HTML layout
│   │   └── page.tsx          # Main interactive dashboard
│   ├── components/
│   │   ├── Navbar.tsx        # Top navigation & user session badge
│   │   ├── MediaExtractorForm.tsx # Input box with clipboard paste & error feedback
│   │   ├── MediaPreviewCard.tsx   # Live media preview, author details, slide switcher
│   │   ├── DownloadHistoryList.tsx# Media library table & batch zip downloader
│   │   └── AuthModal.tsx     # Sign In & Registration modal
│   └── lib/
│       ├── config.ts         # Type-safe validated environment variables
│       ├── db.ts             # Prisma client singleton
│       ├── errors.ts         # Standard AppError hierarchy
│       ├── logger.ts         # Structured JSON logger
│       ├── rate-limiter.ts   # In-memory token bucket rate limiter
│       ├── extractor/        # URL parser, multi-tier scraper, and downloader
│       ├── security/         # Auth, SSRF prevention, XSS sanitation, Zod schemas
│       └── storage/          # StorageDriver interface, local & S3 implementations
├── storage/                  # Local media files directory (gitignored)
└── tests/                    # Vitest unit & integration test suite
```

---

## 🛠️ Quick Start & Setup

### Prerequisites
- Node.js 18+ (tested on Node v20/v22)
- npm or pnpm

### 1. Clone & Install Dependencies
```bash
git clone <repo-url>
cd "insta folder"
npm install
```

### 2. Configure Environment
Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```
Default `.env` settings work out of the box with SQLite and Local Storage.

### 3. Initialize Database
Push the Prisma schema to create the local SQLite database:
```bash
npm run db:push
```

### 4. Run Tests
Verify all flows, security guards, and parser edge cases:
```bash
npm test
```

### 5. Launch Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🧪 Testing Suite

Tests are built with **Vitest**:
- `tests/parser.test.ts` (7 tests: Posts, Reels, plural reels, Stories, SSRF domains, malicious schemes)
- `tests/security.test.ts` (6 tests: Bcrypt hashing, JWT generation/tamper verification, host whitelisting, XSS escaping)
- `tests/rate-limiter.test.ts` (3 tests: Bucket consumption, 429 quota exhaustion, multi-IP isolation)
- `tests/validator.test.ts` (7 tests: Strict Zod schema boundaries and validation error cases)
- `tests/storage.test.ts` (1 test: Streaming writes, SHA-256 calculation, deletion)

Run all tests:
```bash
npm test
```
