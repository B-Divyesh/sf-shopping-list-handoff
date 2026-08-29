# Shopping List Handoff — polish 4 handoff

## Status: ready

Repair code commit: `91a358125a8f9237866b52d89c601c35f0251343`<br>
Deployment: `048ca186-b7c3-4516-a9f2-2979f3ad8098`<br>
Live: <https://shopping-list-handoff.sociobot.in>

The round-4 blocking Terms promise was removed. It claimed that the tool did
not place orders, contact retailers, or provide live collaboration, but those
three boundaries had no narrow observable claim test. The Terms page now keeps
the declared free-use statement, a user instruction, and the legal as-is
limitation. The new browser regression verifies the deleted scope promise does
not return. The verb-first catalog description is now: “Turn pasted ingredients
into a handoff card.”

## Verification

- Fresh clone of repair commit: `npm ci`, `npm run lint`, `npm run typecheck`,
  `npm test -- --reporter=list` (**33 passed**), and `npm run build` passed.
- All 16 exact `.factory/claims.json` commands passed independently. Every
  manifest id occurs exactly once as `@claim:<id>`.
- The local and live `verify-url.sh` checks passed for `/demo` and `/terms`;
  cold live checks also passed for `/`. They found `lang`, title, one h1, main,
  alt text, labeled controls, and no console errors.
- The full browser suite covers claims, demo isolation, QR recipient flow,
  file import/export, print, keyboard/mobile reflow, privacy requests, routes,
  404, accessibility axe scans, and offline service-worker reload.
- Live cold audit confirms `/`, `/demo`, `/?demo=1`, `/privacy`, `/terms`,
  `/handoff`, and `/missing-polish-4`; the last is a real 404. It also confirms
  demo-only storage, recipient no-storage, same-origin GET-only requests, no
  console errors, and no serious/critical axe findings. See
  [live-product-check.json](qa-evidence/polish-4/live/live-product-check.json).
- Live Lighthouse `/demo`: Performance **100**, Accessibility **98**, Best
  Practices **100**, SEO **100**; LCP **946 ms**, CLS **0**, TBT **22 ms**.
  Initial JS is **18,382 bytes gzip** and CSS is **3,972 bytes gzip**.

See [polish-4.md](polish-4.md) for the complete cumulative finding-to-change
map and screenshots. Evidence is in `.factory/qa-evidence/polish-4/`.

## Run locally

```sh
npm ci
npm run lint
npm run typecheck
npm test
npm run build
```

Deploy `dist/` to Azure Static Web Apps. No known gaps remain.
