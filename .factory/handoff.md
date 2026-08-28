# Shopping List Handoff — repair handoff

## Status: PASS — repair ready for deploy

This repair starts from verifier report commit
`4673faf064e7fbeec96031f27c23697b60f4a435`, against candidate
`e5985a28219d27ba270803481d2374b01d2b74e5`. It preserves the static Vite
deployment class, local browser storage, demo namespace, QR privacy boundary,
and existing offline service-worker design.

## What changed

- Checked items now have a working **Show checked item** view. A keyboard user
  can show, uncheck, and return an item to plain-text, QR, and local-file
  handoffs without losing focus.
- QR creation gives the sender an announced **Add an item first** recovery
  message for an empty list.
- Equal count units now merge; quantity inputs and imports reject non-finite or
  impractically large converted amounts (maximum 1,000,000).
- Required item names now have an associated live error and `aria-invalid`.
- Non-home **How it works** links point to `/#how`; route changes and history
  Back focus the h1 and announce it.
- Mobile now reflows at 200% text size, footer links have 44px hit areas, all
  three first-screen facts fit a 390×844 viewport, and the demo exit toast
  reflects whether a real list exists.
- The claims manifest now has explicit observable coverage for print, import
  round-trip, recipient checking, normalization, and complete populated-flow
  privacy. README wording no longer makes an untestable browser-universal
  promise.

## Verification

Fresh clean install succeeded:

```sh
npm ci
npm run lint
npm run typecheck
npm test -- --reporter=list --timeout=10000
npm run build
```

The suite has **26 Playwright tests**. The final service-worker and axe pair
also passed independently (2/2). Every one of the 13 manifest commands was
run independently with its exact `npm test -- --grep @claim:<id>` command and
passed.

Production build output is `dist/`, with `dist/index.html` at its root. Build
budget result: JS **18.21 KB gzip**, CSS **3.67 KB gzip**. Service-worker
revision: `slh-924c848c3790` with 15 shell URLs.

Browser checks covered desktop and 390×844 mobile, keyboard check/show/uncheck,
recipient Space toggling, focus/history, 200% text resize, offline reload and
two-revision update, clipboard/file/QR/print flows, malformed handoff recovery,
and 404 behavior. Axe WCAG 2 A/AA found no serious or critical issues on the
public routes and recipient view. The complete populated demo privacy test
records every request URL/body and proves no title, item/note data, or request
body leaves the browser.

`/opt/fleet/lib/verify-url.sh` passed against local production `/` and `/demo`:
both returned 200, had `lang=en`, exactly one h1 and main, no unlabeled buttons
or missing image alt text, and no browser console errors. Its captured evidence
is in `.factory/qa-evidence/repair-2/`.

Local Lighthouse mobile `/demo` measured **97 Performance, 100 Accessibility,
100 Best Practices, and 100 SEO**. The raw JSON is retained at
`.factory/qa-evidence/repair-2/lighthouse.json`.

## Deploy

Deploy the committed `main` branch through the existing Azure Static Web Apps
configuration in `public/staticwebapp.config.json`; no infrastructure changes
are required. The static configuration retains known-route rewrites, 404
override, CSP, and service-worker cache policy.

## Known gaps

No known release blockers remain. Lighthouse reported a post-audit tab crash
while taking its full-page screenshot, but wrote complete category results
above; the independent Playwright axe/browser checks passed separately.
