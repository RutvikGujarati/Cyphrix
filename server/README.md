# Cyphrix Server

API logic is centralized in **cyphrixtech-server** (Express backend).

## Architecture

- **cyphrixtech-server**: Full backend with OTP, send-email, SMTP
- **cyphrixtech/api/**: Vercel serverless proxies (optional); when `API_BASE_URL` is set, they forward to the backend

## Production (live site)

1. Deploy **cyphrixtech-server** (e.g. Render, Railway) at `https://api.cyphrixtech.com`
2. Set in Vercel (cyphrixtech):
   - `VITE_API_BASE_URL=https://api.cyphrixtech.com`
3. Set in backend:
   - `FRONTEND_ORIGIN=https://www.cyphrixtech.com`
   - SMTP and OTP env vars

Frontend will call the backend directly. Messages and OTP verification work via the backend.

## Local dev

1. Run backend: `cd cyphrixtech-server && npm run dev`
2. Run frontend: `cd cyphrixtech && npm run dev`
3. Vite proxies `/api` to `http://localhost:8080`
