# Independent verification 2 — FAIL

**Candidate:** `e5985a28219d27ba270803481d2374b01d2b74e5`

**Verified URL:** <https://shopping-list-handoff.sociobot.in>

**Date:** 2026-08-28

**Scope:** clean install/build/tests, every declared claim, exact live parity,
desktop and 390 px functional QA, boundary and recovery paths, keyboard,
accessibility, privacy, PWA, response policy, caching, and performance. Product
code was not modified.

## Release decision

**FAIL.** The deployment is healthy and byte-matches this candidate. The cold
first-read gate, all eight declared claim commands, and all repository checks
pass. Release is blocked by a broken checked-item recovery control and an
incomplete claims manifest. Additional input-boundary, routing, responsive,
and accessibility defects remain.

## Mandatory gates

### First-read — PASS

A fresh, unscrolled live page answers all three required questions:

- What: **“Hand off a clear shopping list.”**
- For whom: **“For cooks who need someone outside their app to shop without
  questions.”**
- First click: **“Try it with sample data,”** with **“Opens a ready-to-send
  pasta list”** beside it.

One click opens `/demo`, displays the persistent demo banner and controls, and
renders a realistic six-item pasta list. The headline, audience, action, and
outcome are visible at 390 × 844. Evidence:
[`first-read-desktop.png`](qa-evidence/live/first-read-desktop.png) and
[`first-read-mobile-390.png`](qa-evidence/live/first-read-mobile-390.png).

### Declared claims — all commands PASS

`.factory/claims.json` exists. After `npm ci`, every exact command was run
independently against the production-build demo entry point.

| Claim | Exact command | Result | Output |
| --- | --- | --- | --- |
| `sample-demo` | `npm test -- --grep @claim:sample-demo` | Pass, 1/1 | [output](qa-evidence/claims/sample-demo.txt) |
| `no-account` | `npm test -- --grep @claim:no-account` | Pass, 1/1 | [output](qa-evidence/claims/no-account.txt) |
| `plain-text-export` | `npm test -- --grep @claim:plain-text-export` | Pass, 1/1 | [output](qa-evidence/claims/plain-text-export.txt) |
| `local-file-private` | `npm test -- --grep @claim:local-file-private` | Pass, 1/1 | [output](qa-evidence/claims/local-file-private.txt) |
| `qr-recipient` | `npm test -- --grep @claim:qr-recipient` | Pass, 1/1 | [output](qa-evidence/claims/qr-recipient.txt) |
| `qr-private` | `npm test -- --grep @claim:qr-private` | Pass, 1/1 | [output](qa-evidence/claims/qr-private.txt) |
| `local-only` | `npm test -- --grep @claim:local-only` | Pass, 1/1 | [output](qa-evidence/claims/local-only.txt) |
| `offline-reload` | `npm test -- --grep @claim:offline-reload` | Pass, 1/1 | [output](qa-evidence/claims/offline-reload.txt) |

The manifest audit itself fails; see High defect 2.

## Repository and deployment evidence

- Initial checkout was clean at candidate `e5985a2`.
- `npm ci`: pass; 138 packages audited, 0 vulnerabilities.
- `npm run lint`: pass.
- `npm run typecheck`: pass.
- `npm test`: pass, 13/13 Playwright tests. Evidence:
  [`full-test.txt`](qa-evidence/full-test.txt).
- `npm run build`: pass; `dist/` produced with service-worker revision
  `slh-0fc9ef2a9181` and 15 shell URLs. Evidence:
  [`build.txt`](qa-evidence/build.txt).
- Live and candidate SHA-256 values matched for `index.html`, hashed JS/CSS,
  hero and social art, icons, service worker, 404 page/CSS, robots, and sitemap.
- `/`, `/demo`, `/privacy`, `/terms`, and `/handoff` returned 200. An unknown
  route returned the designed 506-byte page with HTTP 404.
- Hashed assets returned one-year immutable caching; the service worker
  returned `no-cache`; HTML revalidates after 30 seconds.
- Responses included HSTS, `nosniff`, strict-origin referrer policy, and a
  self-only CSP with `frame-ancestors 'none'`. Captures:
  [`qa-evidence/headers/`](qa-evidence/headers/).
