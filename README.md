# VaultLane

Digital-goods marketplace for game keys, top-ups, in-game items, and software licenses. Buyers and sellers trade with escrow-style delivery on Next.js + shadcn/ui.

## Stack

- Next.js 16 (App Router) + React 19 + Tailwind 4
- shadcn/ui (Base UI)
- Prisma + SQLite
- Auth.js (NextAuth v5 credentials)
- Encrypted delivery payloads + payment webhook stub

## Setup

```bash
pnpm install
cp .env.example .env
pnpm db:setup
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000).

## Demo accounts

After seeding (`pnpm db:seed`):

| Role   | Email                   | Password    |
|--------|-------------------------|-------------|
| Buyer  | buyer@vaultlane.test    | password123 |
| Seller | seller1@vaultlane.test  | password123 |
| Admin  | admin@vaultlane.test    | password123 |

## Main routes

- `/` — landing
- `/browse` — catalog + filters
- `/listings/[id]` — detail + escrow checkout
- `/orders/[id]` — escrow timeline, delivery reveal, confirm/dispute
- `/dashboard/buyer` — purchases
- `/dashboard/seller` — listings, orders, sales chart
- `/admin/disputes` — dispute resolution
- `/api/payments/webhook` — payment provider webhook stub

## Scripts

```bash
pnpm dev
pnpm build
pnpm db:generate
pnpm db:migrate
pnpm db:seed
pnpm db:setup
```
