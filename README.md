# KeyLo

KeyLo is a Kolkata-focused student rental marketplace demo. Students can discover verified PGs and flats near universities, rent study essentials, and manage protected deposits. Landlords can list properties and manage rental workflows.

This repository contains the hackathon frontend and Supabase-backed prototype. Authentication, listings, bookings, deposits, saved stays, owner moderation, and dashboard data are connected to Supabase. Payments intentionally remain in test mode for the hackathon.

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
