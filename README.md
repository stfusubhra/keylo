# KeyLo - Student Rental Marketplace

**Kolkata's first student-focused rental platform with deposit protection.**

KeyLo is a hackathon-winning student rental marketplace prototype. Students can discover verified PGs and flats near universities, rent study essentials, and manage protected deposits. Landlords can list properties and manage rental workflows. The platform features a unique deposit protection system that ensures students get their security deposits back even if they don't pay the full rent.

This repository contains the complete hackathon frontend and Supabase-backed prototype. Authentication, listings, bookings, deposits, saved stays, owner moderation, and dashboard data are fully connected to Supabase. Payments remain in test mode for the hackathon demo.

## 🏆 Key Features

✅ **Student-Friendly Search** - Find PGs and flats near Kolkata universities
✅ **Deposit Protection** - Unique system ensuring students get deposits back
✅ **Multi-Role System** - Student, Landlord, Admin, and Lister roles
✅ **AI Trust Scoring** - Properties rated for reliability
✅ **Complete Workflows** - From search to booking to deposit management
✅ **Responsive Design** - Works on mobile, tablet, and desktop
✅ **Real-Time Updates** - Supabase-powered live data

## Demo scope

- Kolkata university-based rental discovery:
  - Adamas University
  - Jadavpur University
  - University of Calcutta
  - St. Xavier's University Kolkata
- PG and flat filtering by university and rental type
- Student marketplace for transport, laptops, furniture, appliances, electronics, gaming, tablets, and projectors
- Student, landlord, and admin demo interfaces
- KeyLo revenue-model prototype:
  - 5% success fee on rent collected from landlords
  - One-time tenant fee on the first KeyLo booking
  - No subscription plans

## Live demo

Deployed at **https://keylo-frontend.vercel.app** (auto-deploys from the `main` branch). All routes are served as an SPA via `keylo-frontend/vercel.json`, so deep links like `/find-a-stay` work directly.

## Run locally

Requirements: Node.js 20+ and npm.

```bash
cd keylo-frontend
npm install
npm run dev
```

Open the local URL printed by Vite, normally `http://localhost:5173`.

## Supabase setup

The backend is defined in the ordered files under `supabase/migrations/`.

1. Create a Supabase project.
2. Open the Supabase SQL Editor and run the migration file.
3. Copy `keylo-frontend/.env.example` to `keylo-frontend/.env.local`.
4. Add the project URL and anon key from **Project Settings > API**.
5. Restart Vite after changing environment variables.

The migrations create profiles, Kolkata universities, properties, rooms, bookings, payments, deposits, inspections, handovers, maintenance, messages, saved properties, enums, indexes, booking guards, atomic test-payment completion, a new-user profile trigger, and row-level security policies. The frontend keeps a clearly labelled demo mode when Supabase credentials are absent so the public prototype remains usable.

## Demo accounts and dispute fixture

Demo identities (passwords live in the team vault, never in this repository):

- `student.demo@keylo.in` — student
- `landlord.demo@keylo.in` — landlord

Create them once in Supabase **Authentication > Users** (emails above), then run the last migration (`20260809007000_keylo_dispute_fixture.sql`) in the SQL editor. It seeds a published, fully verified demo property (Jadavpur, ₹9,000 rent / ₹12,000 deposit), a confirmed booking, three test-mode payments, and a held deposit — and is safe to re-run.

Walk the full deposit-dispute chain to demo the trust loop:

1. **Student** — `/dashboard/disputes`: open a dispute on the confirmed stay. KeyLo records the AI recommendation (full/partial refund by property trust score, e.g. ≥90 → recommend full refund at 88% confidence).
2. **Landlord** — `/owner/claims`: respond and propose a refund; the case moves to `admin_review`.
3. **Admin** — `/admin/disputes`: refund or deny. A refund releases the held deposit; a **partial** refund also drops the property trust score by 5, which is visible on the listing and in the score breakdown.

The fixture's verification query (commented at the bottom of the migration) reports the booking, payment count, deposit status, dispute status, final refund, and trust score.

## Verification commands

```bash
cd keylo-frontend
npm run lint
npm run build
```

## Project structure

```text
keylo-frontend/
  src/components/   Shared layout and UI components
  src/pages/        Route-level pages and demo data
  public/           Static public assets
  package.json      Frontend scripts and dependencies
```

## Images and external assets

The frontend uses selected Unsplash image URLs for demo imagery. Review image licensing and replace remote URLs with approved, self-hosted assets before a commercial launch. Product logos and third-party marks should also be reviewed before publishing a public production deployment.

## Collaboration

See [CONTRIBUTING.md](CONTRIBUTING.md) for the team workflow.

## Production boundaries

- Test payments use a server-side Supabase RPC for atomic demo records; no real money is charged.
- Replace `test_mode` with a server-side Stripe/Razorpay integration and webhook verification before accepting money.
- Rotate demo administrator credentials, configure Supabase email confirmation/redirect URLs, and run Security Advisor before launch.
- Never add a Supabase service-role key to frontend environment variables or repository files.
