# Onion Communication

Research prototype developed from the MSc thesis **Framework for Safe Communication in the Non-Indexed Web (Hidden Web)** at ETU “LETI” (2026).

The interface includes a general research chat, AES-256-GCM encryption/decryption, and an ECDH P-256 + HKDF-SHA-256 key-exchange workspace that derives an AES-256-GCM key.

## Local preview

```bash
python3 -m http.server 8080 -d public
```

Open `http://127.0.0.1:8080/`.

## Clean routes

The project uses clean routes such as `/login`, `/chat`, `/aes`, `/ecdh`, and `/about`. The original `.html` files remain only as compatibility fallbacks; visitors do not need to see `.html` in normal navigation. Vercel also has `cleanUrls` enabled.

## Deployment plan

1. Upload the extracted project files to GitHub (do not upload only the ZIP).
2. Connect the repository to Vercel.
3. Connect Supabase Auth and database/realtime after the frontend is deployed.
4. Keep the Tor onion service available in parallel. The clearnet Vercel deployment does not replace the onion service.

## Research links

- Onion service: `leti2a2avnkjkkgdyvzqdgs5t37lnyuvsacff7d6hslwlxknmz3ylnid.onion`
- IEEE publication: `https://ieeexplore.ieee.org/abstract/document/11651421`

## Important

The current localhost authentication and chat persistence are browser-local test implementations. They are intentionally separated from the final Supabase-backed production data layer.
