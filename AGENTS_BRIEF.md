# PadelCity Website Relaunch – Prototype Brief (for all contributors)

Project: /Users/manuelcramer/development/padelcity/website_relaunch/prototype
Stack: Next.js 15.5 App Router, React 19, TypeScript strict, Tailwind CSS v4 (tokens in src/app/globals.css), motion (motion/react), lucide-react, leaflet/react-leaflet. Do NOT add dependencies without asking the orchestrator.

## Goal
A responsive marketing website prototype for a technical workshop with the agency (Elephant) on Thursday. It must show a fresher, more modern PadelCity brand, position PadelCity as Germany's leading padel operator, present clubs in a "sexy" look & feel, and serve players, sponsors and investors (momentum of the Series A closed in summer 2026). Court booking stays APP-EXCLUSIVE: the website only shows info/availability and deep-links into the app. E-commerce (merch, vouchers) is a later phase – at most a teaser.

## Design language (follow strictly)
- Dark-first: page bg `bg-ink-800`, cards `bg-ink-700` with `border-white/10`, rounded-[20px]/[28px].
- Brand gradient `bg-brand-gradient` (magenta→purple, as in the app) and `bg-brandbook-gradient` (brand book purple). Text gradient: `text-brand-gradient`.
- NEW neon accent `neon-500` (#B4E854, tennis ball): use sparingly – one accent per viewport (an <Accent> word, a CTA, a dot).
- Headlines: `<Headline>` (Söhne Schmal Fett Kursiv, italic uppercase) with ONE `<Accent>` word (Good Brush, neon) per headline max. Body: Poppins.
- Buttons: `<Button>` (variants primary | gradient | neon | outline | ghost; pill with round arrow).
- Sections: `<Section tone="ink|black|purple|light|neon">`, containers via `container-site` utility.
- Reuse: `Eyebrow`, `Lead`, `Chip`, `Media` (image with branded fallback when file missing), `Reveal` (fade-up), `Marquee`, `AppIcon` (app icons from /public/icons as mask), `StoreBadges`, `PageHero`, `AppCta`, `NewsletterSignup`, `ClubCard`, `EventCard`.
- Microinteractions: hover lifts, rotate arrow, Reveal on scroll, marquee. Respect prefers-reduced-motion (Reveal does).
- Three breakpoints: phone (<768, default), tablet (`md:` 768), desktop (`lg:` 1200). Every page must look intentional at 375, 768 and 1440 px. No horizontal scroll. Header is fixed (~88px incl. offset) – heroes need top padding (PageHero handles it).
- Tone of voice (brand book): German, du-Form, loud, urban, energetic but welcoming. Short punchy lines. #bettertogether, "Let's play Padel!", "Make some noise for Padel".
- Accessibility: semantic landmarks, alt texts, labels, focus states, sufficient contrast.

## Shared files – DO NOT EDIT (ask orchestrator in your final report if you need a change)
src/app/globals.css, src/app/layout.tsx, src/app/fonts.ts, src/components/ui/*, src/components/layout/*, src/components/cards/*, src/components/modules/{PageHero,AppCta,NewsletterSignup}.tsx, src/lib/site.ts, src/lib/data/types.ts, src/lib/content/partners.ts.
You may create NEW files in your own area. Pages fetch data only through `@/lib/data` (server components) – never call Contentful/API directly from pages.

## Content rules
- No invented financial figures, investor names or funding amounts. Use clearly marked placeholders like `[XX] Mio. €` and add `{/* TODO(content): ... */}`.
- Known facts you may use: founded 2022, first club Ingolstadt; ~30 clubs / ~250 courts (key facts in src/lib/content/partners.ts); App on iOS/Android; brand-book milestones (One Point Challenge powered by CUPRA up to 100.000 € prize money, European Padel Championship 2025, PRO7 Promi Padel WM 2025, PadelCity Academy, PadelCity Series powered by Babolat, German champions titles 2025, franchise clubs Marburg/Neufahrn/Heilsbronn/Leun); founders team: Jonathan Sierck, Dr. Marcus Englert, Dr. Sebastian Weil, Hansi Flick.
- Values: Community, Fun, Commitment, Trust, Consistency, Welcoming, Energy. Personas: Leo, Nina, Steffen, Valeria, Kathrin, Tim (kids).
- Images: reference local files under /public/images/<area>/... (the assets agent fills them; Media falls back gracefully). Keep an `alt` for every image.
- Mark everything that would be a Contentful module with a short comment `// Contentful module: <name>` at the component top.

