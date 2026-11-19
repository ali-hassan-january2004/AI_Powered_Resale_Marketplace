# AI-Powered Resale Marketplace

A full-stack web platform for buying and selling second-hand fashion, where AI helps sellers create listings and price items, and helps buyers find what they want.

![Status](https://img.shields.io/badge/status-in%20development-orange)
![Phase](https://img.shields.io/badge/phase-2%20backend-blue)
![Stack](https://img.shields.io/badge/stack-MERN%20%2B%20FastAPI-green)

---

## Overview

This is a consumer-to-consumer (C2C) marketplace for second-hand clothing and accessories. It supports three roles (buyer, seller, admin) and is built in phases: a complete working web store first, then an AI layer on top.

**Planned AI features:** photo-to-listing, price suggestion, condition grading, semantic search, similar items, and fake/duplicate detection.

## Project Status

| Phase | Scope | Status |
|-------|-------|--------|
| 0 | Setup and planning | Done |
| 1 | Frontend (React), built against the planned API contract | Code complete, awaiting backend to test end to end |
| 2 | Backend (Node.js / Express) | In progress |
| 3 | Database (MongoDB) and integration | Planned |
| 4 | AI service (Python / FastAPI) | Planned |
| 5 | Testing, deployment, documentation | Planned |

## Tech Stack

| Layer | Technology |
|-------|------------|
| Frontend | React 18, Vite, React Router, Redux Toolkit, Tailwind CSS, React Hook Form, Zod, Axios, Recharts |
| Backend | Node.js, Express, Mongoose, JWT, bcrypt, Zod, Multer, Jest + Supertest |
| Database | MongoDB Atlas *(Phase 3)* |
| AI service | Python, FastAPI, PyTorch, CLIP, FAISS, XGBoost *(Phase 4)* |
| Storage | Cloudinary |

## Features

**Buyers**
- Browse, search, filter, and sort listings (filters are kept in the URL, so links can be shared)
- Listing detail page with image gallery, similar items, and reporting
- Cart, wishlist, and checkout (simulated payment: cash on delivery or test card)
- Order history, tracking timeline, cancellation, and seller reviews
- In-app notifications

**Sellers**
- Become a seller from the account page
- Create and manage listings with multi-image upload, cover selection, and drafts
- Seller dashboard with earnings, sales chart, and most-viewed items
- Incoming orders with status updates (confirm, ship, deliver)
- Shop settings and public seller profile

**Admins**
- Dashboard with platform totals
- Block or unblock users
- Remove listings with a reason (the seller is notified)
- Manage categories and handle user reports

**AI (Phase 4)**
- Photo to listing draft, price suggestion, condition grading
- Semantic search and similar items
- Fake and duplicate detection
- The app always works without AI: suggestions are optional and editable

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) LTS (v18 or higher)
- npm
- Git
- A [MongoDB Atlas](https://www.mongodb.com/atlas) cluster (or a local MongoDB running as a replica set, required for transactions)
- A [Cloudinary](https://cloudinary.com/) account (image uploads)
- Python 3.10+ (only for the AI service, Phase 4)

### 1. Clone the repository

```bash
git clone https://github.com/ali-hassan-january2004/AI_Powered_Resale_Marketplace
cd AI_Powered_Resale_Marketplace
```

### 2. Run the backend

```bash
cd backend
npm install

# Create your environment file (it is git-ignored) and fill in real values
cp .env.example .env

# Start the API with auto-reload
npm run dev
```

The API runs at **http://localhost:5000/api**.

| Script | Description |
|--------|-------------|
| `npm run dev` | Start the API with nodemon |
| `npm start` | Start the API with Node |
| `npm run seed` | Recreate the demo database (Phase 3) |
| `npm test` | Run Jest + Supertest tests |
| `npm run lint` | Run ESLint |

### 3. Run the frontend

```bash
cd frontend
npm install

# Create your environment file (it is git-ignored)
cp .env.example .env

# Start the development server
npm run dev
```

The app runs at **http://localhost:5173**. Pages that load data show an error banner until the backend is running, because the frontend calls the real API contract from the SRS.

See [`frontend/README.md`](frontend/README.md) for scripts, structure, and conventions.

### 4. Run the AI service (Phase 4)

The AI service is optional at runtime. If it is not running, the marketplace works normally and sellers fill the listing form by hand.

```bash
cd ai-service

# Create and activate a virtual environment
python -m venv .venv
# Windows:
.venv\Scripts\activate
# macOS / Linux:
# source .venv/bin/activate

pip install -r requirements.txt

# Create your environment file (it is git-ignored)
cp .env.example .env

# Start the service
uvicorn app.main:app --reload --port 8000
```

The service runs at **http://localhost:8000** (health check: `GET /health`). Interactive docs are at `/docs`.

### Run all three services together (Windows)

After installing each service's dependencies using the steps above, stop any individually running dev servers. From the repository root, install the process runner once and start all services:

```powershell
npm.cmd install
npm.cmd run dev
```

This starts the backend, frontend, and AI service together. Press `Ctrl+C` to stop them. The AI service currently provides a health endpoint only; its AI features are not implemented yet.

## Project Structure

```
.
├── frontend/              React app (Phase 1)
│   └── src/
│       ├── api/               Axios client and one file per API resource
│       ├── app/               Store, routes, route paths
│       ├── components/        ui/, layout/, listings/, selling/, commerce/,
│       │                      seller/, admin/, reviews/, notifications/
│       ├── features/          Redux slices, selectors, and schemas per feature
│       ├── hooks/             Custom hooks
│       ├── layouts/           Public, auth, seller, and admin layouts
│       ├── pages/             public/, auth/, buyer/, seller/, admin/
│       └── utils/             Helpers
│
├── backend/               Node/Express API (Phase 2)
│   ├── scripts/               seed.js (demo data)
│   ├── docs/                  Postman collection
│   ├── src/
│   │   ├── config/            env, database, Cloudinary, mailer
│   │   ├── constants/         roles, statuses, conditions
│   │   ├── models/            Mongoose schemas (User, Listing, Order, ...)
│   │   ├── routes/            URL to controller mapping
│   │   ├── controllers/       Thin request/response handlers
│   │   ├── services/          Business rules (orders, listings, aiClient, ...)
│   │   ├── middleware/        auth, roles, validation, upload, rate limit, errors
│   │   ├── validators/        Zod schemas per resource
│   │   ├── jobs/              Stale reservation cleanup
│   │   └── utils/             ApiError, asyncHandler, pagination, logger
│   └── tests/                 API, service, and concurrency tests
│
├── ai-service/            FastAPI AI service (Phase 4)
│   ├── app/
│   │   ├── core/              config, internal-token security, logging
│   │   ├── api/routes/        health, analyze, price, embed, search, duplicate
│   │   ├── schemas/           Pydantic request/response models
│   │   ├── models/            Model wrappers (CLIP, condition, price, ...)
│   │   ├── services/          Inference logic and vector index
│   │   └── utils/             Image I/O, EXIF stripping, cache, timing
│   ├── artifacts/             Trained model files (git-ignored)
│   ├── data/                  raw, interim, processed, golden (git-ignored)
│   ├── training/              Data prep, baselines, training and evaluation scripts
│   ├── notebooks/             Experiments
│   ├── model_cards/           One model card per model (M1 to M7)
│   └── tests/
│
├── docs/                  SRS and project documents
└── README.md
```

## Environment Variables

Each project folder has its own `.env.example`. Copy it to `.env` in that same folder and fill in real values. Never commit real `.env` files.

**frontend/.env**

| Variable | Description | Default |
|----------|-------------|---------|
| `VITE_API_URL` | Backend API base URL | `http://localhost:5000/api` |
| `VITE_CURRENCY` | ISO currency code used to format prices | `USD` |
| `VITE_SHIPPING_FEE` | Flat shipping fee shown in the cart | `0` |

**backend/.env**

| Variable | Description | Default |
|----------|-------------|---------|
| `PORT` | API port | `5000` |
| `NODE_ENV` | `development` or `production` | `development` |
| `MONGODB_URI` | MongoDB connection string | local database |
| `JWT_ACCESS_SECRET` | Secret for access tokens | none, required |
| `JWT_REFRESH_SECRET` | Secret for refresh tokens | none, required |
| `ACCESS_TOKEN_TTL` | Access token lifetime | `15m` |
| `REFRESH_TOKEN_TTL` | Refresh token lifetime | `7d` |
| `CLIENT_ORIGIN` | Allowed frontend origin (CORS) | `http://localhost:5173` |
| `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET` | Image storage credentials | none |
| `SMTP_HOST`, `SMTP_USER`, `SMTP_PASS` | Email for password reset | none |
| `AI_SERVICE_URL` | AI service base URL | `http://localhost:8000` |
| `AI_SERVICE_TOKEN` | Shared secret for AI service calls | none, required in Phase 4 |
| `PLATFORM_FEE_PERCENT` | Commission on each sale | `10` |

**ai-service/.env**

| Variable | Description | Default |
|----------|-------------|---------|
| `PORT` | Service port | `8000` |
| `AI_SERVICE_TOKEN` | Must match the backend value | none, required |
| `MODEL_DIR` | Folder with trained model files | `./artifacts` |
| `LOG_LEVEL` | Logging level | `INFO` |

## Roadmap

- [x] Project setup and planning
- [x] Phase 1: React frontend (code complete; end-to-end testing needs the backend)
- [ ] Phase 2: REST API with auth, roles, and orders
- [ ] Phase 3: MongoDB schema, seed data, frontend integration
- [ ] Phase 4: AI models and FastAPI service
- [ ] Phase 5: Testing, deployment, and demo

## Documentation

The full Software Requirements Specification (requirements, architecture, API, data model, and AI plan) is available in [`docs/AI_Resale_Marketplace_SRS.pdf`](docs/AI_Resale_Marketplace_SRS.pdf).

## Contributing

1. Create a feature branch: `git checkout -b feat/<short-name>`
2. Commit with clear messages: `feat: listing card and grid`
3. Push and open a pull request

## Author

**Ali Hassan**
[LinkedIn](https://www.linkedin.com/in/ali-hassan-january2004/) | [GitHub](https://github.com/ali-hassan-january2004)