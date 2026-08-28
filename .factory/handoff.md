# Shopping List Handoff — polish 1 handoff

## Status: PASS

Repair commit: `a3a80bbb54d03689a2b541e43826c3be924bc1e8` (pushed to `main`).
Base reviewed: `4050e39013f02032b4ffbea9fac58bd35079f4da`.

## Delivered

- Replaced the unsupported “recipe details” promise with **“Pasted ingredients
  become a shopping card.”** in the UI and README. The new
  `pasted-ingredients-to-card` claim tests pasted quantities and names in the
  actual card.
- Removed the broad “any recipe app” wording and the two decorative review
  labels. The first screen now leads with the job, audience, action, outcome,
  and three tested facts.
- Added `site-data-clear`, covering both real and demo browser storage after a
  site-data clear. The manifest now has 16 claims, each with exactly one tag.
- Retained and reverified all cumulative repairs: isolated `/demo` and
  `?demo=1`, print notes, undoable removal, QR recipient sharing, privacy,
  finite quantities, real routes/history/focus, legal pages, 404, mobile
  reflow, targets, focus, and service-worker update behavior.
- Updated the catalog sentence, copy audit, repair map, and screenshots.

## Exact verification evidence

### Clean clone

Fresh clone: `/tmp/slh-clean-a3a80bb` at
`a3a80bbb54d03689a2b541e43826c3be924bc1e8`.

```sh
npm ci
npm run lint
npm run typecheck
npm test -- --reporter=list
npm run build
```

All pass: **30/30** Playwright tests, with production `dist/index.html`.
Every exact command from `.factory/claims.json` was then run independently
from that clone and passed (16/16):

```sh
npm test -- --grep @claim:sample-demo
npm test -- --grep @claim:no-account
npm test -- --grep @claim:free-use
npm test -- --grep @claim:pasted-ingredients-to-card
npm test -- --grep @claim:plain-text-export
npm test -- --grep @claim:local-file-private
npm test -- --grep @claim:local-file-roundtrip
npm test -- --grep @claim:print-sheet
npm test -- --grep @claim:qr-recipient
npm test -- --grep @claim:qr-private
npm test -- --grep @claim:recipient-checkable
npm test -- --grep @claim:quantity-normalization
npm test -- --grep @claim:local-only
npm test -- --grep @claim:local-data-private
npm test -- --grep @claim:site-data-clear
npm test -- --grep @claim:offline-reload
```

The tag-count audit reports every listed tag exactly once. The suite includes
Playwright axe WCAG 2 A/AA checks, request/body privacy interception, offline
reload and service-worker replacement, keyboard/focus, responsive 390 px and
200% text tests, routing, legal pages, and the designed HTTP 404.

### Build and local browser checks

- `npm run build`: pass; service-worker revision `7e0bc2b6d4f5`, 15 shell URLs.
- Initial production JS: **18.35 KB gzip**; CSS: **3.80 KB gzip**; hero: 33.4 KB.
- `verify-url.sh http://127.0.0.1:4173/demo`: pass: title, `lang=en`, one h1,
  main, zero missing image alts/unlabelled buttons, and zero console errors.
- Visual evidence: `qa-evidence/polish-1/landing-mobile-390.png`,
  `qa-evidence/polish-1/demo-mobile-390.png`, and
  `qa-evidence/polish-1/404-mobile-390.png`.

### Deployment and cold live recheck

Deployed the work-order `dist/` output to Azure Static Web Apps production:
`sf-shopping-list-handoff` in resource group `sociobot`. The live page now
serves `assets/index-qAET-YQJ.js`, matching this build and containing both
rewritten phrases.

- Cold mobile browser check at
  <https://shopping-list-handoff.sociobot.in>: pass. The job, audience, first
  action, outcome, and all three facts fit in 390 × 844. It has no removed
  labels or broad compatibility promise.
- One click opens `/demo`; direct `?demo=1` also opens the isolated six-item
  demo with banner, Reset demo, and Start for real. A live pasted-lentil flow
  rendered names and quantities on the card.
- Live `/privacy`, `/terms`, `/#how`, `/handoff`, and the styled HTTP 404 were
  rechecked. Titles, legal links, route behavior, and mobile width pass.
- Live axe WCAG 2 A/AA: zero serious/critical issues on `/`, `/demo`,
  `/privacy`, `/terms`, invalid `/handoff`, and 404. Offline reload after
  service-worker activation passes.
- `verify-url.sh https://shopping-list-handoff.sociobot.in/demo`: pass with no
  browser errors. Live evidence: `qa-evidence/polish-1/live/verify.json`,
  `live/landing-mobile-390.png`, `live/demo-mobile-390.png`, and
  `live/404-mobile-390.png`.
- Lighthouse 12.8.2 on live `/demo`: **100 Performance, 100 Accessibility,
  100 Best Practices, 100 SEO**; LCP 1,205 ms, TBT 31 ms, CLS 0. Raw report:
  `qa-evidence/polish-1/live/lighthouse.json`.

## Known gaps

None. This is a static, local-first product; it has no accounts, payments,
server APIs, analytics, or AI feature.

## Run and deploy

```sh
npm ci
npm test
npm run build
```

Deploy `dist/` to the existing Azure Static Web App production environment.
