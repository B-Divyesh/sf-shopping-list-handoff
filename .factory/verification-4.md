# Independent verification 4 — FAIL

**Candidate:** `8cf8a0dd5801c69428b714a761858d6b8117d713`  
**Verified URL:** <https://shopping-list-handoff.sociobot.in>  
**Date:** 2026-08-28  
**Scope:** clean install and claim gate, local production build, live artifact
parity, end-to-end handoff paths, invalid and boundary inputs, privacy/network
behavior, desktop and 390 px mobile, keyboard, accessibility, PWA/offline,
headers/caching, links, and mobile Lighthouse. Product code was not modified.

## Release decision

**FAIL.** The requested candidate is deployed, the mandatory first-read gate
passes, all 14 declared claim commands pass, and the app's main local, text,
file, and QR paths work. Release is nevertheless blocked because the print
handoff silently drops the field explicitly labelled **Note for the shopper**.
The realistic demo note is absent under print media, so a core handoff method
can omit the buyer instruction without warning. Item deletion also violates
the supplied destructive-action and keyboard-feedback contract.

## Mandatory first-read gate — PASS

In a cold 1440 × 900 browser, without scrolling, the first screen answered:

- What: **“Hand off a clear shopping list.”**
- For whom: **“For cooks who need someone outside their app to shop without
  questions.”**
- First click: **“Try it with sample data,”** followed by **“Opens a
  ready-to-send pasta list.”**

The action is one click from the landing page. It opened `/demo`, showed the
six-item Wednesday pasta list, and displayed the persistent **Demo — sample
data, nothing is saved** banner with **Reset demo** and **Start for real**.
The same headline, audience, action, explanation, and three facts were visible
in the first 390 × 844 viewport.

## Required claims gate — PASS

`.factory/claims.json` exists and contains 14 claims. After `npm ci`, every
exact `test` value was invoked separately against the production-build demo
entry point. All passed:

| Claim | Result |
| --- | --- |
| `sample-demo` | Pass, 1/1 |
| `no-account` | Pass, 1/1 |
| `free-use` | Pass, 1/1 |
| `plain-text-export` | Pass, 1/1 |
| `local-file-private` | Pass, 1/1 |
| `local-file-roundtrip` | Pass, 1/1 |
| `print-sheet` | Pass, 1/1 |
| `qr-recipient` | Pass, 1/1 |
| `qr-private` | Pass, 1/1 |
| `recipient-checkable` | Pass, 1/1 |
| `quantity-normalization` | Pass, 1/1 |
| `local-only` | Pass, 1/1 |
| `local-data-private` | Pass, 1/1 |
| `offline-reload` | Pass, 1/1 |

Each `@claim:<id>` tag occurs exactly once in `tests/app.spec.ts`.

## Local repository gates — PASS

- Checkout started clean at the exact candidate SHA.
- `npm ci`: pass; 138 packages audited, 0 vulnerabilities.
- `npm run lint`: pass.
- `npm run typecheck`: pass.
- `npm test -- --reporter=list --timeout=30000`: **27/27 passed**.
- `npm run build`: pass; `dist/` was produced with `dist/index.html` at its
  root and service-worker revision `slh-924c848c3790` containing 15 shell URLs.
- Vite output: JavaScript 47.82 KB raw / **18.21 KB gzip**; CSS 12.48 KB raw /
  **3.67 KB gzip**; hero WebP **33,426 bytes**. All are inside the supplied
  static-web budgets.

## Live deployment and parity — PASS

The live hostname byte-matched the candidate build for all 12 checked public
artifacts: `index.html`, hashed JavaScript and CSS, hero and social images,
favicon, Apple icon, service worker, 404 page/CSS, robots, and sitemap. Notable
SHA-256 matches were:

| Artifact | SHA-256 |
| --- | --- |
| `index.html` | `3c8aaae0704148daf365841c5e8c0361a7e0ac9d35b89a5e3c3928703e3db82c` |
| `assets/index-GOtFqmZj.js` | `45e8380cdbd8a60723bb3cd2404b758b34d26c7e049f30cfe798285410dfb6da` |
| `assets/index-BgLP8eEe.css` | `b133d2363d6b7b610fd0a4ce8dd5b4ce8425f5f72380fcb0e1fc121bfd40a88d` |
| `service-worker.js` | `d4940603e612cc0cae2b158bcac40b1237019221eec3ad19e9065fc15649bdeb` |

This fresh evidence rules out the previously reported deployment-only
failure. `/`, `/demo`, `/privacy`, `/terms`, and `/handoff` returned 200. An
unknown route returned the designed page with HTTP 404.

## End-to-end and recovery evidence

- Starting from the sample, a fresh list normalized `500 g rice` + `0.5 kg
  rice` to `1 kg`, `½ cup milk` to `118.29 ml`, and two bunches of basil to
  `2 bunch`, with the count/produce warning visible.
- Negative quick-add and paste quantities were rejected with announced,
  focused correction messages. Blank names, malformed JSON, amount overflow,
  and empty QR creation all produced usable recovery paths. `1,000,000 g` was
  accepted and normalized; `1,000,000.01 g` was rejected.
- HTML-like item text rendered as text, created no injected image, and ran no
  handler. A 180-item QR overflow failed softly and kept plain-text and local
  file alternatives available.
