# TripTales Frontend (Next.js App Router)

TripTales is a modern travel-sharing web app built with Next.js, Tailwind CSS, and MongoDB/Mongoose. Users can share posts with photo galleries, add tips, and discover content using filters for tags and locations. This frontend provides:
- App Router pages and components
- API routes for posts and Cloudinary uploads
- Authentication routes (signup/login) with secure HttpOnly cookie sessions
- A MongoDB connection via Mongoose

Authentication
- The app uses JWT sessions stored in an HttpOnly cookie (tt_session).
- Ensure AUTH_SECRET is set in .env (min length 16). In production, cookies are Secure.
- See README_AUTH.md for API details and cookie attributes.

## Prerequisites

- Node.js 18+ (Node 20 recommended)
- npm, yarn, pnpm, or bun (choose one)
- A MongoDB database (Atlas or self-hosted)
- A Cloudinary account (for image uploads)

## Environment Setup

1) Copy the example env file and fill in values:
   cp .env.example .env

2) Required variables:
   - MONGODB_URI: MongoDB connection string used by the API routes and server actions.
   - CLOUDINARY_CLOUD_NAME: Cloudinary cloud name (required for signed uploads).
   - CLOUDINARY_API_KEY: Cloudinary API key (server-side).
   - CLOUDINARY_API_SECRET: Cloudinary API secret (server-side, private).
   - NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME: Cloud name exposed to client for building endpoints.
   - AUTH_SECRET: Secret used to sign JWT session cookies. Must be at least 16 chars. Keep private.

   - Optional:
     - CLOUDINARY_UPLOAD_PRESET: If using an unsigned preset or need to include preset in signed params.
     - NEXT_PUBLIC_SITE_URL: Absolute site URL, used by SEO/SSR to generate canonical URLs and for server-side fetches.

3) Do not hardcode secrets. The app reads configuration exclusively from environment variables.

### Variable Reference

- MONGODB_URI  
  Description: Mongo connection string used by Mongoose.  
  Where used: src/lib/db/mongodb.ts (connectToDatabase).

- CLOUDINARY_CLOUD_NAME  
  Description: Cloudinary cloud name for building upload URLs.  
  Where used: src/lib/cloudinary.ts.

- CLOUDINARY_API_KEY  
  Description: Cloudinary API key for signed requests.  
  Where used: src/lib/cloudinary.ts and returned to client for uploads (never the secret).

- CLOUDINARY_API_SECRET  
  Description: Cloudinary API secret used to compute signatures (never sent to clients).  
  Where used: src/lib/cloudinary.ts.

- CLOUDINARY_UPLOAD_PRESET (optional)  
  Description: Unsigned preset name if you use unsigned uploads or want to include in signed params.  
  Where used: src/lib/cloudinary.ts.

- NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME  
  Description: Public cloud name available to client code.  
  Where used: Client-side components (upload flow).

