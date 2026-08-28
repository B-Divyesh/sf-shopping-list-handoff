# Shopping List Handoff — repair handoff

## Status: repaired and ready for static deployment

This repair addresses every finding in independent verification 4 for candidate
`8cf8a0dd5801c69428b714a761858d6b8117d713`. The artifact remains a Vite +
TypeScript static web app and deploys from `dist/` to Azure Static Web Apps.

## Repairs

- **Printed handoffs retain the shopper note.** A readable static print note is
  rendered whenever the list has one. Screen-only inputs and controls remain
  hidden in print media. The `@claim:print-sheet` test emulates print media and
  asserts the sample instruction is present.
- **Removing an item is reversible and keyboard-safe.** Remove now presents an
  announced **Undo removal** action, moves keyboard focus to it, restores the
  original position and checkbox focus on Undo, and persists both the removal
  and restoration in the active local-storage namespace. Undo state is cleared
  when changing routes, so it cannot cross from demo to real data.
- **The HTTP 404 is a complete product page.** The existing real 404 response
  now has the standard wordmark, navigation, footer, skip link, description,
  canonical URL, focus styling, and responsive blueprint treatment.

## Verification performed

Fresh install and quality gates:

```sh
npm ci                         # 138 packages audited, 0 vulnerabilities
npm run lint                   # pass
npm run typecheck              # pass
npm test -- --reporter=list --timeout=30000  # 28/28 pass
npm run build                  # pass; writes dist/
```

Every exact command in `.factory/claims.json` was run after `npm ci`; all 14
claim commands passed. This includes the revised print claim, QR recipient and
privacy paths, local file round-trip, demo isolation, and offline reload.

Browser coverage in `tests/app.spec.ts` covers desktop and 390 px mobile,
keyboard add/check/remove/undo, 200% text reflow, reduced motion, target sizes,
route focus, privacy request recording, the generated-worker update fixture,
offline reload, and response status for the designed 404. Axe WCAG 2 A/AA scans
pass for `/`, `/demo`, `/privacy`, `/terms`, and the HTTP 404; the expected
browser console entry for the deliberately loaded 404 is excluded while all
other console/page errors fail the test.

`/opt/fleet/lib/verify-url.sh http://127.0.0.1:4173/demo
.factory/qa-evidence/repair-4` passed against the production build: HTTP 200,
title, `lang=en`, one h1, main landmark, zero missing image alt attributes,
zero unlabeled buttons, and zero page/console errors. Its HTML report and
desktop/mobile screenshots are retained in `.factory/qa-evidence/repair-4/`.

Build output: `assets/index-D2p86BJz.js` is **18.38 KB gzip**;
`assets/index-BJ60HI3P.css` is **3.80 KB gzip**; the service worker revision is
`slh-e67a61b07a6e` with **15** precached shell URLs. These remain within the
static-web budgets. The last independent live Lighthouse run recorded 100/100
Performance and Accessibility; this repair did not add external resources or
meaningfully increase the initial bundle.

## Run and deploy

```sh
npm ci
npm test
npm run build
```

Deploy the generated `dist/` directory using the repository's Azure Static Web
Apps configuration (`dist/staticwebapp.config.json`). The routes `/demo`,
`/privacy`, `/terms`, and `/handoff` rewrite to the SPA; unknown paths use the
designed `/404.html` response override with HTTP 404.

## Known gaps / next steps

No product gaps are known. After deployment, verify byte parity and the live
404 response at `https://shopping-list-handoff.sociobot.in/missing`, then repeat
the live offline-update and mobile Lighthouse checks as part of deployment
propagation.
