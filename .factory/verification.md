# Independent verification — FAIL

**Candidate:** `e9edbff1b8e2733d40d5843490d19b09d286c346`  
**Verified URL:** <https://shopping-list-handoff.sociobot.in>  
**Date:** 2026-08-28  
**Verifier scope:** clean-clone install/build/tests, live deployment parity and
manual desktop/mobile, keyboard, privacy, PWA, response-policy, and end-to-end
handoff testing. Product code was not modified.

## Release decision

**FAIL.** The live build is the supplied candidate and much of the core local
handoff flow works, but release-blocking acceptance defects remain. In
particular, the UI promises that a QR scan opens the list in a browser, while
the generated QR is only raw JSON and there is no corresponding import route.
The required designed HTTP 404 is also not deployed.

## First-read test (fresh live browser context)

The first screen plainly says **“Hand off a clear shopping list.”** It says it
is **“For cooks who need someone outside their app to shop without questions.”**
The first action is **“Try it with sample data”** and explains that it opens a
ready-to-send pasta list. The one-click demo was visible and worked. This gate
passes.

## Required claims gate — PASS

Fresh dependencies were installed with `npm ci`, then every command declared
in `.factory/claims.json` was run against the configured local demo entry point.
All passed:

| Claim | Exact command | Result |
| --- | --- | --- |
| sample-demo | `npm test -- --grep @claim:sample-demo` | Pass |
| no-account | `npm test -- --grep @claim:no-account` | Pass |
| plain-text-export | `npm test -- --grep @claim:plain-text-export` | Pass |
| local-file-private | `npm test -- --grep @claim:local-file-private` | Pass |
| qr-private | `npm test -- --grep @claim:qr-private` | Pass |
| local-only | `npm test -- --grep @claim:local-only` | Pass |
| offline-reload | `npm test -- --grep @claim:offline-reload` | Pass |

`npm test` also passed all 8 Playwright tests. The test suite's QR test proves
that notes and titles are absent, but does not prove the separate on-screen
promise that scanning opens the handoff in a browser.

## Checks that passed

- `npm ci`: completed; npm reported 0 vulnerabilities.
- `npm test`: 8/8 Playwright tests passed. There is no separate lint script.
- `npm run build`: passed (`tsc --noEmit && vite build`) and produced `dist/`.
- Live parity: the production HTML referenced `index-D_vYURtk.js` and
  `index-ktbDQFtH.css`; SHA-256 values exactly matched this candidate's
  `dist/` assets. The live hero WebP also matched.
- Representative flow on live `/demo`: pasted `500 g noodles`, `1 kg noodles`,
  `½ cup milk`, and `1 bunch basil`; observed `1.5 kg`, `118.29 ml`, and the
  ambiguous/count warning. Plain-text copy worked. Local JSON omitted the
  shopper note. QR omitted the note. Empty paste and malformed JSON import
  gave clear recovery messages.
- Demo isolation worked: after **Start for real**, only `slh:real:list` was
  present; demo data was discarded. Browser network requests were same-origin
  only. No accounts, server endpoints, sign-in, or third-party requests exist,
  so rate-limit and Entra checks are not applicable.
- Desktop and 390px live screens had no horizontal overflow. Live `/`, `/demo`,
  `/privacy`, and `/terms` each had one h1, correct titles, no console/page
  errors, and no axe WCAG 2 A/AA serious or critical findings.
- Production-preview Lighthouse mobile `/demo`: Performance **100**,
  Accessibility **100**, LCP **1358 ms**, CLS **0**, TBT **38 ms**.
- Build budgets: JavaScript **16.68 KB gzip**, CSS **3.13 KB gzip**, hero WebP
  **33.4 KB**. These are within the stated static-web budgets.
- Live policies: HTTPS, HSTS, CSP restricted to self, `nosniff`, and strict
  origin referrer policy were present. Hashed JS/CSS use
  `Cache-Control: public, max-age=31536000, immutable`.

## Defects

### High — QR handoff cannot do what its copy promises; claim coverage is missing

The QR panel says: **“Scan to open this list in a browser.”** In a live mobile
flow, decoding the actual canvas produced a raw JSON object beginning
`{"v":1,"i":...}`. It contained no URL. The app has no route or scanner/import
handler that accepts this JSON, so a recipient scanning with a normal camera
does not open a readable handoff card. This is a core sharing path from the
researched brief, and an unlisted/false visitor-facing claim under the claims
contract. The existing `qr-private` test only proves privacy exclusion.

**Required repair:** either encode a usable handoff URL with a privacy-safe
payload and implement its reader, or change the product/copy to an accurate
QR data-transfer flow and add a demo claim test that scans/opens the recipient
experience. Keep titles and notes out of the payload.

### High — unknown routes return a 200 landing page, not the required designed 404

`curl -I https://shopping-list-handoff.sociobot.in/missing` returned the normal
1,610-byte `index.html`, `Content-Type: text/html`, and HTTP **200**. It did not
return `public/404.html` or a 404 status. The deployed `navigationFallback`
currently catches the route before the `responseOverrides` rule. This fails the
site-structure requirement for a real styled 404 with a way back and makes bad
links indistinguishable from valid ones.

**Required repair:** configure the Static Web Apps fallback/exclusions so an
unknown URL returns the designed `404.html` with HTTP 404, then test it live.

### Medium — invalid negative quantities are accepted without error

On live `/demo`, I left demo mode, entered amount `-2`, unit `g`, item `sugar`,
and activated **Add item**. The card displayed **“-2 g sugar”**. Negative
ingredient quantities are invalid input and there is no explanation or
recovery path. This violates the requested invalid-input exercise and could
make a shopper's list misleading.

**Required repair:** constrain quantities to finite non-negative values in both
quick-add and pasted parsing; announce a specific correction message.

### Medium — keyboard focus and touch targets do not meet the supplied accessibility baseline

The live checklist checkbox is a 13 × 13 px `input` with `opacity: 0`.
When it receives keyboard focus, its computed focus outline is applied to that
fully transparent element, so the shopper has no visible focus indicator on a
checkable item. At 390px, **Reset demo** measured 97 × 32 px, **Start for
real** 106 × 32 px, and each remove button 36 × 38 px — all below the required
44 px target minimum. The skip link itself worked and had a visible focus ring.

**Required repair:** draw a visible focus state on the checkbox's `.tick`/label
with `:focus-visible` or `:focus-within`, and make all independent controls at
least 44 × 44 CSS px.

### Medium — service-worker cache cannot reliably update with a new deployment

`public/service-worker.js` uses the fixed cache name `slh-v1`. Its shell list
is also limited to `/`, `/demo`, the hero image, and favicon rather than the
hashed JS/CSS shell. A first-visit offline reload happened to work in Chromium
because browser HTTP caching supplied the current assets, but the service
worker's own cache has no build/version key. On a later deployment, a newly
installed worker reuses `slh-v1`; cache-first fetching can continue serving
old HTML and assets. This fails the required PWA update check.

**Required repair:** version/precache the complete generated shell for each
build and delete old caches on activation; add an automated update test that
loads one build, deploys a second shell, and confirms the new revision offline
after update.

## Notes for the next verifier

Run `npm ci && npm test && npm run build`. For live parity, compare the built
hashed asset checksums with the names in the live HTML. Re-test the QR with a
recipient-style fresh browser/camera decoder, not merely by verifying omitted
notes. Confirm `/missing` is a real 404 response after the routing repair.
