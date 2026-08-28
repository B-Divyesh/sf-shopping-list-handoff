# Independent verification 2 — FAIL

**Candidate:** `e5985a28219d27ba270803481d2374b01d2b74e5`  
**Verified URL:** <https://shopping-list-handoff.sociobot.in>  
**Date:** 2026-08-28  
**Scope:** clean install/build/tests plus independent live desktop, 390 px
mobile, keyboard, accessibility, privacy, PWA, response-policy, performance,
and end-to-end handoff checks. Product code was not modified.

## Release decision

**FAIL.** The live deployment byte-matches the candidate, the first-read gate
passes, and all eight declared claim commands pass. The candidate still fails
the acceptance contract because a core checked-item recovery control does
nothing and visitor-facing print/import/normalization claims are missing from
the mandatory claims manifest. Additional boundary, navigation, and
accessibility defects are listed below.

## First-read gate — PASS

In a fresh live desktop context, the first viewport says:

- What it does: **“Hand off a clear shopping list.”**
- Who it is for: **“For cooks who need someone outside their app to shop
  without questions.”**
- What to click first: **“Try it with sample data,”** followed by **“Opens a
  ready-to-send pasta list.”**

The action is visible without setup. One click opens `/demo`, shows the
persistent **“Demo — sample data, nothing is saved”** banner with **Reset demo**
and **Start for real**, and immediately renders six realistic pasta-list items.

## Mandatory declared claims

`.factory/claims.json` exists. Each tag occurs exactly once in
`tests/app.spec.ts`. Every listed command was run independently before the
general suite, using a fresh Playwright context and the configured production
demo entry point.

| Claim | Exact command | Result |
| --- | --- | --- |
| `sample-demo` | `npm test -- --grep @claim:sample-demo` | PASS, 1 test |
| `no-account` | `npm test -- --grep @claim:no-account` | PASS, 1 test |
| `plain-text-export` | `npm test -- --grep @claim:plain-text-export` | PASS, 1 test |
| `local-file-private` | `npm test -- --grep @claim:local-file-private` | PASS, 1 test |
| `qr-recipient` | `npm test -- --grep @claim:qr-recipient` | PASS, 1 test |
| `qr-private` | `npm test -- --grep @claim:qr-private` | PASS, 1 test |
| `local-only` | `npm test -- --grep @claim:local-only` | PASS, 1 test |
| `offline-reload` | `npm test -- --grep @claim:offline-reload` | PASS, 1 test |

The declaration audit itself fails: the page and README promise print,
opening a local handoff file, and normalized/checked quantities, but no claim
entry tests those promises. See High defect 2.

## Clean checkout gates

Run at candidate `e5985a2`:

| Check | Result |
| --- | --- |
| `npm ci` | PASS; 138 packages audited, 0 vulnerabilities |
| `npm run lint` | PASS |
| `npm run typecheck` | PASS |
| `npm test` | PASS; 13/13 Playwright tests |
| `npm run build` | PASS; `dist/` produced |

The build generated service-worker revision `slh-0fc9ef2a9181` with 15 shell
URLs. Initial JavaScript is 46.23 KB raw / 17.72 KB gzip; CSS is 11.52 KB raw /
3.41 KB gzip; the hero WebP is 33.43 KB. All are below the supplied budgets.

## Live deployment identity and policies

The deployment is the candidate, not a stale repair:

- `dist/index.html` and live `/` have identical SHA-256
  `06fcd9b2bbb5e8b5d5e0026c2dd51bb3e1e4ff87156cfe007e7f666b423c6d0c`.
- Candidate/live hashes also match for JS `e260fd85…`, CSS `f264d06e…`, hero
  `309e5dd5…`, service worker `89db43e9…`, 404 page `4a72c973…`, 404 CSS
  `922c337c…`, social image, icons, robots, and sitemap.
- `/`, `/demo`, `/privacy`, `/terms`, and `/handoff` return 200. A fresh
  `/missing-release-check` returns the designed page with HTTP 404.
- Hashed assets return `Cache-Control: public, max-age=31536000, immutable`;
  the service worker returns `no-cache`; HTML revalidates after 30 seconds.
- HTTPS sends HSTS, `nosniff`, `strict-origin-when-cross-origin`, and the
  self-only CSP. No CSP, console, or page errors occurred.

`/opt/fleet/lib/verify-url.sh` passed: title, `lang=en`, one h1, main landmark,
all image alt attributes, and all button names were present; measured load was
1,014 ms.

## End-to-end evidence

### Passed

- Demo isolation: in a context preloaded with a private real list, `/demo`
  neither displayed nor changed the real key. Reset affected only
  `slh:demo:list`; Start for real removed the demo key.
- Quantity handling: `500 g` plus `0.5 kg` became `1 kg`; `1 lb` plus `16 oz`
  became `907.18 g`; `½ cup` became `118.29 ml`; ambiguous counts produced a
  visible warning.
- Plain-text copy contained the title, unchecked item lines, and shopper note.
- A downloaded handoff file was valid JSON and excluded the shopper note. It
  imported into a clean real list with six items and an empty note.
- A live QR decoded to an HTTPS `/handoff#list=…` URL. A fresh 390 px context
  opened a checkable 10-item recipient list. The private title and note were
  absent, localStorage remained empty, and no request contained the fragment.
- Print invoked `window.print`. Malformed JSON, negative decimals, `1/0`, and
  empty paste input produced recovery messages. Clear-list cancel and confirm
  paths both worked.
- The live service worker controlled a fresh context; offline `/demo` reload
  passed from cache `slh-0fc9ef2a9181`. The repository's two-revision update
  test also passed and removed the old cache.

### Accessibility, mobile, and performance