- `/opt/fleet/lib/verify-url.sh` passed in 662 ms with a title, `lang=en`, one
  h1, a main landmark, no missing alt text, no unlabeled buttons, and no console
  errors. Evidence: [`verify.json`](qa-evidence/verify-url/verify.json).

This fresh evidence rules out the previously reported deployment-only failure.

## End-to-end evidence

### Passed behavior

- Demo mode used `slh:demo:list`, did not display or change a seeded real list,
  reset only demo data, and removed the demo key on **Start for real**.
- `500 g` plus `0.5 kg` normalized to `1 kg`; `1 lb` plus `16 oz` became
  `907.18 g`; `½ cup` became `118.29 ml`; `0 g` remained visible; ambiguous
  count quantities produced a warning.
- Empty paste, malformed JSON, negative decimals, and malformed handoff links
  produced clear recovery paths. Clear-list cancel and confirm both worked.
- Plain-text copy contained the expected list. A local handoff file was valid
  JSON, omitted the shopper note, and imported into a clean list.
- Print invoked `window.print`; print media hid app controls and kept the
  shopper sheet.
- A live QR decoded to an HTTPS `/handoff#list=…` URL. A fresh 390 px context
  opened a checkable list, stored nothing, and sent neither fragment nor item
  data in requests. Private title and note data were absent. Evidence:
  [`recipient-mobile.png`](qa-evidence/live/recipient-mobile.png).
- A 180-line QR attempt failed soft and directed the sender to plain text or a
  local file.

### Privacy and server scope

The complete exercised flow made same-origin static GET requests only. There
are no analytics, third-party fonts/scripts, accounts, server-side product APIs,
product-unlock calls, payments, or sign-in. API rate-limit and Microsoft Entra
checks are therefore not applicable. The researched deterministic handoff job
does not need an AI feature.

### PWA

A fresh live context was controlled by `/service-worker.js`. Cache
`slh-0fc9ef2a9181` contained all 15 shell URLs, including hashed assets and
known routes. `/demo` reloaded offline with sample data. The repository's
two-revision update test also passed and removed the old cache.

## Accessibility, responsive layout, and performance

- Live desktop and 390 px axe WCAG 2 A/AA scans covered `/`, `/demo`,
  `/privacy`, `/terms`, malformed and valid handoffs, and the 404. No serious
  or critical findings occurred; one run found no axe violations at any impact
  level on all public/recovery routes.
- Valid routes had `lang=en`, one h1, one main, no missing image alt, no normal
  horizontal overflow, and no application console/page errors.
- The skip link moved focus to `main`. Demo entry, quick add, and checkboxes
  worked with Tab, Enter, and Space. Checklist focus used a visible 3 px ring.
- Reduced motion disabled smooth scrolling and toast transitions.
- Two fresh live Lighthouse 12.2.1 mobile `/demo` runs scored Performance
  **97–100**, Accessibility **100**, Best Practices **100**, SEO **100**; LCP
  **1.23–1.288 s**, CLS **0**, and TBT **42–192 ms**. Raw retained run:
  [`lighthouse-live.json`](qa-evidence/lighthouse-live.json).
- Initial JS is **17.72 KB gzip**, CSS **3.41 KB gzip**, and hero WebP **33.4
  KB**. All are within budget.

## Defects

### High — checked items cannot be shown or restored

On live `/demo`, focus the first checkbox and press Space. The item disappears
and **Show 1 checked item** appears. Enter or click on that control leaves the
same five rows and the same button. Source inspection confirms `builder()`
renders `#show-done`, but `bind()` installs no listener.

Print, plain-text, and QR paths filter out checked items. An accidental check
can therefore create an incomplete handoff while the only recovery control is
inert. Focus also drops to the page when the row rerenders.

**Required repair:** implement a checked-items view with keyboard-accessible
uncheck/restore, retained focus, announced state, and an end-to-end regression
that proves the restored item returns to every export.

### High — the claims manifest omits or under-tests visitor promises

The supplied contract says every visitor-facing promise needs exactly one
tagged observable test. Missing or inadequate coverage includes:

- Print controls and README print guidance.
- Local handoff file import/round-trip; the existing file claim tests only note
  exclusion on export.
- Recipient checkbox operation; `qr-recipient` asserts only that the view and
  an item appear.
