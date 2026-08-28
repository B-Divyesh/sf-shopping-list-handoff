# Independent verification 5 — PASS

**Candidate:** `d2cd55c374acbc408f497726cf31756523d0b3dd`  
**Verified URL:** <https://shopping-list-handoff.sociobot.in>  
**Date:** 2026-08-28  
**Scope:** clean install; declared-claim gate; production build; live parity;
desktop/mobile, keyboard, accessibility, privacy, PWA, headers, caching, and
performance checks. Product source was not modified.

## Release decision

**PASS.** The live product is the tested candidate, not the earlier
deployment-only artifact. The previous print, deletion/undo, and 404 findings
are repaired and verified in the deployed app. No release-blocking defects
were found.

## Cold first read — PASS

On a fresh live desktop page, before interaction, the first screen plainly
said what it does (**“Hand off a clear shopping list”**), who it is for
(cooks handing a list to someone outside their app), and what to click first
(**“Try it with sample data”**, with **“Opens a ready-to-send pasta list.”**).
The action is one click and enters the six-item demo with the persistent
**Demo — sample data, nothing is saved** banner, **Reset demo**, and
**Start for real**. The same headline, action, and three facts were visible in
a 390 × 844 viewport.

## Mandatory claims gate — PASS

`.factory/claims.json` exists with 14 entries. From the clean checkout after
`npm ci`, I invoked each exact declared command independently against the
production-build Playwright demo entry point. Every command passed (1/1):

| Claim ids | Result |
| --- | --- |
| `sample-demo`, `no-account`, `free-use` | Pass |
| `plain-text-export` | Pass |
| `local-file-private`, `local-file-roundtrip` | Pass |
| `print-sheet` | Pass; print media contains the shopper note |
| `qr-recipient`, `qr-private`, `recipient-checkable` | Pass |
| `quantity-normalization` | Pass |
| `local-only`, `local-data-private` | Pass |
| `offline-reload` | Pass |

Each tag occurs exactly once in `tests/app.spec.ts`. The full unfiltered suite
also passed: **28/28**.

## Local quality gates — PASS

- Clean checkout was at the stated SHA; `npm ci` added 137 packages and found
  0 vulnerabilities.
- `npm run typecheck`: pass.
- `npm run lint`: pass.
- `npm test`: pass, 28/28.
- `npm run build`: pass and wrote `dist/`.
- Production output: JS 48,432 bytes raw / **18,083 bytes gzip**; CSS 13,104
  bytes raw / **3,802 bytes gzip**; hero WebP 33,426 bytes. These are within
  the static-product budgets.

## Live deployment, product flow, and privacy — PASS

Live SHA-256 values matched the candidate build for the HTML, hashed JS and
CSS, service worker, 404 page/CSS, artwork, icons, robots, and sitemap. Key
matches:

| File | SHA-256 |
| --- | --- |
| `index.html` | `b298b714992344ec3e732feab5b526f057ba1e7161cc2fe12cb77a076530b651` |
| `assets/index-D2p86BJz.js` | `f0ffeda34fbc715f230d12797804b03708e4a6c3cf6fb87802a1b08e74214a30` |
| `assets/index-BJ60HI3P.css` | `6227d0105b9980f25d9942083528531f374b6451b5721e5d6c0faa87751ad031` |
| `service-worker.js` | `cac21c048e5e2ba9a8fb4ef9fbefba1b640892fa8164f43e97a5f0999cf9599b` |

`/`, `/demo`, `/privacy`, `/terms`, and `/handoff` returned 200; an unknown
path returned the designed 404 with HTTP 404. The completed live flow:

- loaded the isolated six-item demo in `slh:demo:list`;
- combined 500 g + 0.5 kg rice to 1 kg and showed the count-unit review
  warning;
- rejected `-2` with an announced correction, then accepted a corrected item;
- generated a QR recipient list that excluded a sensitive title and shopper
  note, wrote no recipient localStorage, and allowed Space to check an item;
- printed a shopper note in print media, and passed the local-file/no-note and
  import round-trip claim tests.

A populated live flow recorded only same-origin GET requests for the document,
JS, CSS, and image, all with null bodies. No request contained ingredient data,
the private title, note, QR fragment, or an app-added identifier. There are no
server endpoints, billing/unlock calls, sign-in, or third-party runtime calls;
429/`Retry-After`, Entra, backend concurrency, and library/CLI checks do not
apply.

## Accessibility, PWA, headers, and performance — PASS

- `/opt/fleet/lib/verify-url.sh` passed live `/demo`: 200, title/lang, one h1,
  main landmark, no missing alt text or unnamed buttons, and no browser errors.
- Live axe WCAG 2 A/AA scans on `/`, `/demo`, `/privacy`, `/terms`, and an
  invalid `/handoff` found zero serious or critical violations.
- At 390 px there was no horizontal overflow. Tab first focused the visible
  skip link; the main demo and recipient checklist worked by keyboard. Reduced
  motion uses `scroll-behavior: auto`.
- The live worker controlled the page with cache `slh-e67a61b07a6e`; after the
  first visit, a fully offline reload of `/demo` returned the heading and all
  six items with no errors. The local suite also verifies a revision update.
- Responses have self-only CSP including response-header `frame-ancestors`,
  HSTS, `nosniff`, and strict-origin referrer policy. HTML revalidates at 30 s;
  hashed assets are immutable for one year; the worker is `no-cache`.
- Fresh live mobile Lighthouse: **99 Performance**, **100 Accessibility**;
  FCP 1.0 s, LCP 1.3 s, TBT 100 ms, CLS 0.

## Defects and next steps

No defects found. No product change is needed. Future changes should retain
the exact claim-command gate and byte-match the deployed artifact before
release.
