# Pixy.ng Frontend

The frontend for [Pixy.ng](https://pixy.ng) - a platform that turns everyone's photos from an event into a printed magazine delivered to the host, with no human in the loop.

## Tech Stack

- **Framework**: [Next.js 15](https://nextjs.org/) with App Router
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Data Fetching**: [TanStack Query](https://tanstack.com/query)
- **Storage**: IndexedDB (via [idb](https://github.com/jakearchibald/idb)) for offline upload queue
- **API**: REST API connecting to [Pixy Backend](../pixy-backend)

## Features

### Guest Experience (No Login Required)
- **Room Join** - Scan QR code or enter join code to join event room
- **Selfie Onboarding** - Take selfie for face matching (with consent, skippable)
- **Photo Capture** - Native camera capture with client-side compression
- **Upload Resilience** - Offline queue with auto-retry on network reconnection
- **Gallery** - View all event photos
- **Photos of Me** - Automatic face-matched photos or manual selfie search
- **Live Wall** - Real-time photo slideshow via Server-Sent Events
- **Leaderboard** - See top uploaders
- **In-App Browser Detection** - Prompts to open in Chrome/Safari when in Snapchat/Instagram/WhatsApp

### Host Experience (Email OTP Auth)
- **Event Management** - Create and manage events
- **QR Code & Signage** - Generate QR codes and printable signage
- **Media Management** - View, hide, delete photos; bulk download as ZIP
- **Magazine Builder** - Auto-generate magazine, preview, edit, and approve
- **Event Dashboard** - Stats on uploads, guests, storage

### Admin Dashboard
- **Overview** - Revenue, events, uploads, orders
- **Event Management** - Moderate events across platform
- **Media Moderation** - Hide/reject inappropriate content
- **Orders & Print Queue** - Track orders and print jobs
- **Coupons** - Create and manage discount codes
- **Printers** - Manage print partner settings

## Getting Started

### Prerequisites
- Node.js 22+
- npm or pnpm
- Backend running on `http://localhost:4000`

### Installation

```bash
# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local
```

### Environment Variables

```env
NEXT_PUBLIC_API_URL=http://localhost:4000
```

### Development

```bash
# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Build

```bash
# Build for production
npm run build

# Start production server
npm start
```

## Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── e/[slug]/          # Guest room routes
│   ├── wall/[slug]/       # Live wall
│   ├── host/              # Host dashboard
│   ├── admin/             # Admin dashboard
│   └── login/             # Auth
├── components/            # React components
│   ├── upload/           # Camera upload components
│   └── shared/           # Shared components
├── hooks/                # Custom React hooks
├── lib/
│   ├── api/              # API client and types
│   ├── storage/          # IndexedDB upload queue
│   └── utils/            # Utility functions
└── styles/               # Global styles
```

## Key Routes

| Route | Description |
|-------|-------------|
| `/` | Home page |
| `/e/[slug]` | Join event room |
| `/e/[slug]/upload` | Photo upload (camera) |
| `/e/[slug]/gallery` | Event photo gallery |
| `/e/[slug]/me` | User's photos and photos they're in |
| `/wall/[slug]` | Live wall for projector display |
| `/login` | Host/Admin login (OTP) |
| `/host` | Host dashboard |
| `/host/events/new` | Create new event |
| `/host/events/[id]` | Event management |
| `/admin` | Admin dashboard |

## Development Notes

- **Guest auth**: Uses anonymous session tokens stored in localStorage (`pixy_guest_[slug]`)
- **Host auth**: Email OTP via backend, tokens stored in localStorage
- **Direct uploads**: Photos upload directly to R2 via presigned URLs (server never sees file bytes)
- **Real-time**: Live wall uses Server-Sent Events (SSE)
- **Offline support**: Upload queue works offline, retries when connection restored
- **Mobile-first**: Optimized for mobile devices (primary use case)

## Related

- [Backend Repository](../pixy-backend) - NestJS API
- [Product Spec](../pixy-backend/docs/Pixy.ng%20Product%20Spec.md) - Full product specification
