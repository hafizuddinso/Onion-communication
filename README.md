# Onion Communication

Research prototype developed from the MSc thesis **Framework for Safe Communication in the Non-Indexed Web (Hidden Web)** at ETU “LETI”. The interface presents the research work, a Supabase-backed authenticated General chat, and browser-side AES-GCM / ECDH cryptographic workspaces.

## Production architecture

- **Vercel:** static research interface and clean routes.
- **Supabase Auth:** account creation, sign-in, sessions.
- **Supabase PostgreSQL + Realtime:** General research-room messages.
- **Web Crypto API:** AES-GCM and ECDH/HKDF operations remain client-side.
- **Tor onion service:** maintained as a separate research deployment and linked from the site.

## Public routes

`/`, `/login`, `/chat`, `/aes`, `/ecdh`, `/about`

## Supabase configuration

The browser configuration is in `public/config.js`. It contains only the Supabase **Project URL** and **publishable key**. Never add a Supabase secret/service-role key, database password, or direct PostgreSQL connection string to this repository.

Authentication URL configuration should include the production Vercel domain and any localhost URLs used for testing.

## Deployment

Push this repository to GitHub. Vercel will automatically redeploy the connected `main` branch. No build command is required for this static project.
URL: https://onion-communication.vercel.app/

## Security note

The Supabase-backed clearnet application and the Tor onion-service deployment are distinct transports. AES/ECDH private material is intentionally not persisted in the Supabase message tables.

## Publication

IEEE Xplore document 11651421 is linked from the research homepage.