- Live axe WCAG 2 A/AA scans found no serious or critical issues on `/`,
  `/demo`, `/privacy`, `/terms`, malformed `/handoff`, a valid recipient view,
  or the 404 page.
- Desktop and 390 px layouts had no ordinary horizontal overflow. The skip
  link worked by keyboard, the visible checklist focus ring was 3 px solid,
  recipient checkboxes toggled with Space, and reduced motion removed smooth
  scrolling and transitions.
- All crawled HTTP links returned 200; the semantic dead anchor is recorded
  separately below.
- Live Lighthouse 12.2.1 mobile `/demo`: Performance **100**,
  Accessibility **100**, Best Practices **100**, SEO **100**; FCP **930 ms**,
  LCP **1,230 ms**, CLS **0**, TBT **42 ms**, transferred **56.5 KB**.

### Privacy and server scope

The complete exercised live flow made only same-origin requests. There are no
analytics, third-party fonts/scripts, accounts, server-side product APIs, or
product-unlock calls. Rate-limit and Microsoft Entra checks are therefore not
applicable: there is no API endpoint to burst and no sign-in flow. The product
does not need an AI feature for the researched deterministic handoff job.

## Defects

### High — checked items cannot be shown or unchecked

On live `/demo`, focusing the first checklist item and pressing Space removes
`spaghetti` from the card and exposes **“Show 1 checked item.”** Focusing that
button and pressing Enter, or clicking it, changes nothing. The item remains
hidden and cannot be unchecked. Source inspection confirms that `builder()`
renders `#show-done`, but `bind()` installs no listener for it. This breaks the
core checkable-list recovery path and also drops keyboard focus to the page
after an item is checked.

**Required repair:** implement a checked-items view/toggle with retained
keyboard focus and an announced state, or keep checked items visible and
reversible. Add an end-to-end test that checks, shows, and unchecks an item.

### High — the claims manifest omits visitor-facing promises

The landing page and README tell visitors they can print and open a local
handoff file, and that the product reviews/normalizes quantities. The UI
contains **“Print, copy, scan, or save a local file”** and **“Or open a local
handoff file.”** `.factory/claims.json` has no print, file-import/round-trip, or
normalization claim. The existing local-file claim only proves that an export
omits the note; the plain-text claim happens to exercise one conversion but
does not declare or cover the broader normalization promise. The privacy page
also makes the stronger promise that ingredient lists, notes, and device
identifiers are not sent to a server, while `@claim:local-only` observes only
initial demo loading rather than the whole populated sharing flow.

This violates the supplied “every claim is a test” contract even though the
manually exercised print and file round trip worked.

**Required repair:** add narrowly worded claim entries and tagged observable
tests for print, file round-trip, normalization boundaries, and the full
privacy flow, or remove the promises.

### Medium — an empty list produces a QR that can only fail

On a clean real list with zero items, **Make QR code** generated
`/handoff#list=eyJ2IjoxLCJpIjpbXX0` without a warning. Opening it in a fresh
recipient page displayed **“This handoff link is incomplete.”** Recovery is
offered only after the bad handoff has been shared.

**Required repair:** disable QR/export until at least one item exists or show a
sender-side, announced “add an item first” error. Add an empty-boundary test.

### Medium — safe count quantities remain duplicated

Pasting `1 bunch basil` twice leaves two separate `1 bunch basil` rows while
`500 g rice` plus `0.5 kg rice` correctly becomes `1 kg rice`. Combining equal
count units is unambiguous and is needed for the brief's concise,
unit-normalized card. The current normalization compares the existing count
base (`count`) with the incoming literal unit (`bunch`), so it never merges.

**Required repair:** merge identical count units for the same normalized item
name while retaining the warning for genuinely ambiguous sizes.

### Medium — finite input can overflow into a corrupt quantity

Quick-add accepts amount `1e308`, unit `kg`, item `boundary sugar`. Conversion
overflows and the card displays **“Infinity kg boundary sugar.”** JSON export
or QR serialization changes JavaScript `Infinity` to `null`, silently losing
the amount.

**Required repair:** validate the converted result as finite and within a
documented practical maximum before saving or sharing it.

### Medium — a required blank item has no announced error

Submitting **Add item** with the item name blank only moves focus to the input.
There is no error text, `aria-invalid`, `aria-describedby`, or live
announcement. The form uses `novalidate`, so native validation provides no
message either.

**Required repair:** show and associate a plain recovery message such as “Add
an item name,” mark the field invalid, and test keyboard/screen-reader output.

### Medium — route navigation has a dead link and incomplete focus handling

The consistent header uses `href="#how"` everywhere. On `/privacy`, `/terms`,
and `/handoff` there is no `#how`, so **How it works** changes only the fragment
and goes nowhere. SPA forward navigation correctly focuses the new h1 after a
frame, but browser Back rerenders the landing page with focus left on `body`,
contrary to the supplied route-change focus requirement.

**Required repair:** link non-landing headers to `/#how`; on `popstate`, move
focus to the restored h1 (or intentionally restore the originating control)
and announce the route.

### Medium — one mobile touch target remains below baseline

At 390 px, the footer **Terms** link measures **37 × 44 CSS px**. The supplied
accessibility contract requires independent touch targets to be at least
44 × 44 px. Other repaired demo controls and remove buttons meet the minimum.

**Required repair:** give footer links at least 44 px inline size and preserve
adequate spacing from adjacent targets.

## Retest order

1. Add the missing claim declarations/tests and run every command separately.
2. Check, show, and uncheck an item with keyboard and touch.
3. Exercise empty QR, duplicate counts, huge converted quantities, and blank
   quick-add input.
4. Retest legal-page **How it works**, browser Back focus, and all 390 px touch
   targets.
5. Repeat clean gates, parity hashes, live QR privacy, offline update/reload,
   axe, and Lighthouse.
