# AI-Powered Resale Marketplace

A full-stack web platform for buying and selling second-hand fashion, where AI helps sellers create listings and price items, and helps buyers find what they want.

![Status](https://img.shields.io/badge/status-in%20development-orange)
![Phase](https://img.shields.io/badge/phase-1%20frontend-blue)
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
| 2 | Backend (Node.js / Express) | Next |
| 3 | Database (MongoDB) and integration | Planned |
| 4 | AI service (Python / FastAPI) | Planned |
| 5 | Testing, deployment, documentation | Planned |

## Tech Stack

| Layer | Technology |
|-------|------------|
| Frontend | React 18, Vite, React Router, Redux Toolkit, Tailwind CSS, React Hook Form, Zod, Axios, Recharts |
| Backend | Node.js, Express, Mongoose, JWT, bcrypt *(Phase 2)* |
| Database | MongoDB Atlas *(Phase 3)* |
| AI service | Python, FastAPI, PyTorch, CLIP *(Phase 4)* |
| Storage | Cloudinary *(Phase 2)* |

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

### Run the frontend

```bash
# 1. Clone the repository
git clone https://github.com/ali-hassan-january2004/<repo-name>.git
cd <repo-name>

# 2. Install frontend dependencies
cd frontend
npm install

# 3. Create your environment file (it is git-ignored)
cp .env.example .env

# 4. Start the development server
npm run dev
```

The app runs at **http://localhost:5173**. Pages that load data show an error banner until the backend (Phase 2) is running, because the frontend calls the real API contract from the SRS.

See [`frontend/README.md`](frontend/README.md) for scripts, structure, and conventions.

## Project Structure

```
.
├── frontend/          React app (Phase 1)
│   └── src/
│       ├── api/           Axios client and one file per API resource
│       ├── app/           Store, routes, route paths
│       ├── components/    ui/, layout/, listings/, selling/, commerce/,
│       │                  seller/, admin/, reviews/, notifications/
│       ├── features/      Redux slices, selectors, and schemas per feature
│       ├── hooks/         Custom hooks
│       ├── layouts/       Public, auth, seller, and admin layouts
│       ├── pages/         public/, auth/, buyer/, seller/, admin/
│       └── utils/         Helpers
├── backend/           Node/Express API (Phase 2)
├── ai-service/        FastAPI AI service (Phase 4)
├── docs/              SRS and project documents
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

Backend and AI service variables are listed in the SRS (Section 10.4) and will be added in their phases.

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