- Plain-text copy contained the four live items and the shopper note. A saved
  local file used `shopping-list-handoff/v1`, omitted the note, and imported
  into a fresh browser as the same six-item titled list.
- The decoded QR was a same-origin `/handoff#list=…` URL. It excluded the
  private title and note, opened four items in a fresh 390 px context, stored
  no localStorage keys, and allowed Space to check an item.
- Demo reset restored the pasta list. **Start for real** removed the demo key
  and opened the separate real namespace.

## Privacy, server scope, and response policy — PASS

A populated live flow with title `Private household 17` and note `Gate code
1234` recorded five outgoing requests. Every request was a same-origin `GET`;
none had a body, cookie, Authorization header, title, note, QR fragment, or
list item data. Browser-standard User-Agent/client-hint headers were present;
the app added no identifier. Source inspection found no fetch/XHR, analytics,
sign-in, payment, unlock, AI, or third-party runtime endpoint.

The live responses include a self-only CSP, HSTS,
`X-Content-Type-Options: nosniff`, and
`Referrer-Policy: strict-origin-when-cross-origin`. HTML revalidates after 30
seconds; an `If-None-Match` request returned 304. Hashed assets use one-year
immutable caching, and the service worker uses `no-cache`.

This is a static product with no server-side endpoint, billing/unlock call, or
sign-in. API allowance/429/`Retry-After` and Microsoft Entra authority checks
are therefore not applicable. Library/CLI consumer installation is also not
applicable.

## Accessibility, responsive behavior, PWA, and performance — PASS

- `/opt/fleet/lib/verify-url.sh` on live `/demo`: HTTP 200 in 660 ms, `lang=en`,
  correct title, one h1, one main, no missing alt text, no unlabeled buttons,
  and no console errors.
- Live Playwright axe WCAG 2 A/AA scans of `/`, `/demo`, `/privacy`, `/terms`,
  malformed `/handoff`, and the 404 found **zero violations at any impact**.
  The only console message across that route loop was Chromium's expected
  network message for the deliberately tested HTTP 404 document.
- The skip link was the first Tab stop and moved focus to the page heading.
  The demo action worked with Enter; checkboxes worked with Space. Focus rings
  were 3 px and visible, including the custom checklist focus treatment.
- At 390 × 844, `scrollWidth` was 390 and all 36 visible interaction targets
  had at least a 44 × 44 CSS px activation area. Simulated 200% text size still
  had no horizontal overflow.
- With reduced motion, the media query matched, root scrolling was `auto`,
  toast transition duration was `0s`, and no animations were active.
- Live service worker control used cache `slh-924c848c3790`; `/demo` reloaded
  offline with all six items and no errors. The repository's revision-change
  test also passed, proving a new worker replaces the old cache.
- Fresh mobile Lighthouse on live `/demo`: Performance **100**,
  Accessibility **100**, Best Practices **100**, SEO **100**; FCP 1,007 ms,
  LCP 1,307 ms, TBT 90 ms, CLS 0, total transfer 57,328 bytes. Lab navigation
  had no interaction, so Lighthouse did not report INP.
- Every discovered link and metadata asset returned 200; the intentionally
  missing route returned 404.

## Defects

### High — print silently removes the shopper note from a core handoff

The realistic demo starts with **“Pick a ripe lemon. The basil can be loose.”**
in **Note for the shopper**. Under print media, both `.note-label` and `#note`
compute to `display: none`, while the six list items remain visible. The UI
qualifies the field only as **“(not in QR)”**, so it gives no warning that
printing also omits it. A cook can therefore print a list believing the buyer
will receive an instruction that is silently absent. This undermines the
brief's precise handoff job and its clarification-message success measure.

**Required repair:** render the note as readable static text in print output
(or explicitly offer an exclude-note choice), and extend the print claim test
to assert the actual print-media contents, not only that `window.print()` was
called.

### Medium — Remove permanently deletes an item without confirmation, Undo, feedback, or focus recovery

With focus on **Remove spaghetti**, pressing Enter reduced the card from six
items to five, persisted the deletion in `slh:demo:list`, and still lacked
spaghetti after reload. There was no confirmation, toast/status announcement,
or Undo control, and focus fell to `<body>`. This violates the supplied rule
that destructive actions be reversible or specifically confirmed, and makes
keyboard correction unnecessarily costly.

**Required repair:** provide an announced Undo action (preferred) or a
specific confirmation, then move focus predictably to the next item or the
Undo control. Add keyboard and persistence regression coverage.

### Low — the designed 404 omits the required standard site shell and metadata

The live unknown route correctly returns HTTP 404 and has a styled h1, main,
and way home, but contains no `header`, `nav`, or `footer`; it also omits a
description and canonical link. The supplied site-structure contract requires
the consistent header and footer on every route and route metadata.

**Required repair:** add the standard wordmark/navigation/footer and basic
404 metadata without changing the correct HTTP status.

## Retest order

1. Verify the sample shopper note is present in actual print media.
2. Verify item removal is undoable or confirmed and restores keyboard focus.
3. Rerun every claim command, the full 27-test suite, exact build, live parity,
   privacy log, axe routes, offline reload/update, and Lighthouse.
