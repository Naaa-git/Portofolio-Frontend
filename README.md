# Portfolio Frontend

Nuxt 3 frontend for a personal portfolio site — public pages (projects,
about, lessons, contact, etc., in Indonesian and English) plus an admin
panel for managing all of it.

## Stack

- Nuxt 3 (SSR via Nitro)
- Vue 3 + Pinia
- Tailwind CSS
- `@nuxtjs/i18n` — `id` default, `en` available, no browser auto-redirect

## Prerequisites

- Node.js (LTS) + pnpm
- The backend API running (see `portofolio-bc`'s README) — this app expects
  it at `http://localhost:5229/api` by default.

## Setup (local dev)

1. Clone the repo.
2. `pnpm install`
3. Make sure the backend is running locally first.
4. `pnpm dev` — dev server at `http://localhost:3000`.

### Env vars

All optional locally — everything falls back to a `localhost` default.

- `NUXT_PUBLIC_API_BASE` — API URL the browser calls directly
- `NUXT_API_BASE_INTERNAL` — API URL used for server-side (SSR) fetches
- `NUXT_PUBLIC_SITE_URL` — used for sitemap/i18n canonical URLs
- `NUXT_PUBLIC_GOOGLE_CLIENT_ID` / `NUXT_PUBLIC_MICROSOFT_CLIENT_ID` — OAuth
  buttons on `/admin/login`

## Useful commands

- `pnpm dev` — dev server
- `pnpm build` — production build
- `pnpm generate` — static generation
- `pnpm preview` — preview a production build locally

## Project structure

- `pages/` — routes, including `/admin/**` (behind auth)
- `components/` — reusable UI; `admin/` subfolder is admin-only components
- `composables/` — shared reactive logic
- `services/` — API client
- `stores/` — Pinia state
- `i18n/` + `locales/` — translations (`id.json`, `en.json`)

## Admin panel

`/admin/login` — JWT-based auth with optional 2FA (TOTP or email OTP) and
Google/Microsoft OAuth. From there you can manage profile info, projects,
experience, skills, lessons & experiments, outside-code content, social
links, and incoming contact messages.
