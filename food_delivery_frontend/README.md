# Ocean Eats — Next.js Frontend

Modern food delivery UI built with Next.js (App Router), TypeScript, Tailwind, Zustand, and React Query.

## Quick Start

1) Install
   npm install

2) Dev
   npm run dev
   Open http://localhost:3000

3) Build
   npm run build

4) Start (after build)
   npm run start

## Environment

Create `.env.local`:
- NEXT_PUBLIC_API_BASE_URL=https://api.example.com
- NEXT_PUBLIC_WS_URL=wss://ws.example.com
- NEXT_PUBLIC_SITE_URL=http://localhost:3000

## Architecture

- src/app — routes, layouts, pages
- src/components — UI components
- src/store — Zustand slices
- src/lib — API, auth, websocket, formatting, query client
- src/styles — theme.css
- public — static assets (logo, icons)

Key routes:
- / — Home
- /restaurants, /restaurants/[id]
- /cart, /checkout
- /orders/[orderId]
- /login, /register

## Theming — Ocean Professional

- Primary: #2563EB
- Secondary: #F59E0B
- Error: #EF4444
- Background: #f9fafb
- Surface: #ffffff
- Text: #111827

Subtle gradients, rounded corners, soft shadows, and smooth transitions.
Global theme in `src/styles/theme.css` and `src/app/globals.css`.

## Assets

- /public/logo.svg
- /public/icons/cart.svg
- /public/icons/user.svg
- /public/icons/search.svg

Usage:
  <img src="/logo.svg" alt="Ocean Eats" width="128" height="32" />
  <img src="/icons/cart.svg" alt="Cart" width="24" height="24" />

## Notes

- REST and WebSocket clients are placeholders; set env vars to connect a real backend.
- For auth redirects (e.g., Supabase), use NEXT_PUBLIC_SITE_URL.

