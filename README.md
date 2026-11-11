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
| 1 | Frontend (React) with mock data | In progress |
| 2 | Backend (Node.js / Express) | Planned |
| 3 | Database (MongoDB) and integration | Planned |
| 4 | AI service (Python / FastAPI) | Planned |
| 5 | Testing, deployment, documentation | Planned |

## Tech Stack

| Layer | Technology |
|-------|------------|
| Frontend | React 18, Vite, React Router, Redux Toolkit, Tailwind CSS, React Hook Form, Zod, Axios |
| Backend | Node.js, Express, Mongoose, JWT, bcrypt *(Phase 2)* |
| Database | MongoDB Atlas *(Phase 3)* |
| AI service | Python, FastAPI, PyTorch, CLIP *(Phase 4)* |
| Storage | Cloudinary *(Phase 2)* |

## Features

**Buyers**
- Browse, search, filter, and sort listings
- Listing detail page with image gallery
- Cart, wishlist, and checkout (simulated payment)
- Order history and tracking

**Sellers**
- Create and manage listings with multi-image upload
- Seller dashboard and incoming orders
- Earnings summary

**Admins** *(after backend)*
- Moderate users, listings, and reports
- Manage categories

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) LTS (v18 or higher)
- npm
- Git

### Installation

```bash
# 1. Clone the repository
git clone https://github.com/<your-username>/<repo-name>.git
cd <repo-name>

# 2. Install frontend dependencies
cd frontend
npm install

# 3. Set up environment variables
cp .env.example .env

# 4. Start the development server
npm run dev
```

The app runs at **http://localhost:5173**.

### Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start the development server |
| `npm run build` | Create a production build |
| `npm run preview` | Preview the production build locally |
| `npm run lint` | Run the linter |

## Project Structure

```
.
├── frontend/          React app (Phase 1)
│   └── src/
│       ├── api/           API client and resource files
│       ├── app/           Store and routes
│       ├── components/    Reusable UI components
│       ├── features/      Redux slices and hooks per feature
│       ├── hooks/         Custom hooks
│       ├── mocks/         Mock data (until the backend exists)
│       ├── pages/         Route-level pages
│       ├── styles/        Tailwind and design tokens
│       └── utils/         Helpers
├── backend/           Node/Express API (Phase 2)
├── ai-service/        FastAPI AI service (Phase 4)
└── README.md
```

## Environment Variables

Copy `.env.example` to `.env` in each project folder. Never commit real `.env` files.

| Variable | Description | Default |
|----------|-------------|---------|
| `VITE_API_URL` | Backend API base URL | `http://localhost:5000/api` |

## Roadmap

- [x] Project setup and planning
- [ ] Phase 1: React frontend with mock data
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

**<Ali Hassan>**
[LinkedIn](https://www.linkedin.com/in/ali-hassan-january2004/) | [GitHub](https://github.com/ali-hassan-january2004)