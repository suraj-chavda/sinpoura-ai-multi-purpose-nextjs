<p align="center">
  <img src="public/logo.svg" width="72" height="72" alt="Sinpoura logo" />
</p>

<h1 align="center">Sinpoura</h1>

<p align="center">
  Multi-purpose AI chat template for portfolios and real apps: Next.js, MongoDB, Zustand, Auth.js, and
  <a href="https://github.com/kanha95/xoin-js">xoin-js</a>.
</p>

<p align="center">
  <a href="https://nextjs.org/">Next.js</a>
  ·
  <a href="https://www.mongodb.com/">MongoDB</a>
  ·
  <a href="https://github.com/pmndrs/zustand">Zustand</a>
  ·
  <a href="https://authjs.dev/">Auth.js</a>
</p>

---

## Table of contents

1. [Overview](#overview)
2. [Features](#features)
3. [Tech stack](#tech-stack)
4. [Repository layout](#repository-layout)
5. [Getting started](#getting-started)
6. [Environment variables](#environment-variables)
7. [Scripts](#scripts)
8. [SEO, sharing, and branding](#seo-sharing-and-branding)
9. [Deployment](#deployment)
10. [Security notes](#security-notes)
11. [Customizing the product](#customizing-the-product)
12. [Acknowledgments](#acknowledgments)

---

## Overview

Sinpoura is a production-shaped AI chat starter: users register and sign in, conversations and messages persist in MongoDB, the UI state lives in Zustand, and LLM calls run only on the server through `@xoin/xoin-js` (OpenAI by default). The landing page is public; the chat area is protected by middleware.

Use it as a portfolio piece, a baseline for an internal tool, or a reference architecture for feature-based Next.js apps.

---

## Features

- Email and password authentication (registration plus credentials sign-in via Auth.js v5).
- JWT sessions; `/chat` guarded by middleware.
- Conversation list, new chat, delete chat, message history loaded per thread.
- Single `POST /api/chat` route that validates ownership, saves messages, calls xoin `generate` with chat history, then returns stored assistant text.
- Responsive shell: collapsible sidebar behavior on small screens, scrollable transcript.
- Feature slice under `src/features/chat/` (store, hooks, service, types) separate from dumb UI components.

---

## Tech stack

| Layer            | Choice                                      |
| ---------------- | ------------------------------------------- |
| Framework        | Next.js (App Router)                        |
| UI               | React 19, Tailwind CSS v4                   |
| State (client)   | Zustand                                     |
| Auth             | Auth.js / `next-auth` v5 (credentials)      |
| Database         | MongoDB via Mongoose                        |
| LLM client       | `@xoin/xoin-js` + OpenAI provider           |
| Validation       | Zod (API + auth)                            |

---

## Repository layout

High-signal paths:

```
src/
├── app/                  # Routes, API handlers, SEO files (sitemap, robots, OG image)
├── components/           # Layout + chat UI + providers + JsonLd
├── features/chat/        # Zustand store, hooks, API client, types
├── lib/                  # Shared helpers (constants, fetcher, site URL)
├── server/               # Mongo connection/models, xoin client, YAML prompt template
├── auth.config.ts        # Edge-safe Auth.js config (middleware; no Mongo/bcrypt)
├── auth.ts               # Full Auth.js + credentials (Node)
└── middleware.ts         # Session-aware routing
```

Static branding:

```
public/logo.svg           # App logo (Header, favicon-style icon metadata)
```

---

## Getting started

Prerequisites: Node.js 20+, a MongoDB URI, an OpenAI API key, and (for auth) a generated `AUTH_SECRET`.

```bash
cp .env.example .env.local
# Edit .env.local: AUTH_SECRET, MONGODB_URI, OPENAI_API_KEY, AUTH_URL / SITE_URL

npm install
npm run dev
```

Open `http://localhost:3000`. Register a user, then open `/chat`, create a thread with New, and send a message.

Generate a secret (example):

```bash
openssl rand -base64 32
```

### Troubleshooting dev

- Edge / `stream` error: middleware must not import Mongoose or `bcryptjs`. This repo keeps Node-only auth in `auth.ts` and uses `auth.config.ts` for middleware only.
- `MissingSecret`: set `AUTH_SECRET` in `.env.local` for production. In non-production, a dev-only placeholder is used so the server can start; still set a real secret before shipping.
- `MONGODB_URI is not set`: expected until you configure Mongo; register and chat need a valid URI.
- Turbopack “multiple lockfiles”, `Can't resolve 'tailwindcss' in '…/portfolio-git'`, or odd `404`: `next.config.js` pins `turbopack.root` to `__dirname` (this app folder), so resolution does not walk up to a parent monorepo folder. Run `npm run dev` from this repo root. If problems persist, remove or rename a stray `package-lock.json` in a parent directory that confuses workspace detection.

---

## Environment variables

| Variable           | Required | Purpose |
| ------------------ | -------- | ------- |
| `AUTH_SECRET`      | Yes      | Auth.js session signing. |
| `AUTH_URL`         | Deploy   | Canonical app URL for Auth.js (`http://localhost:3000` locally). |
| `SITE_URL`         | No       | Overrides canonical URL for SEO (sitemap, `metadataBase`, structured data). Falls back to `AUTH_URL`. |
| `NEXT_PUBLIC_SITE_URL` | No   | Optional client-visible absolute URL if you expose marketing links from the browser. |
| `MONGODB_URI`      | Yes      | Mongo connection string. |
| `OPENAI_API_KEY`   | Yes      | Used by xoin OpenAI provider. |
| `OPENAI_MODEL`     | No       | Defaults to `gpt-4.1-mini` in server config. |

Never commit `.env.local`. `.env.example` is safe to commit (`.gitignore` keeps `.env*` except `.env.example`).

---

## Scripts

| Command            | Description |
| ------------------ | ----------- |
| `npm run dev`      | Development server with Turbopack. |
| `npm run build`    | Production build. |
| `npm run start`    | Serve the production build. |
| `npm run typecheck`| `tsc --noEmit`. |

---

## SEO, sharing, and branding

These pieces ship with the repo so search engines and social previews behave predictably once you set `SITE_URL` or `AUTH_URL` to your real domain.

### Logo

- File: `public/logo.svg`
- Used in the header (`next/image`) and linked from metadata `icons` / `manifest` for a consistent mark across tabs and install prompts.

Replace the SVG with your own asset (keep the path `public/logo.svg` or update references in `src/app/layout.tsx`, `src/app/manifest.ts`, and `README.md`).

### Page metadata

- `src/app/layout.tsx` defines `metadataBase`, default title template, description, keywords, Open Graph, Twitter card, `robots`, and icon pointers.
- `src/app/login/layout.tsx`, `src/app/register/layout.tsx`, and `src/app/chat/layout.tsx` set route titles and descriptions. Chat uses `robots: noindex` so authenticated UI is less likely to compete with your marketing URL in search results (adjust if you want it indexed).

### Open Graph and Twitter images

- `src/app/opengraph-image.tsx` generates the default share image (1200×630).
- `src/app/twitter-image.tsx` re-exports the same asset for Twitter `summary_large_image`.

### Structured data

- `src/components/seo/JsonLd.tsx` injects a JSON-LD `WebApplication` document (name, URL, free offer). Adjust type or fields if you publish under a company name.

### Sitemap and robots

- `src/app/sitemap.ts` lists public marketing/auth routes (`/`, `/login`, `/register`). Authenticated `/chat` is omitted from the sitemap on purpose.
- `src/app/robots.ts` allows crawling of public pages, disallows `/api/` and `/chat`, and points crawlers to `/sitemap.xml`.

Tune `robots.ts` if you want `/chat` indexed (unusual for logged-in apps).

### Web app manifest

- `src/app/manifest.ts` exposes name, colors, and `logo.svg` for add-to-home-screen style installs.

### Production checklist

1. Set `AUTH_URL` and `SITE_URL` to `https://your-domain.com` (scheme included).
2. Verify `/opengraph-image` and `/twitter-image` in the browser after deploy.
3. Submit `sitemap.xml` in Search Console (or equivalent).
4. Optionally add per-page metadata and FAQ or Article schema if you publish docs.

---

## Deployment

Typical flow on Vercel (or any Node host):

1. Create a MongoDB Atlas cluster (or compatible host) and paste `MONGODB_URI`.
2. Set environment variables from the table above in the hosting dashboard.
3. Run `npm run build` in CI or rely on the platform build step.

Ensure the production URL matches `AUTH_URL` / `SITE_URL` so Auth.js redirects and OG URLs stay correct.

---

## Security notes

- API keys stay server-side; the browser only talks to your Next routes.
- Rate limiting and CAPTCHA are not included; add them before exposing a high-traffic instance.
- Use strong secrets and HTTPS in production.

---

## Customizing the product

- Product name: `src/lib/constants.ts` (`APP_NAME`).
- Assistant behavior: `src/server/ai/templates/chat-system.yml` and `src/server/ai/prompts.ts`.
- Additional providers: configure `@xoin/xoin-js` in `src/server/ai/xoin.ts` per the upstream README.

---

## Acknowledgments

- LLM abstraction: [kanha95/xoin-js](https://github.com/kanha95/xoin-js) (`@xoin/xoin-js` on npm).
- Auth: [Auth.js](https://authjs.dev/).
- Framework: [Next.js](https://nextjs.org/).

---

## License

MIT. See [`LICENSE`](LICENSE).
