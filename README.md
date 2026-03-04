# Planzo 🌿

**Location-aware event discovery and ticketing MVP** — React · Node · Postgres/PostGIS · Stripe

[![CI Pipeline](https://img.shields.io/badge/Jenkins-CI%2FCD-green?style=flat-square&logo=jenkins)](./Jenkinsfile)
[![Docker](https://img.shields.io/badge/Docker-Ready-mint?style=flat-square&logo=docker)](./Dockerfile)

---

## ✦ Features

| Module | Description |
|--------|-------------|
| **01 Account Management** | Multi-role auth: Attendee, Organizer, Finance, Marketing, Admin |
| **02 Booking & Transactions** | Event discovery, ticket purchase, Stripe checkout, booking history |
| **03 Organizer Tools** | Create/manage events, attendee management, revenue charts |
| **04 Marketing** | Featured listings, email/push campaigns, personalization |
| **05 Finance** | Revenue ledger, commission tracking, organizer payouts |
| **06 Analytics** | KPIs, area/pie/line charts, engagement metrics, campaign performance |

---

## 🚀 Quick Start

```bash
# 1. Clone
git clone https://github.com/your-github-username/planzo.git
cd planzo

# 2. Install dependencies
npm install

# 3. Set environment variables
cp .env.example .env
# Fill in your VITE_GOOGLE_MAPS_API_KEY and VITE_STRIPE_PUBLISHABLE_KEY

# 4. Start database (PostGIS)
docker-compose up -d

# 5. Run frontend dev server
npm run dev
```

Open **http://localhost:5173**

---

## 🛣 Routes

| Path | Page | Module |
|------|------|--------|
| `/` | Event Discovery | Booking |
| `/events/:id` | Event Detail + Ticket Selector | Booking |
| `/checkout` | Checkout (Stripe UI) | Booking |
| `/my-tickets` | My Tickets & QR Codes | Booking |
| `/organizer` | Organizer Dashboard | Organizer Tools |
| `/analytics` | Analytics Dashboard | Analytics |
| `/admin` | Finance Dashboard | Finance |
| `/marketing` | Marketing Hub | Marketing |
| `/login` | Sign In | Account |
| `/register` | Sign Up | Account |

---

## 🔑 Demo Accounts

Login at `/login` with any of the demo accounts (any password):

| Email | Role |
|-------|------|
| `alex@planzo.io` | Attendee |
| `sam@planzo.io` | Organizer |
| `jordan@planzo.io` | Admin |
| `taylor@planzo.io` | Finance |
| `morgan@planzo.io` | Marketing |

---

## 🏗 Tech Stack

- **Frontend**: React 18 · Vite · Tailwind CSS v4 · Recharts · React Router v7 · Radix UI
- **Backend** (scaffold): Node.js · Express · Prisma · Postgres/PostGIS
- **Payments**: Stripe (UI ready)
- **Maps**: Google Maps API placeholder (PostGIS-ready schema)
- **CI/CD**: Jenkins (8-stage pipeline) · Docker · nginx
- **Database**: PostgreSQL + PostGIS (via Docker Compose)

---

## ⚙️ Jenkins Pipeline

```
Checkout → Install → Lint → TypeCheck → Test → Build → Docker Build → Deploy (Staging/Prod)
```

Branch rules:
- `develop` → Deploy Staging
- `main` → Deploy Production

---

## 🐳 Docker

```bash
# Build and run
docker build -t planzo-web .
docker run -p 80:80 planzo-web
```

---

## 📄 License

MIT © 2026 Planzo