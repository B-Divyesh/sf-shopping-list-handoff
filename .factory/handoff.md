# Shopping List Handoff — repair handoff

## Status

All release-blocking findings from verifier report commit
`6a241aec9128c0e6972181182859f34263f77ffc`, against candidate
`e9edbff1b8e2733d40d5843490d19b09d286c346`, are repaired. The static build
was deployed to <https://shopping-list-handoff.sociobot.in> on 2026-08-28.

## Repairs

- QR codes now contain a `/handoff#list=…` URL. A fresh browser opens a
  checkable recipient view. The fragment carries only item lines, is not sent
  in HTTP requests, and is not stored in the recipient browser. Titles and
  shopper notes remain excluded. Claim `qr-recipient` covers the complete
  decode-and-open flow; `qr-private` covers exclusions.
- Azure Static Web Apps now rewrites only `/demo`, `/privacy`, `/terms`, and
  `/handoff` to the SPA. Unknown paths reach the designed `404.html` and keep
  HTTP status 404. The 404 stylesheet is external and CSP-compatible.
- Quick-add and pasted lines reject negative or non-finite quantities with a
  specific, live-announced correction. Imported and QR payload quantities are
  validated at the same trust boundary.
- Checklist focus is drawn on the visible tick box. Demo actions, remove
  buttons, navigation links, file input, and independent text links have
  44px minimum targets.
- The build generates a content-hashed service-worker cache and a complete
  15-URL shell manifest. Navigation is network-first, old `slh-*` caches are
  removed on activation, and an automated two-deployment test proves the new
  revision works offline.

## Verification evidence

Clean local release run:

```sh
npm ci
npm run lint
npm run typecheck
npm test
npm run build
```

- `npm ci`: 138 packages audited, 0 vulnerabilities.
- `npm run lint`: passed.
- `npm run typecheck`: passed.
- `npm test`: 13/13 Playwright tests passed against the production build.
- Every command in `.factory/claims.json` was also run independently; all
  eight claims passed.
- `npm run build`: passed and produced `dist/index.html`.
- Initial JavaScript: 46.23 KB raw / 17.72 KB gzip. CSS: 11.52 KB raw /
  3.41 KB gzip. Hero WebP: 33.4 KB.
- Generated service-worker revision: `slh-0fc9ef2a9181`, with all hashed JS
  and CSS plus known routes and static shell files precached.
- Local Lighthouse 12.2.1 `/demo`: Performance 100, Accessibility 100,
  Best Practices 100, SEO 100; LCP 1.7 s, CLS 0, TBT 30 ms.

Production evidence from the custom domain:

- `/`, `/demo`, `/privacy`, `/terms`, and `/handoff` return HTTP 200.
  `/missing-release-check` returns the designed page with HTTP 404.
- Built and live SHA-256 values match for JS `e260fd85…`, CSS `f264d06e…`,
  hero artwork `309e5dd5…`, service worker `89db43e9…`, and 404 CSS
  `922c337c…`.
- Hashed assets return `Cache-Control: public, max-age=31536000, immutable`.
  The service worker returns `Cache-Control: no-cache`.
- HTTPS includes HSTS, `nosniff`, strict-origin referrer policy, and the
  self-only CSP declared in `staticwebapp.config.json`.
- Fresh live desktop (1440px) and mobile (390px) browser runs showed one h1,
  no horizontal overflow, no console/page errors, only same-origin requests,
  and no serious or critical axe WCAG 2 A/AA findings.
- A live QR was decoded, opened in a fresh 390px browser context, and showed
  the recipient list. Its title/note were absent, the URL fragment was absent
  from network requests, and localStorage stayed empty.
- Live offline reload passed with cache `slh-0fc9ef2a9181`.
- Live Lighthouse 12.2.1 `/demo`: Performance 100, Accessibility 100,
  Best Practices 100, SEO 100; LCP 1.2 s, CLS 0, TBT 20 ms.

## Regression coverage

`tests/app.spec.ts` covers the original passing flows and adds exact checks
for recipient QR opening/privacy, malformed handoff recovery, negative quick
and pasted quantities, 44px mobile targets, visible checkbox focus, HTTP 404
status/config, multi-revision offline updates, all public-route accessibility,
and console errors.

## Known limits

- The parser does not infer food density. It does not convert cups to grams.
- Count-based produce remains visible for human review.
- QR capacity is finite. Oversized lists get a recovery message directing the
  sender to plain text or a local file.
- There is no account, cloud list, retailer order, or live collaboration.
