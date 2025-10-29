# Restaurant Finder & Delivery Tracker — Frontend

Ocean Eats is a modern Next.js application that allows users to browse restaurants, manage their cart, place orders, and track delivery status in real time.

This repository contains the frontend web app located in `food_delivery_frontend/`.

Live dev URL (if running): http://localhost:3000

## Contents

- Project Overview
- Tech Stack
- Getting Started
- Environment Variables
- Available Scripts
- Architecture
- Theming — Ocean Professional
- Paths and Assets
- Notes

---

## Project Overview

A feature-rich food ordering UI:
- Browse restaurants and view menus
- Add items to cart, checkout, and place orders
- Track order status (placeholder for real-time streaming)
- Account, login, registration flows (UI scaffolding)
- Mobile-first responsive with a modern aesthetic

## Tech Stack

- Next.js (App Router, TypeScript)
- React
- Zustand for state management
- Tailwind CSS for styling
- React Query (QueryClient) for server state
- Placeholder REST and WebSocket helpers for future integration

---

## Getting Started

1) Navigate to the frontend app:
   cd food_delivery_frontend

2) Install dependencies:
   npm install

3) Start the development server:
   npm run dev

Open http://localhost:3000 to view the site.

To build:
   npm run build

To preview production build:
   npm run start

Note: Commands are non-interactive and ready for CI.

---

## Environment Variables

This project uses environment variables for configuration. Do not commit secrets.

Root-level example file:
- Copy `.env.example` at the repository root to `.env` and provide values:
  - NEXT_PUBLIC_API_BASE_URL: Base URL for the backend REST API (e.g., http://localhost:4000)
  - NEXT_PUBLIC_WS_URL: WebSocket URL for live order updates (e.g., ws://localhost:4000/ws)
  - NEXT_PUBLIC_MAPS_KEY: Public maps provider key used by map components

Notes:
- These variables are public (prefixed with NEXT_PUBLIC_) and will be embedded in the client bundle.
- Do not place any private secrets in these variables.
- Frontend utilities read these values:
  - API client: `food_delivery_frontend/src/lib/api.ts` uses NEXT_PUBLIC_API_BASE_URL
  - WebSocket client: `food_delivery_frontend/src/lib/ws.ts` uses NEXT_PUBLIC_WS_URL
  - Map components (where applicable) read NEXT_PUBLIC_MAPS_KEY

---

## Available Scripts

From `food_delivery_frontend/`:

- npm run dev — Run local dev server (Next.js)
- npm run build — Build production assets
- npm run start — Start the production server (after build)
- npm run lint — Lint codebase

---

## Architecture

Project root for frontend:
- food_delivery_frontend/
  - app/ — Next.js App Router pages and layouts
    - page.tsx — Home
    - restaurants/ — Listing and detail pages
    - cart/, checkout/, account/, orders/ — Feature routes
  - components/ — UI components (cards, navbar, cart, orders)
  - lib/ — Utilities (api client, websocket client, formatting, auth placeholders)
  - store/ — Zustand slices and root store for UI, cart, order, user
  - styles/ — Theme CSS
  - public/ — Static assets (logo, icons)

Routing
- The app uses the Next.js App Router (`src/app`) with standard pages and nested routes.
- Notable routes:
  - /restaurants — Browse restaurants
  - /restaurants/[id] — Restaurant details
  - /cart — Cart screen
  - /checkout — Checkout flow
  - /orders/[orderId] — Order details (server route and client UI)
  - /login, /register — Auth scaffolding

State Management (Zustand)
- Slices in `src/store`:
  - cartSlice: add/update/remove items, totals
  - orderSlice: order placement and tracking placeholder
  - uiSlice: global UI flags
  - userSlice: user session placeholder
- Root store exports typed hooks for ease of use.

Data Fetching
- React Query initialized in `src/lib/queryClient.ts`.
- API helper (`src/lib/api.ts`) reads `NEXT_PUBLIC_API_BASE_URL`.
- Replace placeholder endpoints with your backend REST API.

Real-time / WebSockets
- Placeholder WS client in `src/lib/ws.ts` reads `NEXT_PUBLIC_WS_URL`.
- Integrate with backend events to stream order updates.

Auth
- `src/lib/auth.ts` contains placeholders for login/register and token handling.
- Add your provider or integrate with existing auth services as needed.
- For Supabase (optional), set redirect URLs using `NEXT_PUBLIC_SITE_URL`.

---

## Theming — Ocean Professional

Theme
- ApplicationTheme: Ocean Professional
- Palette:
  - Primary: #2563EB (blue)
  - Secondary/Success: #F59E0B (amber)
  - Error: #EF4444
  - Background: #f9fafb
  - Surface: #ffffff
  - Text: #111827
- Gradients: `from-blue-500/10 to-gray-50` accents

Implementation
- Tailwind + CSS variables in `src/app/globals.css` and `src/styles/theme.css`.
- Components use subtle shadows, rounded corners, and smooth transitions.
- Public assets (logo and icons) align with the blue/amber accent style.

---

## Paths and Assets

Static assets:
- Logo: `public/logo.svg`
- Icons:
  - `public/icons/cart.svg`
  - `public/icons/user.svg`
  - `public/icons/search.svg`

Use in components (example):
  <img src="/logo.svg" alt="Ocean Eats" width={128} height={32} />
  <img src="/icons/cart.svg" alt="Cart" width={24} height={24} />

All paths match Next.js public directory conventions.

---

## Notes

- Backend interfaces (REST & WS) are placeholders. Point to a real backend by configuring env vars.
- The `out/` folder contains a static export artifact from a previous build; use `npm run build` to regenerate as needed.
- Directory structure and filenames follow Next.js and TypeScript best practices.

