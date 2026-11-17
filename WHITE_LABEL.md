# Running the product under another brand

The product carries no company name, country, currency or colour in its
source. A deployment sets them through environment variables at build time.
Unset variables fall back to the defaults in `brand.defaults.js`.

## Frontend (build-time variables)

| Variable | What it controls | Example |
|---|---|---|
| `VITE_BRAND_NAME` | Product name: page title, installed-app name, headers, emails | `CleanCity` |
| `VITE_BRAND_OPERATOR` | Company operating the service: footer, About page | `Acme Waste Services Ltd` |
| `VITE_BRAND_TAGLINE` | One-sentence description: landing page, search and share previews | `Book pickups and track your recycling.` |
| `VITE_BRAND_COUNTRY` | Country named in copy | `Kenya` |
| `VITE_BRAND_LOCALE` | Number and date formatting (BCP 47) | `en-KE` |
| `VITE_BRAND_CURRENCY` | Currency for every price and total (ISO 4217) | `KES` |
| `VITE_BRAND_SUPPORT_EMAIL` | Contact address shown to users | `help@example.com` |
| `VITE_BRAND_SITE_URL` | Public address of the deployment | `https://app.example.com` |
| `VITE_BRAND_COLOR` | Primary colour as hex. The full light-to-dark scale is derived from it | `#0057b8` |
| `VITE_BRAND_LOGO_URL` | Logo image URL. Empty uses the bundled logo | `https://cdn.example.com/logo.svg` |
| `VITE_CLOUDINARY_CLOUD` | Cloudinary cloud holding product and article images | `acme-media` |
| `VITE_BASE_URL` | Address of the backend API | `https://api.example.com/api` |
| `VITE_WEB3FORMS_ACCESS_KEY` | Key for the contact form | |

App icons (`public/pwa-192.png`, `pwa-512.png`, `pwa-maskable-512.png`,
`apple-touch-icon.png`, `favicon-64.png`) are files: replace them with the
operator's own before building.

## Backend (runtime variables)

| Variable | What it controls |
|---|---|
| `BRAND_NAME`, `BRAND_OPERATOR`, `BRAND_COUNTRY` | Names used in notifications, emails and the AI assistant's instructions |
| `FRONTEND_URL` | Address of the frontend (sign-in redirects, CORS) |
| `MONGO_URI`, `JWT_PRIVATE_KEY` | Database and session signing |
| `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET` | Google sign-in (see `swk_backend/GOOGLE_SIGNIN.md`) |
| `ANTHROPIC_API_KEY` | Enables the AI scanner and assistant. Without it they stay hidden |
| `CLOUDINARY_*`, `MAIL_*` | Image storage and outgoing email |

## What a deployment is today

One deployment serves one operator: its own database, its own frontend build
and its own backend. That keeps each operator's customer data fully separate.
Serving several operators from a single shared installation (multi-tenancy)
is not built.

## Checklist for a new operator

1. Set the frontend variables above and replace the app icons.
2. Set the backend variables and point `MONGO_URI` at a new, empty database.
3. Create the first operations account (`/swk-admin-setup`, protected by `ADMIN_SECRET`).
4. Register the backend's `/api/auth/google/callback` address with Google if Google sign-in is wanted.
5. Build and deploy the frontend, deploy the backend, then sign in and schedule a test pickup end to end.
