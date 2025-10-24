# TripTales Frontend

This Next.js 14 App Router frontend provides:
- Ocean Professional theme with blue primary and amber accents
- Homepage with image-centric grid, filters, and create button
- Post details with gallery, story, and tips sections
- Create post flow with Cloudinary unsigned uploads, preview/remove, and draft save
- Basic optimistic likes and favorites

Environment variables (client-side) in .env:
- NEXT_PUBLIC_MONGODB_URI
- NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME
- NEXT_PUBLIC_CLOUDINARY_API_KEY
- NEXT_PUBLIC_CLOUDINARY_API_SECRET
- NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET
- NEXT_PUBLIC_NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME (fallback support)

Cloudinary setup:
- Use an unsigned upload preset for client uploads.
- Set NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME and NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET.
- App gracefully warns if missing and disables upload.

API:
- Minimal placeholder /api/posts implemented to unblock UI. Replace with real backend as needed. (Next.js 14 App Router)

TripTales is a modern travel-sharing web app built with Next.js 14, Tailwind CSS, and MongoDB/Mongoose. Users can share posts with photo galleries, add tips, and discover content using filters for tags and locations. This frontend includes:
- App Router pages and components
- API routes for posts and Cloudinary uploads
- Authentication routes (signup/login/logout) with secure HttpOnly cookie sessions (JWT)
- A MongoDB connection via Mongoose
- Loading states, error boundaries, and coherent modern UI

Production readiness highlights:
- Secure cookie flags (HttpOnly, SameSite=Lax, Secure in production)
- Ownership checks on PATCH/DELETE for posts
- Absolute URL helpers for server-side fetches and OG image generation
- Cloudinary remote image patterns configured in next.config.ts
- Global error boundary and not-found UX
- Loading skeletons for key routes

## Quick Start (Local)

1) Install dependencies
   npm install

2) Create environment file
   cp .env.example .env
   Fill in all required values (MongoDB, Cloudinary, AUTH_SECRET).

3) Run development server
   npm run dev
   Open http://localhost:3000

## Environment Variables

Required
- MONGODB_URI: MongoDB connection string used by Mongoose.
- CLOUDINARY_CLOUD_NAME: Cloudinary cloud name (server-side).
- CLOUDINARY_API_KEY: Cloudinary API key (server-side).
- CLOUDINARY_API_SECRET: Cloudinary API secret (server-side, private).
- NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME: Cloud name exposed to client for building endpoints.
- AUTH_SECRET: Secret for signing JWT session cookies. Minimum 16 characters. Keep private.

