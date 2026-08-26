# Mr. Bonsai

A mobile-first app for tracking and caring for a personal bonsai collection.

Built for a collection grown in a tropical climate (Thailand): species-aware watering, feeding and repotting schedules, a photo timeline per tree, wiring logs with automatic wire-check reminders, and a species knowledge base.

## Features

**Collection** — a profile per tree with photo, species, location, estimated age, purchase price and shop, and a development stage (cutting / development / refinement). Sorted oldest first.

**Care tasks** — watering, fertilizing, repotting and wire-check reminders derived from each species' schedule and the current season, plus your own custom tasks. Cuttings get watering reminders only until they root.

**Progress timeline** — dated photo and note entries per tree, typed as note, pruning, wiring, repotting or styling. Logging a wiring entry schedules a wire check six weeks later; logging a repotting entry resets the repot schedule.

**Knowledge base** — species care guides with a season-by-season calendar, articles for beginners and advanced growers, and video references. Guides for species you own are surfaced first.

## Stack

Next.js 15 · React 19 · TypeScript · Tailwind CSS 4 · shadcn/ui. Data is stored in the browser's localStorage — there is no backend and no account.

## Development

```bash
npm install
npm run dev      # http://localhost:3000
```

```bash
npm run build        # production build (used by Vercel; writes to .next)
npm run build:local  # local build check (writes to .next-build)
npm run type-check
npm run lint
```

Use `build:local` when the dev server is running — it writes to a separate directory so it never clobbers the dev server's `.next` cache. Deployment platforms run the standard `build`, which must stay on `.next`.

## Sync (Supabase)

Optional — without configuration the app runs local-only (localStorage + IndexedDB in one browser). With it, the collection and photos sync across devices; last write wins.

One-time setup:

1. Create a project at [supabase.com](https://supabase.com) (free tier).
2. SQL Editor → paste and run [`supabase/setup.sql`](supabase/setup.sql) — creates the state table, private photo bucket and row-level security.
3. Authentication → Users → **Add user**: your own email + a password (email confirm not needed for a personal account).
4. Project Settings → API: copy the **Project URL** and **anon public** key into:
   - `.env.local` (see `.env.example`) for local development
   - Vercel → Project Settings → Environment Variables, then redeploy
5. Open the app → Grow → cloud icon → sign in once per device.

## Collection reference

`public/bonsai_plant_care_collection_corrected_aug_2026.md` is the source care document for the collection, with verified taxonomy (*Ficus annulata*, *Ehretia microphylla*, *Feroniella lucida*, *Trifidacanthus unifoliolatus*). The species data in `src/lib/bonsai/species.ts` is derived from it.

## Credits

Bootstrapped from [nextjs-15-starter-shadcn](https://github.com/siddharthamaity/nextjs-15-starter-shadcn) (MIT).
