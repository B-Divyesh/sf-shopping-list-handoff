# Shopping List Handoff — polish 2 handoff

## Status: shipped

Product repair commit: `aad3248e8c8a81591eb09c53fddb646f602bd4f3` (`fix: close
review two polish findings`), pushed to `origin/main` and deployed as static
site deployment `6c0d101b-eb3b-4af4-9598-a9449f42aa63`.

Live URL: <https://shopping-list-handoff.sociobot.in>

## What changed

- Rewrote the unsupported “works best” comparison as the direct instruction
  “Paste one ingredient per line.”
- Made the card print action visibly say **Print shopping list** on every
  screen, retaining the shortcut as secondary decoration.
- Used **handoff card** consistently for the product result and claim.
- Made each real route set its own description, canonical, Open Graph, and
  Twitter title/description. The designed 404 now includes favicon, Apple
  touch icon, Open Graph, and Twitter metadata.
- Kept the isolated direct `?demo=1` sample path; it presents the persistent
  banner, Reset demo, and Start for real controls and uses the demo namespace.
- Updated the verb-first catalog description, copy audit, claim wording, and
  cumulative repair map.

## Verification

From a separate clean clone of `aad3248` at
`/tmp/shopping-list-handoff-clean.mnVD8K`:

```sh
npm ci
npm run lint
npm run typecheck
npm test -- --reporter=list
npm run build
```

All passed: lint, typecheck, build, and **32 Playwright browser tests**. The
full suite covers accessible keyboard/mobile paths, routing/history/focus,
legal links, real 404 handling, privacy request logging, isolated demo storage,
offline reload, print, QR recipient flow, and service-worker replacement.

Every one of the 16 exact commands in `.factory/claims.json` also passed
independently from that clean clone. Local command output is retained at
`.factory/qa-evidence/polish-2/claims/` and the clean-clone logs are under the
temporary clone above. A tag-count audit confirms each `@claim:<id>` appears
exactly once.

Post-deploy cold checks:

- `verify-url.sh` passed on `/` and `/demo`: HTTP 200, correct title/lang,
  one h1, main landmark, no missing image alt text or unnamed buttons, and no
  console errors. Evidence: `.factory/qa-evidence/polish-2/live-root/` and
  `live-demo/`.
- Browser/axe retest of `/`, `/demo`, `/privacy`, `/terms`, `/handoff`, and
  `/missing-polish-2` found no serious or critical accessibility violations and
  no application console errors. Each route had the expected unique metadata;
  the missing route returned HTTP 404. Evidence:
  `.factory/qa-evidence/polish-2/live-route-check.json`.
- Cold `/?demo=1` live check found the sample list, demo banner, Reset demo,
  Start for real, Demo title, and `/demo` canonical.
- Lighthouse mobile live `/demo`: **100 Performance, 100 Accessibility, 100
  Best Practices, 100 SEO**; LCP **1201 ms**, CLS **0**. Evidence:
  `.factory/qa-evidence/polish-2/live-lighthouse.json`.
- Production build: initial JS **18.58 KB gzip**, CSS **3.80 KB gzip**.

See `.factory/polish-2.md` for the finding-by-finding repair map, tests,
screenshots, and live checks.

## Run and deploy

```sh
npm ci
npm run dev
npm test
npm run build
```

Deploy `dist/` as the Azure Static Web Apps static artifact. `dist/index.html`
is at its root and includes the routing configuration.

## Known gaps

None. This product deliberately has no runtime AI feature: its useful work is
deterministic local parsing, normalization, and private handoff.
