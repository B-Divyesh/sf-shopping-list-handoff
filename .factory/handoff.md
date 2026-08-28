# Shopping List Handoff — polish 3 handoff

## Status: complete

The review-three repair is deployed at
<https://shopping-list-handoff.sociobot.in>. Product repairs were committed as
`7f56ffa`, `e633c86`, and `68a5f6a`; Azure Static Web Apps deployment
`8c3a40df-844c-4d75-8afd-5549b2a3b52b` completed successfully.

## What changed

- `/demo` and `?demo=1` now immediately show the realistic Wednesday pasta
  night handoff card. The persistent isolated-demo banner includes Reset demo
  and Start for real. The landing action reaches that view in one click.
- Rewrote all review-three subjective, jargon-heavy, serial, slogan, and
  metaphor copy. The wordmark is now Shopping List Handoff; legal and 404
  headings state their route plainly.
- Preserved user-entered cooking measures unless compatible units actually
  merge; mixed volume quantities choose readable tsp/tbsp/cup output.
- Restored scroll position as well as route-heading focus on browser Back.
- Kept and retested every preceding QR, print, Undo, storage isolation,
  offline, metadata, 404, reflow, and accessibility repair.

The full finding-to-change-to-evidence table is in
[polish-3.md](polish-3.md). The catalog description is a verb-first 77-character
sentence in `catalog-description.txt`.

## Verification

### Clean clone and claims

A separate clone ran the work-order build commands successfully:

```sh
npm ci
npm run lint
npm run typecheck
npm test -- --reporter=list
npm run build
```

The result is [full-gates.txt](qa-evidence/polish-3/clean-clone/full-gates.txt):
32 Playwright tests passed and `dist/` was produced. Each of the 16 exact
commands in `.factory/claims.json` then passed independently; the transcripts
are in `qa-evidence/polish-3/clean-clone/claims/`. The one-tag-per-claim audit
is [claims-tag-audit.txt](qa-evidence/polish-3/claims-tag-audit.txt).

### Local build and browser checks

- `npm run typecheck`, `npm run lint`, `npm test -- --reporter=list`, and
  `npm run build` pass.
- Build output: JavaScript 49.81 KB raw / 18.73 KB gzip; CSS 13.88 KB raw /
  3.97 KB gzip. The uploaded static artifact was 171,881 bytes.
- The test suite covers keyboard flows, Undo/focus recovery, print media,
  imports/exports, QR privacy and recipient checks, mobile 200% reflow,
  accessibility, service-worker upgrade, offline reload, routes, metadata,
  and a real 404.
- `verify-url.sh` passed for local `/` and `/demo`: title, `lang`, one h1,
  main landmark, alts, named buttons, and console checks. Reports are in
  `qa-evidence/polish-3/verify-local-root/` and `verify-local-demo/`.

### Cold live checks after deployment

- `verify-url.sh` passed deployed `/` and `/demo` with zero console errors;
  reports are in `qa-evidence/polish-3/live-root/` and `live-demo/`.
- Fresh 390 × 844 live demo has the card title at y=396, spaghetti at y=685,
  and olive oil at y=730; all are inside the first viewport. See
  `live-product-check.json` and `live-demo/demo-mobile-390.png`.
- Fresh live `?demo=1` has the banner, Reset demo, Start for real, and the
  demo-specific h1. Back from Privacy restored `scrollY` from 1200 to 1200
  while focusing the landing h1.
- Live metadata is route-specific for `/`, `/demo`, `/privacy`, `/terms`, and
  `/handoff`; the missing-page route returns HTTP 404 with favicon, Apple
  touch icon, Open Graph, and Twitter metadata. See `live-route-metadata.json`.
- Live Axe WCAG 2 A/AA scans found zero violations at any impact on `/`,
  `/demo`, `/privacy`, `/terms`, `/handoff`, and the 404. See `live-axe.json`.
- A populated live demo made only same-origin GET requests with null bodies;
  no private title or shopper note appeared in requests. See `live-privacy.json`.
- A cold live offline reload retained the demo heading and spaghetti. See
  `live-product-check.json`.
- Mobile Lighthouse on the deployed landing: Performance 100, Accessibility
  100, Best Practices 100, SEO 100; FCP 915 ms, LCP 1,215 ms, TBT 0 ms,
  CLS 0, transfer 57,777 bytes. See `lighthouse-live.json` and
  `lighthouse-summary.txt`.

## How to run, test, and deploy

```sh
npm ci
npm run dev
npm run lint
npm run typecheck
npm test
npm run build
```

Deploy `dist/` as the static Azure Static Web Apps artifact. The current work
order used `/opt/fleet/lib/deploy-static.sh shopping-list-handoff dist`.

## Known gaps and next steps

None. The product remains intentionally local-first and deterministic; AI
would add a privacy and cost boundary without improving this parsing and
handoff task.