## Quality gate before you report
`npx tsc --noEmit` and `npm run lint` must pass for your files. Do not run `npm run build` or `npm run dev` concurrently with others unless told; if you need a visual check, use a dev server on your own port (e.g. `npx next dev -p 31xx`) and stop it afterwards. Do NOT git commit – the orchestrator commits.
Report: files created, Contentful modules proposed, open questions/TODOs, anything you needed from shared files.

---
# ROUND 2 – changes (read carefully, overrides anything above)

## 1. PadelCity credo: NO booking-system data on the website
No free slots, no availability, no occupancy ("noch 2 Plätze frei", places-left bars, "Heute verfügbar"), nothing read from api-platform. The PreProd API adapter, `getAvailability`, `Slot`, `Availability`, `/api/availability`, `deeplinks.slot`, `ClubEvent.spotsLeft/maxParticipants` are GONE. Data = Contentful master data (clubs, courts, facilities, coaches) + mocks. Prices "ab X €" (club base price) are fine. Booking → always deep link into the app (`deeplinks.club(id)`, `deeplinks.event(id)`) or store links. Illustrative app UI in phone mockups is fine (it shows the app, not live data).

## 2. Public key figures (approved): 30+ clubs, 200+ courts, 25+ cities. NO Series A figures (no volume, investors, date) – keep "Series A closed" wording without numbers and remove `[XX] Mio. €` placeholders for Series A entirely.

## 3. Real people only
Founders, team and coaches come from `src/lib/content/people.ts` (owned by the people agent, may be extended while you work – import, don't copy). Never invent people, names, quotes or photos. Remove illustrative coaches/"Faces" placeholders and use people.ts instead.

## 4. Bilingual: DE (root) + EN (/en) – static export
- Locale type: `@/lib/i18n/config` (`Locale = "de" | "en"`, `localeTags[locale].intl` for Intl formatting).
- Localized URLs: `@/lib/i18n/routes` → `href(locale, key, slug?)`; keys: home, locations, app, events, academy, magazine, franchise, investors, partners, about, jobs, imprint, privacy, terms. NEVER hardcode internal paths like "/standorte".
- Shared UI strings: `@/lib/i18n/dictionaries` (`getDictionary(locale)`). Page copy lives in your content files as `{ de: {...}, en: {...} }` (pattern: `src/lib/content/home.ts`).
- Pattern (see home): page logic lives in `src/views/<area>/<Name>View.tsx` taking `locale`; route files are thin wrappers:
  - DE: `src/app/(de)/<de-path>/page.tsx` → `<XView locale="de" />`
  - EN: `src/app/(en)/en/<en-path>/page.tsx` → `<XView locale="en" />`
  - Each wrapper exports `metadata`/`generateMetadata` with `alternates: alternates(key, slug, locale)` and, for dynamic routes, `generateStaticParams` + `export const dynamicParams = false`.
- Shared components now take `locale`: ClubCard, EventCard (+ `formatEventDate(iso, locale)`), AppCta, StoreBadges, NewsletterSignup, Logo, courtSummary(club, locale). Data: `getClubs(locale)`, `getClub(slug, locale)`, `getEvents({ clubId, locale })`.
- English copy must read native (UK English), not literal; keep brand phrases ("Let's play Padel!", "#bettertogether", "Make some noise for Padel").
- Static export (`output: "export"`, `trailingSlash: true`): no route handlers, no `revalidate`, no `searchParams` in server components (read query params client-side via `useSearchParams` inside `<Suspense>`), no `headers()/cookies()`. Images via next/image or `Media` work with basePath automatically; for raw `<a href>`/`<video>`/CSS `url()` to /public files use `asset()` from `@/lib/asset`.
- Client components that need locale: pass it as a prop.

## 5. Gate
`npx tsc --noEmit` and `npm run lint` must pass for your area. Do NOT run `next build` (parallel builds corrupt `.next`) – the orchestrator builds at the end. For visual checks use the dev server on http://localhost:3100 (DE) and http://localhost:3100/en/... (EN); do NOT start another server. Don't commit.
