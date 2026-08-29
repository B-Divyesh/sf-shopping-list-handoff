# Adversarial first-read review 4 — FAIL

**Reviewed:** 2026-08-29  
**Live URL:** <https://shopping-list-handoff.sociobot.in>  
**Contexts:** fresh Chromium at 390 × 844 and 1440 × 900; clean clone in
`/tmp/slh-review-4.THyLJC/repo`.

## Verdict: FAIL

The first-read, one-click demo, local-first behavior, all declared claims,
accessibility baseline, and route checks pass. One live Terms sentence makes a
material product-behavior claim with no entry in `.factory/claims.json` and no
targeted observable test. The claims contract makes this a blocking unlisted
claim. There are no other findings.

## Cold first read

Before scrolling, at 390 px and desktop, I understood the product as follows:

- **What it does:** turns pasted ingredient lines into a handoff shopping list.
- **For whom:** cooks handing a list to a shopper outside their meal-planning
  app.
- **What to click first:** **Try it with sample data**; its adjacent result
  says **“Opens a ready-to-send pasta list.”**

The mobile first viewport contains the h1, audience sentence, primary action,
result text, and all three facts. The first-read gate passes. No quoted text
failed comprehension.

## Findings

### F-4-1 — BLOCKING — Terms makes an unlisted product-behavior claim

**Location / quote:** `/terms`: **“The tool does not place orders, contact
retailers, or provide live collaboration.”**

**Why:** These are three concrete boundaries a visitor can rely on. None has
an entry in `.factory/claims.json`. `local-data-private` records requests made
during a demo flow, but it does not name or assert the no-orders,
no-retailer-contact, and no-live-collaboration promise. This violates the
requirement that each claim-like sentence on the live product be declared and
tested with its observable result.

**Fix:** Either delete the sentence, or add a narrowly worded manifest claim
such as **“The app does not send a shopping list to a retailer or another
shopper automatically.”** Add an `@claim:no-automatic-sharing` clean-demo
test that uses the complete create/QR/file flow, records requests and storage,
and asserts no non-product request, network write, or recipient-side shared
state occurs without the user explicitly opening or sharing the exported
copy. Do not claim "live collaboration" unless an observable multi-context
test defines what that excludes.

## Copy audit

Counts treat hyphenated terms, `#`, and code paths as one word. Labels,
headings, and controls are included because they affect first-read clarity and
button naming. Every landing and README sentence is at or below 22 words;
there are no banned marketing words, unexplained landing headings, metaphors,
or non-result-naming buttons. The one Terms claim is F-4-1, not a landing or
README copy-audit defect.

### Landing page

| Copy | Words | Check |
| --- | ---: | --- |
| Skip to list | 3 | Pass |
| Shopping List Handoff | 3 | Wordmark |
| Demo; How it works; Privacy | 1; 3; 1 | Clear navigation |
| Hand off a clear shopping list | 6 | Clear h1/job |
| For cooks handing a list to a shopper outside their meal-planning app. | 12 | Clear audience/situation |
| Try it with sample data | 5 | `sample-demo` |
| Opens a ready-to-send pasta list. | 5 | `sample-demo` |
| LOCAL Stored in this browser | 5 | `local-only`, `local-data-private` |
| OFFLINE Works after first visit | 5 | `offline-reload` |
| FREE No account needed | 4 | `free-use`, `no-account` |
| Pasted ingredients become a handoff card. | 6 | `pasted-ingredients-to-card` |
| Paste ingredients or start a list | 6 | Clear section heading |
| Paste one ingredient per line. | 5 | Direct instruction |
| We keep uncertain quantities visible. | 5 | `quantity-normalization` |
| Ingredient source; Paste ingredients; Add ingredients; Clear list | 2; 2; 2; 2 | Clear labels/actions |
| Add one item; Amount; Unit; Item; Add item | 3; 1; 1; 1; 2 | Clear labels/actions |
| Or open a local handoff file | 6 | Clear instruction |
| Saved only in this browser. | 5 | `local-only`, `local-data-private` |
| Handoff card; Shopping list; 0 items · 0 left | 2; 2; 4 | Functional/dynamic labels |
| Print shopping list; Copy plain text; Make QR code; Save local file | 3; 3; 3; 3 | Result-naming controls; declared claims |
| Your handoff card will appear here. | 6 | Clear empty state |
| Paste ingredients or add an item above. | 7 | Clear next step |
| Note for the shopper (not in QR) | 7 | `qr-private` |
| How it works | 3 | Clear section heading |
| Paste; Paste ingredient lines into the list. | 1; 6 | Clear step/instruction |
| Check; Review units and produce counts before sending. | 1; 7 | Clear step/instruction |
| Hand off; Print, copy, scan, or save a local file. | 2; 8 | Clear step/instruction |
| Your list stays on this device | 6 | `local-only`, `local-data-private` |
| There are no accounts or cloud lists. | 7 | `no-account`, `local-data-private` |
| QR codes contain only item names and quantities. | 8 | `qr-private` |
| Notes never go into a QR code. | 7 | `qr-private` |
| Shopping lists for people outside your app. | 7 | Clear footer description |
| Privacy; Terms; Built by Param Factory; v1.0.0 | 1; 1; 4; 1 | Functional footer |