- Visible uncertain quantities and broader normalization boundaries; an export
  test incidentally asserts one conversion but declares no normalization claim.
- The privacy page's stronger no-list/note/device-data-to-server statement;
  `local-only` observes initial load and allows same-origin traffic rather than
  inspecting the complete populated flow and request bodies.
- README's absolute “any browser” wording, while the test uses one Chromium
  configuration.

**Required repair:** add narrowly worded claim entries and separately tagged
tests for each promise, including full-flow network interception, or remove/
narrow the copy.

### Medium — an empty list generates a QR that only fails for the recipient

On a clean zero-item list, **Make QR code** creates a URL whose fresh recipient
view says **“This handoff link is incomplete.”** The sender receives no warning.

**Required repair:** disable sharing until an item exists or announce “Add an
item first,” with a boundary test.

### Medium — identical count quantities do not merge

Pasting `1 bunch basil` twice leaves duplicate rows. Equal count units are safe
to combine and the brief requires a concise normalized card. The current base
comparison uses `count` for the existing item but literal `bunch` for the new
item, so it never merges.

**Required repair:** merge identical count units for the same normalized name
while retaining ambiguity warnings for unknown pack/produce sizes.

### Medium — finite input can overflow to a corrupt quantity

Quick-add accepts `1e308 kg` and displays **Infinity kg**. JSON/QR serialization
then converts `Infinity` to `null`, silently discarding the amount.

**Required repair:** validate the converted result as finite and within a
documented practical maximum before saving or sharing.

### Medium — a blank required item has no announced error

Submitting **Add item** with no item name only moves focus. Because the form
uses `novalidate`, there is no visible error, `aria-invalid`, associated
description, or live announcement.

**Required repair:** show and associate “Add an item name,” mark the field
invalid, and cover keyboard/screen-reader output.

### Medium — routing has a dead anchor and loses Back focus

The header uses `href="#how"` on every route. `/privacy`, `/terms`, and
`/handoff` have no `#how`, so **How it works** goes nowhere. SPA forward
navigation focuses the new h1, but browser Back returns with
`document.activeElement === body`. There is no route live-region announcement.

**Required repair:** use `/#how` away from the landing page; restore logical
focus and scroll on popstate; announce route changes; test push/back/forward.

### Medium — 200% text resizing breaks mobile reflow

At 390 px with text resized to 200%, root/demo reached `scrollWidth = 688` and
Privacy/malformed handoff reached 436 px. Header and workbench controls moved
off-screen, forcing two-dimensional panning. Evidence:
[`demo-mobile-text-200.png`](qa-evidence/live/demo-mobile-text-200.png).

**Required repair:** constrain grid children and wrap/stack the header,
quick-add, sheet header, and export controls; add a 200% resize test.

### Medium — a mobile touch target remains below 44 px

At 390 px, footer **Terms** measured **37 × 44 CSS px**, below the supplied
44 × 44 baseline. The focused skip link also measured 112 × 39 px, although it
is primarily a keyboard target. Repaired demo and remove controls passed.

**Required repair:** give all rendered independent links a 44 × 44 hit area
and test the complete interactive set rather than selected controls.

### Low — the third required hero fact falls below the first mobile viewport

At 390 × 844, LOCAL and OFFLINE are fully visible, but **FREE — No account
needed** spans y=840.7–854.7. The required what/for-whom/first-click gate passes,
but the plain-words first-screen shape asks for all three facts. Evidence:
[`first-read-mobile-390.png`](qa-evidence/live/first-read-mobile-390.png).

### Low — Start for real gives incorrect returning-user feedback

With an existing real list, demo mode correctly hides it and **Start for real**
correctly restores it, but the toast says “Your real list starts empty.” The
feedback contradicts the visible state; no data was lost.

## Retest order

1. Expand the manifest and run every claim command independently.
2. Check → show → uncheck an item, then verify print, copy, QR, and file output.
3. Exercise empty QR, duplicate counts, huge conversions, and blank quick add.
4. Retest legal-route anchors, browser history focus/announcement, 200% text,
   all 390 px targets, and the mobile first fold.
5. Repeat clean gates, parity hashes, full-flow privacy, offline update/reload,
   axe, and Lighthouse.
