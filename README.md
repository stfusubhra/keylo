# KeyLo

KeyLo is a Kolkata-focused student rental marketplace demo. Students can discover verified PGs and flats near universities, rent study essentials, and manage protected deposits. Landlords can list properties and manage rental workflows.

This repository contains the hackathon frontend prototype. The current data, authentication, payments, bookings, dashboards, and admin workflows are demo-only and are not connected to a production backend.

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

## Run locally

Requirements: Node.js 20+ and npm.

```bash
cd keylo-frontend
npm install
npm run dev
```

Open the local URL printed by Vite, normally `http://localhost:5173`.

## Supabase setup

The backend foundation is defined in `supabase/migrations/20260809000000_keylo_foundation.sql`.

1. Create a Supabase project.
2. Open the Supabase SQL Editor and run the migration file.
3. Copy `keylo-frontend/.env.example` to `keylo-frontend/.env.local`.
4. Add the project URL and anon key from **Project Settings > API**.
5. Restart Vite after changing environment variables.

The migration creates profiles, Kolkata universities, properties, rooms, bookings, payments, deposits, inspections, handovers, maintenance, messages, saved properties, enums, indexes, a new-user profile trigger, and initial row-level security policies. The frontend keeps its demo data when Supabase credentials are absent so the public demo remains usable.

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

## Roadmap to production

The next major work is a backend for real authentication, listings, search, bookings, payment processing, deposit escrow, notifications, and role-based access control. Do not treat the current mock flows as secure or production payment functionality.
