# Resale: Frontend

React 18 + Vite + Tailwind CSS single-page app for buying and selling second-hand fashion. It talks to the Express API (`VITE_API_URL`). Requirements are in SRS Sections 4 and 9 (`../docs/AI_Resale_Marketplace_SRS.pdf`).

## Run it

```bash
npm install
cp .env.example .env     # then edit the values
npm run dev              # http://localhost:5173
```

| Command | Description |
|---------|-------------|
| `npm run dev` | Start the development server |
| `npm run build` | Create a production build in `dist/` |
| `npm run preview` | Preview the production build locally |
| `npm run lint` | Run the linter |

Restart `npm run dev` after changing `.env`. Vite reads it only at startup.

## Environment variables

`.env` must sit next to `package.json` in this folder. It is git-ignored; `.env.example` is the committed template.

| Name | Purpose | Default |
|---|---|---|
| `VITE_API_URL` | Backend base URL | `http://localhost:5000/api` |
| `VITE_CURRENCY` | ISO currency code | `USD` |
| `VITE_SHIPPING_FEE` | Flat shipping fee shown in the cart (the backend computes the real total) | `0` |

## Working without a backend

The pages call the real API contract (SRS Section 8). Until the backend is running, data pages show an error banner with a "Try again" button. Login, register, and everything behind them need the backend. Use the API docs (Postman or Swagger, Phase 2) as the reference for response shapes.

## Structure

```
src/
  api/          axios client + one file per resource (listings.js, orders.js ...)
  app/          store.js, routes.jsx, routePaths.js
  components/   ui/ (design system), layout/, listings/, selling/, commerce/,
                seller/, admin/, reviews/, notifications/
  features/     Redux slices, selectors and zod schemas per feature
                (auth, cart, wishlist, listings, orders, seller, admin, ...)
  hooks/        useFetch, useAuth, useListingFilters, useDebounce ...
  layouts/      PublicLayout, AuthLayout, SellerLayout, AdminLayout
  pages/        public/, auth/, buyer/, seller/, admin/
  utils/        formatPrice, formatDate, validators, tokenStorage ...
```

## Conventions

- **Styling:** mobile-first Tailwind utility classes. Shared building blocks live in `components/ui` (Button, Input, Modal, Tabs, Pagination, ...).
- **Toasts:** `import { toast } from "./components/ui"` then `toast.success("Saved")` or `toast.error(err.message)`. `<ToastContainer />` is mounted once in `App.jsx`.
- **Data fetching:** `hooks/useFetch` for simple page data. Redux thunks (with caching) for auth, cart, wishlist, notifications, and orders.
- **URL state:** filters, sort, and page live in the URL (`hooks/useListingFilters`), so links are shareable (SRS BRW-04).
- **Auth:** access and refresh tokens are handled in `utils/tokenStorage.js` and `api/axiosClient.js`. The session is restored on load (`initAuth`). Route guards: `ProtectedRoute` (logged in) and `RoleRoute` (seller or admin).
- **Validation:** forms use React Hook Form + Zod. The same rules should be mirrored on the backend (SRS NFR-14).
- **AI features:** the manual listing form always works. AI only adds editable suggestions (SRS 17.3).

## Roles and routes

| Area | Access | Layout |
|------|--------|--------|
| Home, search, category, listing, seller profile | Public | `PublicLayout` |
| Login, register, password reset | Public (redirects if logged in) | `AuthLayout` |
| Cart, checkout, orders, wishlist, account, notifications | Logged in | `PublicLayout` |
| Sell, dashboard, listings, seller orders, settings | Seller or admin | `PublicLayout` / `SellerLayout` |
| Admin overview, users, listings, categories and reports | Admin | `AdminLayout` |

Route paths are defined once in `src/app/routePaths.js`.

## Phase 1 exit criteria (SRS 9.6)

- [x] All Must pages built and responsive
- [x] Reusable component library
- [x] Forms validate; loading, empty, and error states exist
- [x] Routes protected by role
- [ ] Verified end to end against the real API (needs Phase 2)

## Build for production

```bash
npm run build     # output in dist/
```
Deploy `dist/` to static hosting (Vercel, Netlify, or Cloudflare Pages). Set `VITE_API_URL` in the host's environment settings to the deployed backend URL.