### README

| Copy | Words | Check |
| --- | ---: | --- |
| Shopping List Handoff | 3 | Product name |
| Turn pasted ingredients into a clear handoff card for a shopper outside your meal-planning app. | 15 | `pasted-ingredients-to-card` |
| It is for household cooks handing a shopping list to another shopper. | 12 | Clear audience |
| Paste ingredient lines and check the quantities. | 7 | Direct instruction |
| Then print, copy, make a QR code, or save a local handoff file. | 13 | Declared export claims |
| The QR code opens a list in a browser. | 9 | `qr-recipient` |
| The working list stays in your browser. | 7 | `local-only`, `local-data-private` |
| No account is needed. | 5 | `no-account` |
| Use it | 2 | Clear heading |
| Paste one ingredient per line, such as `500 g spaghetti` or `1 lemon`. | 13 | Direct instruction/example |
| Check the handoff card, especially count-based produce and packs. | 9 | Direct instruction |
| Use Copy plain text, Make QR code, Save local file, or print. | 12 | Declared export claims |
| Compatible metric and volume quantities combine into one line. | 9 | `quantity-normalization` |
| Equal count units, such as two bunches of basil, combine too. | 10 | `quantity-normalization` |
| Counts and unmeasured items stay visible with a review warning rather than guessing a size. | 15 | `quantity-normalization` |
| Scanning a QR code opens a readable list in the browser. | 10 | `qr-recipient` |
| The list is encoded after the # in the link, so the browser does not send it to the server. | 19 | `qr-private`, `local-data-private` |
| QR codes exclude the list title and shopper note. | 9 | `qr-private` |
| The local handoff file leaves out the note too. | 9 | `local-file-private` |
| Try the isolated demo at `/demo` or use Try it with sample data. | 13 | Demo entry |
| Demo data is stored separately from your real lists. | 9 | `local-only` |
| The app works offline after the first visit. | 8 | `offline-reload` |
| Develop | 1 | Clear heading |
| `npm run build` writes the static deployment output to `dist/`, with `dist/index.html` at its root. | 17 | Developer instruction |
| Deploy that directory to Azure Static Web Apps. | 8 | Developer instruction |
| Privacy and limits | 3 | Clear heading |
| No list data is sent to a server. | 8 | `local-data-private` |
| Real lists and demo lists are stored separately in this browser. | 10 | `local-only` |
| Clearing browser site data clears them. | 6 | `site-data-clear` |
| Read the in-product Privacy and Terms pages for details. | 9 | Direct instruction |
| Project notes | 2 | Clear heading |
| The blueprint illustration is original, generated factory artwork. | 7 | Provenance fact |
| Its prompt and provenance are recorded in `.factory/design.md`. | 8 | Repository fact |
| Claim coverage is listed in `.factory/claims.json`. | 7 | Repository fact |
| Demo behavior is documented in `.factory/demo.md`. | 7 | Repository fact |
| License | 1 | Clear heading |
| MIT. | 1 | License fact |
| See LICENSE. | 2 | Direct instruction |

## Demo, privacy, and claims verification

- One click from the landing action opened `/demo`, whose first 390 × 844
  viewport contains the persistent **Demo — sample data, nothing is saved.**
  banner, Reset demo, Start for real, **Wednesday pasta night handoff**, and
  realistic spaghetti and olive-oil rows. The desktop check matches.
- A fresh real list (`real oats`) remained byte-for-byte unchanged after
  entering demo, Reset demo, and Start for real. Demo and real keys remained
  separate. The banner was present throughout demo; Reset reseeded its six
  items; Start for real discarded demo and reopened the real list.