- NEXT_PUBLIC_SITE_URL (optional but recommended in production)  
  Description: Absolute URL of the site (e.g., https://triptales.example.com).  
  Where used: SEO helpers and server-side fetches to generate absolute URLs.

- AUTH_SECRET  
  Description: Secret used to sign JWTs for HttpOnly session cookies (7-day expiry). Minimum 16 characters.  
  Where used: src/lib/auth/session.ts.

## Authentication

This app provides basic authentication with JWT stored in HttpOnly cookies:

- Passwords are hashed using bcrypt and never returned in responses.
- JWT payload includes `sub` (user id), `email`, and expires in 7 days.
- Cookies: HttpOnly, SameSite=Lax, Secure in production.

API routes:
- POST /api/auth/signup  
  Body: { email, password, name }  
  Responses:
  - 201 { id, email, name } and sets cookie
  - 400 with field validation errors
  - 409 for duplicate email

- POST /api/auth/login  
  Body: { email, password }  
  Responses:
  - 200 { id, email, name } and sets cookie
  - 400 validation errors
  - 401 invalid credentials

To read session (server-side): use `getSession()` in `src/lib/auth/session.ts`.

## Local Development

- Install dependencies:
  npm install

- Run the dev server:
  npm run dev

- Open the app:
  http://localhost:3000

Tip: Ensure MongoDB, Cloudinary vars, and AUTH_SECRET are set in your .env before starting to avoid runtime errors.

## Cloudinary Configuration

TripTales uses a secure, signed direct-upload flow:

- Server-side signing endpoint:
  - Route: POST /api/uploads/sign
  - Generates a signature using CLOUDINARY_API_SECRET.
  - Allows a limited set of parameters (folder, timestamp, etc.) and returns only safe fields (signature, timestamp, api_key, cloud_name, optional upload_preset).

- Client-side upload workflow:
  - The ImageUploader component asks the server for signed params, then uploads directly to Cloudinary.

Required Cloudinary values:
- CLOUDINARY_CLOUD_NAME
- CLOUDINARY_API_KEY
- CLOUDINARY_API_SECRET

Optional:
- CLOUDINARY_UPLOAD_PRESET (if using unsigned uploads or want to include it in signed params).

Security notes:
- Never expose CLOUDINARY_API_SECRET to the client.
- The app never returns the secret; it only returns signature and public fields.

## MongoDB Configuration

- Set MONGODB_URI in your .env.
- The app creates a singleton Mongoose connection with caching to support hot reload in dev.
- Post schema, indexes, and API routes reside under src/lib/db and src/app/api.

## Deployment Notes

- Server runtime: This project relies on serverless/serverful API routes and server-side code (MongoDB + signing). It must run with a Node.js server runtime. Do not statically export.
- The next.config.ts is configured for server runtime and remote image patterns. Do not set output: "export". This would break API routes and server features.
- Ensure environment variables are provided in the hosting platform’s configuration:
  - MONGODB_URI
  - CLOUDINARY_CLOUD_NAME
  - CLOUDINARY_API_KEY
  - CLOUDINARY_API_SECRET
  - AUTH_SECRET
  - Optional: CLOUDINARY_UPLOAD_PRESET, NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME, NEXT_PUBLIC_SITE_URL

- Image optimization: next/image is configured to allow common hosts including:
  - res.cloudinary.com
  - images.unsplash.com
  - lh3.googleusercontent.com
  - example.com (for tests/placeholders)
  If you use additional CDNs, add them in next.config.ts under images.remotePatterns.

- Absolute URLs for SSR/ISR:
  - The app reads NEXT_PUBLIC_SITE_URL (or VERCEL_URL) to construct absolute URLs in server components (e.g., fetch on Home page, SEO helpers). Ensure this is set in production to avoid build-time fetch errors.

- Accessibility & styling:
  - Global focus-visible ring is enabled for keyboard users.
  - Components include aria-labels and sufficient color contrast (Ocean Professional palette: blue/amber).
  - Skeleton loaders and empty states are present on Explore and grids for a smooth UX.
  - Spacing, rounded corners, shadows, and subtle gradients are aligned to a modern professional theme.

## Routes

- / — Home (recent posts grid)
- /explore — Filterable list with infinite scroll
- /posts/[id] — Post details
- /posts/new — Create a new post
- /posts/[id]/edit — Edit an existing post
- /create — Friendly alias that points to /posts/new
- API: /api/posts, /api/uploads/sign, /api/auth/signup, /api/auth/login
- 404 — Custom not-found page with links back to Home and Explore

## Project Scripts

- npm run dev: Start dev server on port 3000
- npm run build: Build for production (server runtime)
- npm run start: Start production server
- npm run lint: Lint codebase
- npm run test: Run tests

## Notes and Gotchas

- Do not use output: "export" in next.config.ts. The app depends on server routes and cannot be a static export.
- If uploads fail, verify Cloudinary env vars and that your account/preset allows the requested operations.
- If database requests fail, confirm MONGODB_URI is valid and reachable (network/IP allowlists in Atlas).
- If next/image throws domain errors, add your image hosts to images.remotePatterns in next.config.ts.
- Ensure NEXT_PUBLIC_SITE_URL is set on production to avoid build-time fetch issues.
- Ensure AUTH_SECRET is configured; otherwise auth routes will fail with 500.

## Directory Highlights

- src/app/api/posts: CRUD endpoints for posts (MongoDB).
- src/app/api/uploads/sign: Signing endpoint for Cloudinary uploads.
- src/app/api/auth: Authentication endpoints (signup/login).
- src/lib/db: Mongoose connection and models.
- src/lib/auth/session.ts: JWT cookie session utils.
- src/lib/cloudinary.ts: Reads env, computes upload signatures.
- src/components/uploads/ImageUploader.tsx: Client uploader with progress and drag-and-drop.

## License

This project is part of the TripTales platform. Use subject to the platform’s overall license and terms.