Optional but recommended
- CLOUDINARY_UPLOAD_PRESET: Unsigned preset (if used) or named preset to include in signed params.
- NEXT_PUBLIC_SITE_URL: Absolute URL of the site (e.g., https://triptales.example.com). Used by server-side fetches and SEO helpers to avoid prerender issues.

Tip: Never commit production secrets. Configure them in your hosting platform environment.

## Authentication

- HttpOnly cookie (name: tt_session) stores a signed JWT with a 7-day expiry.
- Cookies are HttpOnly, SameSite=Lax, and Secure in production.
- Passwords are hashed using bcrypt and never returned in responses.
- Utilities are in src/lib/auth/session.ts:
  - setSessionCookie({ id, email })
  - clearSessionCookie()
  - getSession()

API routes:
- POST /api/auth/signup
  Body: { email, password, name }
  201: { id, email, name } (sets cookie)
- POST /api/auth/login
  Body: { email, password }
  200: { id, email, name } (sets cookie)
- POST /api/auth/logout
  200: { ok: true } (clears cookie)

## Posts API and Ownership

- POST /api/posts
  Requires authentication. Author is set server-side from session.userId. Prevents tampering.
- GET /api/posts
  List with filters (q, tags, locations, status) and pagination.
- GET /api/posts/:id
  Fetch a single post by id.
- PATCH /api/posts/:id
  Requires ownership; only the author can update.
- DELETE /api/posts/:id
  Requires ownership; only the author can delete.

Model: src/lib/db/models/Post.ts
- author: string (required; user id)
- title: string (required), content, images, tags, locations, tips, likedCount, favorites, status
- Indexes: text index (title+content), tags, locations

## Cloudinary Uploads

- Signed upload flow:
  - Server: POST /api/uploads/sign generates signature using CLOUDINARY_API_SECRET.
  - Client: Uses signed params to upload directly to Cloudinary.
- Ensure the following envs:
  - CLOUDINARY_CLOUD_NAME
  - CLOUDINARY_API_KEY
  - CLOUDINARY_API_SECRET
  - Optional CLOUDINARY_UPLOAD_PRESET
- next.config.ts includes res.cloudinary.com in images.remotePatterns.

## Absolute URLs and SEO

- Use getBaseUrl/apiUrl helpers (src/lib/utils.ts) for server-side fetches.
- NEXT_PUBLIC_SITE_URL is preferred in production for absolute URL generation.
- OG image handler under /posts/[id]/opengraph-image uses absolute base URL when available.

## Error and Loading UX

- Global error boundary: app/error.tsx
- Not found page: app/not-found.tsx
- Route-level error for posts: app/posts/[id]/error.tsx
- Loading states:
  - app/explore/loading.tsx
  - app/posts/[id]/loading.tsx
  - app/auth/login/loading.tsx
  - app/auth/signup/loading.tsx

## Accessibility

- Focus-visible styles enabled
- Buttons and links include aria-labels where appropriate
- Color contrast adheres to “Ocean Professional” palette

## Deployment (Production)

Build and start:
- npm run build
- npm run start

Environment requirements:
- MONGODB_URI
- CLOUDINARY_CLOUD_NAME
- CLOUDINARY_API_KEY
- CLOUDINARY_API_SECRET
- NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME
- AUTH_SECRET (at least 16 chars)
- Optional: CLOUDINARY_UPLOAD_PRESET, NEXT_PUBLIC_SITE_URL

Vercel/Node server notes:
- This project uses API routes and server-side code. Do not set output: "export".
- In serverless environments, ensure MongoDB allows connections from the platform egress.
- Set NEXT_PUBLIC_SITE_URL to your production domain to avoid SSR absolute URL issues.

Images:
- next.config.ts allows res.cloudinary.com, images.unsplash.com, lh3.googleusercontent.com, and example.com by default. Add any additional CDNs you need to images.remotePatterns.

## End-to-End Checklist

- Auth
  - Signup with new email -> receives cookie
  - Login with valid creds -> receives cookie
  - Logout clears session
  - Protected actions (create/edit/delete) require authentication and ownership
- Posts
  - Create a post (with optional images/tags/locations)
  - Edit only as the author; reject for non-authors
  - Delete only as the author
- Uploads
  - Cloudinary upload from create/edit works with signed params
- Navigation/UX
  - Navbar reflects auth state (login/signup vs. logout/new post)
  - 404/500 pages render with no console errors
  - Loading skeletons appear on slow routes
- Build
  - npm run build passes without errors
  - Production preview boots with no console errors

## Scripts

- npm run dev: Start dev server
- npm run build: Production build
- npm run start: Start prod server
- npm run lint: Lint checks
- npm run test: Tests (unit/integration)

## Directory Highlights

- src/app/api/posts: CRUD endpoints for posts (MongoDB)
- src/app/api/uploads/sign: Signing endpoint for Cloudinary uploads
- src/app/api/auth: Authentication endpoints (signup/login/logout)
- src/lib/db: Mongoose connection and models
- src/lib/auth/session.ts: JWT cookie session utils
- src/lib/cloudinary.ts: Env handling and signing
- src/components: UI components (cards, grids, uploader, navbar)

## License

This project is part of the TripTales platform. Use subject to the platform’s overall license and terms.