- A populated live demo flow made only same-origin requests, with no request
  bodies and no console errors. There are no external fonts, scripts,
  analytics, AI calls, or provider keys. A first-visit live `/demo` reload
  also worked offline after the service worker became ready.
- All 16 exact manifest commands passed independently in the clean clone;
  each id occurs once as `@claim:<id>` in `tests/app.spec.ts`:
  `sample-demo`, `no-account`, `free-use`, `pasted-ingredients-to-card`,
  `plain-text-export`, `local-file-private`, `local-file-roundtrip`,
  `print-sheet`, `qr-recipient`, `qr-private`, `recipient-checkable`,
  `quantity-normalization`, `local-only`, `local-data-private`,
  `site-data-clear`, and `offline-reload`.
- `npm ci`, `npm run lint`, `npm run typecheck`, the 32-test Playwright suite,
  and `npm run build` passed in that clone. Build output contains `dist/`; the
  initial JavaScript is 18.73 KB gzip.

## History retest

Every earlier review, polish record, and handoff was read. The following
checks confirm the earlier review findings are fixed in both current source
and the live deployment, rather than merely marked fixed:

| Earlier finding | Current confirmation |
| --- | --- |
| F-1-1 | Live/source say pasted ingredients become a **handoff card**; `pasted-ingredients-to-card` passes. |
| F-1-2 | The unsupported “any recipe app” promise is absent. |
| F-1-3 | Browser-site-data clearing is declared and `site-data-clear` passes. |
| F-1-4 | `HANDOFF SHEET / 01` is absent from the live first screen and source. |
| F-1-5 | `04 / BOUNDARIES` is absent; Privacy has a literal heading. |
| F-2-1 | Live instruction is “Paste one ingredient per line.” |
| F-2-2 | The visible control says “Print shopping list”; `print-sheet` passes. |
| F-2-3 | The current product result is consistently “handoff card.” |
| F-2-4 | Each checked route has its own title, description, canonical, OG/Twitter data; the 404 has favicon and Apple icon. |
| F-3-1 | `/demo` now exposes the seeded card and two rows within the first mobile viewport. |
| F-3-2 | The audience sentence now names cooks and a shopper without promising shopper behaviour. |
| F-3-3 | README no longer promises an undefined “precise” list. |
| F-3-4 | README now explains the `#` portion of the link in plain language. |
| F-3-5 | README uses the consistent term “local handoff file.” |
| F-3-6 | README says demo data is stored separately, not how its key is named. |
| F-3-7 | The full wordmark replaces the unexplained initialism and serial labels are absent. |
| F-3-8 | The 404 h1 is “This page was not found.” |
| F-3-9 | Live Back navigation restored scrollY 1000 and focused/announced the landing h1. |
| F-3-10 | Privacy and Terms have literal product-specific route h1s. |
| F-3-11 | Source preserves an entered compatible unit unless merging; the declared normalization test verifies readable merged measures. |

The earlier V1–V4 and V2 repair rows in the polish records also remain
covered: generated QR handoffs are checkable and private, a missing route is a
designed HTTP 404, invalid quantities and blank names are announced, checked
items can be restored, empty QR creation recovers, overflow is rejected,
mobile 200% reflows, and the service-worker replacement test passes.

## Structure, accessibility, identity, and leverage

- `/`, `/demo`, `/privacy`, `/terms`, and `/handoff` return 200; the unknown
  live path returns the designed 404. All discovered internal links return
  200 or are valid fragment links. `robots.txt` and `sitemap.xml` are present.
- Fresh live checks found one h1 and one main on each route, route-specific
  title/description/canonical/OG/Twitter metadata, no console errors, and no
  serious or critical axe WCAG 2 A/AA violations. Back navigation restores
  focus, announcement, and scroll position.
- Header/footer, Privacy/Terms links, skip link, favicon, Apple touch icon,
  social image, CSP, and reduced-motion styling are present. The midnight
  drafting grid, cream paper sheet, original blueprint artwork, and red
  transfer mark follow `.factory/design.md` and are distinct from a generic
  SaaS template.
- The brief's useful transfer mechanisms are present: plain text, print,
  local-file import/export, and a privacy-safe QR recipient list. AI would add
  a network, cost, and key boundary to a deterministic parsing task without
  an implied user benefit. No decorative AI or embedded provider key was
  found.

## What would make this perfect

Resolve F-4-1 by removing the unsupported Terms sentence or declaring and
testing a narrow observable boundary. Then rerun the full clean-clone claim
commands and this complete live review. With that single claim contract gap
closed, no remaining finding is known.
