# KeyLo

**Kolkata student rentals with deposit protection built in.**

KeyLo is a full-stack prototype of a student rental marketplace for Kolkata. Students discover verified PGs and flats near their university, rent study essentials like scooters, laptops and furniture, and book with a security-deposit guarantee. Landlords list properties, manage bookings, and resolve deposit disputes through a transparent trust loop.

Built as a hackathon prototype, the app ships as a polished React frontend backed by Supabase, with authentication, listings, bookings, deposits, wishlists, owner moderation, and dashboard data wired end-to-end. Payments run in test mode for the demo.

Live demo: **https://keylo-frontend.vercel.app**

---

## Why KeyLo

Student housing in India runs on informal agreements. Deposits are demanded up front and rarely returned, listings are unverified, and there is no structured way to resolve disputes. KeyLo tackles that with a trust-first model:

- **Campus-aware discovery.** Properties are organized around real Kolkata universities, not just neighbourhoods.
- **Verified listings.** Every property carries a trust score driven by owner ratings, AI inspection results, and dispute history.
- **Protected deposits.** Bookings hold deposits in escrow and route disputes through a guided student-landlord-admin flow with AI recommendations.
- **One platform for a student's whole life.** Stays, rentable essentials, and services live under one roof.

## Features

- **Campus search and map.** Filter PGs and flats by university and rental type, or explore an interactive campus map with clustered pins and tap-to-jump navigation.
- **Rent Essentials marketplace.** Rent scooters, bikes, laptops, furniture, appliances, electronics, gaming gear, tablets, and projectors near campus.
- **Deposit protection.** A booking guard system that holds deposits until handover, with full- and partial-refund resolution that visibly adjusts property trust scores.
- **AI room inspection.** Upload room photos before moving in and receive a condition scan that serves as evidence for future disputes.
- **AI trust scoring.** Properties are scored and labelled (AI inspected, verified) so students can compare at a glance.
- **Multi-role experience.** Dedicated interfaces for students, landlords, owners, administrators, and independent listers, each with its own dashboard.
- **Complete student journeys.** Wishlists, secure bookings, test-mode payments, digital handover, maintenance requests, and landlord messaging.
- **Polished UX.** Skeleton loading states, toast notifications, micro-interactions, keyboard-accessible focus states, skip links, lazy-loaded images, and social-sharing meta tags.
- **Responsive by default.** The full experience works on mobile, tablet, and desktop.

## Roles

| Role | Experience |
| --- | --- |
| Student | Search stays, rent essentials, save wishlists, book with protected deposits, open disputes, track activity |
| Landlord / Owner | Manage properties, gallery, bookings, messages, and respond to deposit claims |
| Lister | List items, review rental requests, track earnings and payouts |
| Admin | Overview analytics, user moderation, property review, and dispute resolution |

## Tech stack

| Layer | Technology |
| --- | --- |
| Frontend | React 19, Vite 8, React Router 7 |
| Styling | Tailwind CSS 4 with a custom neo-brutalist design system |
| Backend | Supabase (PostgreSQL, Auth, Row-Level Security) |
| Maps | Leaflet with marker clustering |
| Notifications | react-hot-toast |
| Linting | oxlint |
| Deploy | Vercel, auto-deploy from `main` |

## Quick start

Requirements: Node.js 20+ and npm.

```bash
cd keylo-frontend
npm install
npm run dev
```

Open the URL printed by Vite, normally `http://localhost:5173`. Without Supabase credentials the app runs in a clearly labelled demo mode so the public prototype stays usable.

## Supabase setup

The backend is defined in the ordered files under `supabase/migrations/` and managed with the Supabase CLI — no manual SQL-editor pasting.

1. Install the CLI: `brew install supabase/tap/supabase`
2. Authenticate: `supabase login`
3. Link to the project: `supabase link --project-ref dmdkrhzcdpvutpptmfva` (enter the database password when prompted)
4. Copy `keylo-frontend/.env.example` to `keylo-frontend/.env.local`.
5. Add the project URL and anon key from **Project Settings > API**.
6. Restart Vite after changing environment variables.

**Applying migrations**

```bash
supabase migration new add_fancy_feature   # creates supabase/migrations/<timestamp>_add_fancy_feature.sql
# edit the generated file, then:
supabase db push                           # applies pending migrations to the remote database
```

`supabase migration list` compares local vs. remote history. `supabase db push` prompts for the database password on each run — set `SUPABASE_DB_PASSWORD` in your shell profile to skip the prompt. The CLI stores its local state in the gitignored `supabase/.temp/` directory; never commit it or a service-role key.

The migrations create profiles, Kolkata universities, properties, rooms, bookings, payments, deposits, inspections, handovers, maintenance, messages, saved properties, enums, indexes, booking guards, atomic test-payment completion, a new-user profile trigger, and row-level security policies.

## Demo accounts and dispute fixture

Demo identities (passwords live in the team vault, never in this repository):

- `student.demo@keylo.in` — student
- `landlord.demo@keylo.in` — landlord

Create them once in Supabase **Authentication > Users**, then apply the fixture migration (`20260809007000_keylo_dispute_fixture.sql`) via `supabase db push`. It seeds a published, fully verified demo property (Jadavpur, ₹9,000 rent / ₹12,000 deposit), a confirmed booking, three test-mode payments, and a held deposit — and is safe to re-run.

Walk the full deposit-dispute chain to demo the trust loop:

1. **Student** — `/dashboard/disputes`: open a dispute on the confirmed stay. KeyLo records the AI recommendation (full or partial refund based on the property trust score).
2. **Landlord** — `/owner/claims`: respond and propose a refund; the case moves to `admin_review`.
3. **Admin** — `/admin/disputes`: refund or deny. A refund releases the held deposit; a partial refund also drops the property trust score by 5, visible on the listing and in the score breakdown.

The fixture's verification query (commented at the bottom of the migration) reports the booking, payment count, deposit status, dispute status, final refund, and trust score.

## Project structure

```text
keylo-frontend/
  src/components/   Shared layout and UI components
  src/pages/        Route-level pages and demo data
  public/           Static public assets
  package.json      Frontend scripts and dependencies
supabase/
  migrations/       Ordered SQL migrations and demo fixtures
```

## Verification commands

```bash
cd keylo-frontend
npm run lint
npm run build
```

## Images and external assets

The frontend uses selected Unsplash image URLs for demo imagery. Review image licensing and replace remote URLs with approved, self-hosted assets before a commercial launch. Product logos and third-party marks should also be reviewed before publishing a public production deployment.

## Collaboration

See [CONTRIBUTING.md](CONTRIBUTING.md) for the team workflow.

## Production boundaries

- Test payments use a server-side Supabase RPC for atomic demo records; no real money is charged.
- Replace `test_mode` with a server-side Stripe or Razorpay integration and webhook verification before accepting money.
- Rotate demo administrator credentials, configure Supabase email confirmation and redirect URLs, and run Security Advisor before launch.
- Never add a Supabase service-role key to frontend environment variables or repository files.
