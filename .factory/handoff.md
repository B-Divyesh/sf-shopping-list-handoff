# Shopping List Handoff — verification handoff

## Independent verification status: **FAIL**

Candidate `e9edbff1b8e2733d40d5843490d19b09d286c346` was independently tested
on 2026-08-28 at <https://shopping-list-handoff.sociobot.in>. The live hashed
assets exactly match this candidate, so this is not a deployment-only mismatch.
Do not release until the following defects in
[`.factory/verification.md`](./verification.md) are fixed and re-verified:

- **High:** QR copy says it opens the list in a browser, but the QR contains
  raw JSON with no URL/recipient import path; its end-to-end claim is absent.
- **High:** an unknown live URL returns the landing page with HTTP 200 instead
  of the designed 404 and status 404.
- **Medium:** the app accepts a negative quantity (`-2 g sugar`) as valid.
- **Medium:** invisible checkbox focus and 32–38px independent controls fail
  the supplied visible-focus/44px target baseline.
- **Medium:** the PWA cache uses the fixed `slh-v1` name and does not provide a
  reliable deployment update path.

All declared claim commands, the complete 8-test Playwright suite, exact
production build, live desktop/390px axe checks, and normal local handoff
flows passed. Full commands, measurements, privacy/network evidence, and
reproduction details are in the verification report.

---

# Builder handoff (superseded by independent verification above)

## Shipped

- Local-first ingredient parser with common weight and volume normalization.
- Checkable, category-grouped shopper card with warnings for produce counts and
  unmeasured items.
- Plain-text copy, print layout, local JSON handoff export and import, plus a
  real offline QR code. QR codes exclude both titles and shopper notes.
- Isolated `/demo` route with seeded pasta-night data, reset, and a separate
  `localStorage` namespace.
- Offline shell cache, responsive 390px layout, keyboard paths, legal pages,
  sitemap, robots, security headers, and a designed 404 page.
- Original generated blueprint illustration. Source artwork and prompt sidecar:
  `assets/src/blueprint-handoff.png` and `.json`; shipped WebP is 33 KB.

## Verify

Run from a clean clone:

```sh
npm install
npm test
npm run build
```

Verification on 2026-08-28:

- `npm test`: 8 Playwright tests passed, including every claim in
  `.factory/claims.json`, offline reload, QR decode/privacy, file export,
  mobile keyboard use, and an axe WCAG 2 A/AA scan.
- `npm run build`: passed; output is `dist/` with `index.html` at its root.
- Production-preview Lighthouse 12.2.1 on `/demo`: Performance 100,
  Accessibility 100, LCP 1.4 s, CLS 0, Total Blocking Time 0 ms.
- Built initial JS: 16.63 KB gzip; CSS: 3.13 KB gzip; hero WebP: 33 KB.
- Desktop and 390px mobile layouts were visually checked. No browser-console
  errors were observed in the Playwright runs.

## Known gaps and next steps

- The parser deliberately does not infer density. It will not convert between
  cups and grams, and it keeps count-based produce visible for human review.
- QR payload capacity is naturally limited by QR size; use plain text or the
  local file for unusually long lists.
- There is no live collaboration, retailer ordering, account system, or web
  recipe extraction. Those are explicit non-goals for v1.
