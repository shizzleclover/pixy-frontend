# Pixy frontend

The web app for [Pixy](https://pixy.ng): guests scan a QR code, share photos from their phones and find every photo they’re in; hosts run their event; the best shots become a printed magazine.

Next.js 15 (App Router), TypeScript, Tailwind CSS 3, TanStack Query, IndexedDB (`idb`) for the offline upload queue. The API is the Pixy backend (NestJS, separate repo).

## Getting started

Needs Node 22+ and the backend running (default `http://localhost:4000`, with `APP_URL=http://localhost:3000` so CORS allows this app).

```bash
npm install
cp .env.example .env.local   # NEXT_PUBLIC_API_URL
npm run dev                  # http://localhost:3000
```

| Script | |
| --- | --- |
| `npm run dev` | dev server |
| `npm run build` / `npm start` | production build and server |
| `npm run lint` | ESLint, no warnings allowed |
| `npm run typecheck` | `tsc --noEmit` |

## Deploying (Vercel)

1. Vercel → **Add New → Project** → import this repo. The framework preset is
   detected as Next.js; no build settings to change.
2. **Settings → Environment Variables**: `NEXT_PUBLIC_API_URL` = the API’s
   URL, e.g. `https://pixy-api.fly.dev` (no trailing slash). It’s baked
   in at build time, so redeploy after changing it.
3. Deploy, then tell the backend about this URL: set its `APP_URL` to the
   Vercel URL (CORS and email links), and add the URL to the R2 bucket’s CORS
   rule (browsers upload photos straight to R2). See the backend’s DEPLOY.md.

Preview deployments get their own URLs, which the API won’t accept unless
they’re added to its `CORS_ORIGINS`; test on the production URL.

The home page reads packages from `GET /catalog` and refreshes hourly. If the
API was asleep or down during a build, the packages section is hidden until
the next refresh.

## Routes

| Route | |
| --- | --- |
| `/` | home: how it works, packages (from `GET /catalog`), join-code box |
| `/e/[slug]` | join an event (slug or join code; codes redirect to the slug) |
| `/e/[slug]/gallery`, `/me`, `/mine` | everyone’s photos, photos of me, my uploads |
| `/e/[slug]/upload` | camera |
| `/wall/[slug]` | live wall for the venue screen (SSE) |
| `/login` | host and admin sign-in (email code); `?next=` returns to a page |
| `/host`, `/host/events/new`, `/host/events/[id]` | host dashboard |
| `/admin` | admin overview |

## How it’s put together

- **API calls** go through `src/lib/api/http.ts` (`request`): JSON in and out, errors become `ApiError` with the backend’s `code`, the HTTP status and the `x-request-id`. Host requests refresh the access token once on 401, then sign out; a guest 401 clears that event’s guest token. `src/lib/api/client.ts` lists the endpoints; `errors.ts` turns error codes into copy.
- **Sessions**: host tokens in `localStorage` (`pixy_token`, `pixy_refresh`); guest tokens per event slug (`pixy_guest_<slug>`). `useAuth` guards host pages (and admin by role); `GuestPage` sends guests without a session back to the join screen.
- **Uploads**: photos are converted to JPEG on the phone (`lib/media/compress.ts`), stored in IndexedDB, then sent one at a time: presign, PUT straight to R2, complete (`lib/media/upload.ts`). The queue (`hooks/use-upload-queue.ts`, one per room via `UploadQueueProvider`) drains on load, when the phone comes back online and every 20 s. Refusals such as “uploads closed” are dropped and shown; network and server errors are retried.

## Design

Warm paper, ink text and one tomato accent: flat colour, no gradients, photos supply the colour. The live wall is the one dark screen. Headlines in Instrument Serif, everything else in DM Sans (self-hosted via `next/font`). Tokens are in `tailwind.config.ts`; buttons, inputs, chips and cards are classes in `src/app/globals.css` (`.btn-primary`, `.input`, `.chip`, `.card`, …). Icons are inline SVGs in `src/components/shared/icons.tsx`; no emoji.

`@next/next/no-img-element` is off: photos are short-lived signed R2 URLs, which Next’s image optimizer can’t cache usefully.
