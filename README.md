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
npm run build       # production build (writes to .next-build)
npm run type-check
npm run lint
```

Builds use a separate output directory from the dev server so `npm run build` can run while `npm run dev` is up.

## Collection reference

`public/bonsai_plant_care_collection_corrected_aug_2026.md` is the source care document for the collection, with verified taxonomy (*Ficus annulata*, *Ehretia microphylla*, *Feroniella lucida*, *Trifidacanthus unifoliolatus*). The species data in `src/lib/bonsai/species.ts` is derived from it.

## Credits

Bootstrapped from [nextjs-15-starter-shadcn](https://github.com/siddharthamaity/nextjs-15-starter-shadcn) (MIT).
