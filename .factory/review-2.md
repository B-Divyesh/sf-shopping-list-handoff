# Adversarial first-read review 2 — FAIL

**Reviewed:** 2026-08-28  
**Live URL:** <https://shopping-list-handoff.sociobot.in>  
**Contexts:** fresh Chromium at 390 × 844 and 1440 × 900; clean local clone at `fd0e976`.

## Verdict: FAIL

The core job is clear and genuinely tryable. The demo, data separation,
offline path, declared claims, and earlier repairs all verify. The product
still has one unlisted claim, inconsistent product terminology, a visible
button that does not name its result on a phone, and incomplete route
metadata. The claims contract makes F-2-1 blocking; the other findings mean
this is not a zero-finding pass.

## Cold first read

Before scrolling, at both 390 px and desktop, I understood: this turns pasted
ingredient lines into a shopping list another person can use. It is for cooks
whose shopper is outside their meal-planning app. I should click **Try it with
sample data**; the adjacent outcome says **“Opens a ready-to-send pasta
list.”** The h1, audience, action, outcome, and all three facts fit in the
initial 390 px viewport. This passes the first-read gate.

## Findings

### F-2-1 — BLOCKING — an unlisted, subjective input promise is on the landing page

**Location / quote:** Builder introduction: **“One ingredient per line works
best.”**

**Why:** This is a visitor-facing performance/usability claim, but no entry in
`.factory/claims.json` names or tests it. It also leaves a first-time user
wondering what happens with the multi-line recipe text they actually copied.
The supplied claims contract requires every claim-like sentence to have an
observable sandbox test or be removed.

**Fix:** Replace it with the direct instruction **“Paste one ingredient per
line.”** This removes the unsupported comparison. Alternatively declare a
specific supported input format and test its observable result.

### F-2-2 — MINOR — the visible print button does not name its result

**Location / quote:** Handoff card, top-right control: **“⌘P”**.

**Why:** On a phone, this macOS shortcut does not say what happens after a
tap. Its accessible name and hover title are “Print shopping list,” but the
visible control still fails the plain-words requirement that buttons use
result-naming verbs.

**Fix:** Render **“Print shopping list”** visibly (an adjacent decorative
printer icon or “⌘P” shortcut is fine). Keep the existing accessible name and
print test.

### F-2-3 — MINOR — the same product result has two names

**Location / quote:** Hero art caption: **“Pasted ingredients become a
shopping card.”** Empty state: **“Your handoff card will appear here.”**
README and the terminology table also use **“handoff card.”**

**Why:** A first-time visitor cannot tell whether “shopping card” is different
from “handoff card.” The plain-words contract requires one word for one
concept.

**Fix:** Change the caption to **“Pasted ingredients become a handoff card.”**
Update the claim wording if it mirrors the caption.

### F-2-4 — MINOR — route metadata remains landing metadata and the 404 lacks share/icon metadata

**Location / quote:** On live `/privacy`, `/terms`, `/demo`, and `/handoff`,
the Open Graph title remains **“Shopping List Handoff — Share a clear shopping
list”** and the description remains **“Turn pasted ingredients into a clear
shopping list anyone can use.”** The live HTTP 404 has no favicon, Apple touch
icon, Open Graph, or Twitter metadata.

**Why:** The routes correctly change the document title and canonical URL, but
shared legal, demo, recipient, and error pages are identified as the landing
page (or have no social/icon identity at all). This fails the required
per-route metadata check.

**Fix:** Set route-specific description, `og:title`, `og:description`,
`twitter:title`, and `twitter:description` as routes render. Add the existing
favicon/Apple icon and route-appropriate OG/Twitter tags to `404.html`.

## Copy audit

Word counts exclude punctuation and symbol-only marks. Labels and controls are
included so the audit also checks result-naming buttons. No item is over 22
words and no banned marketing adjective appears. `*` marks the findings above.

### Landing page

| Copy | Words | Result |
| --- | ---: | --- |
| Skip to list | 3 | Pass |
| SLH 01 | 2 | Wordmark |
| Demo; How it works; Privacy | 1; 3; 1 | Pass |
| Hand off a clear shopping list | 6 | Pass |
| For cooks who need someone outside their app to shop without questions. | 12 | Pass |
| Try it with sample data | 5 | Pass; declared demo |
| Opens a ready-to-send pasta list. | 5 | Pass; `sample-demo` |
| LOCAL Stored in this browser | 5 | Pass; `local-only` |
| OFFLINE Works after first visit | 5 | Pass; `offline-reload` |
| FREE No account needed | 4 | Pass; `free-use`, `no-account` |
| Pasted ingredients become a shopping card. | 6 | * F-2-3 |
| 02 / MAKE THE LIST | 4 | Section label, plain but not a heading |
| Paste ingredients or start a list | 6 | Pass |
| One ingredient per line works best. | 6 | * F-2-1 |
| We keep uncertain quantities visible. | 5 | Pass; `quantity-normalization` |
| Ingredient source; Paste ingredients; Add ingredients; Clear list | 2; 2; 2; 2 | Pass |
| Add one item; Amount; Unit; Item; Add item | 3; 1; 1; 1; 2 | Pass |
| Or open a local handoff file | 6 | Pass |
| Saved only in this browser. | 5 | Pass; `local-only` |
| SHOPPER COPY | 2 | Functional label |
| 0 items · 0 left | 4 | Dynamic status |
| ⌘P | 0 | * F-2-2 |
| Your handoff card will appear here. | 6 | Pass |
| Paste ingredients or add an item above. | 8 | Pass |
| Note for the shopper (not in QR) | 7 | Pass; `qr-private` |
| Copy plain text; Make QR code; Save local file | 3; 3; 3 | Pass; declared export/QR claims |
| 03 / HOW IT WORKS | 4 | Section label, plain but not a heading |
| Make a list someone can use | 6 | Pass |
| Paste; Paste ingredient lines into the list. | 1; 6 | Pass |
| Check; Review units and produce counts before sending. | 1; 7 | Pass; `quantity-normalization` |
| Hand off; Print, copy, scan, or save a local file. | 2; 8 | Pass; declared export/QR claims |
| Your list stays on this device | 6 | Pass; `local-only` |
| There are no accounts or cloud lists. | 7 | Pass; `no-account`, `local-data-private` |
| QR codes contain only item names and quantities. | 8 | Pass; `qr-private` |
| Notes never go into a QR code. | 7 | Pass; `qr-private` |
| Clear lists for people outside your app. | 7 | Product footer line |
| Privacy; Terms; Built by Param Factory; v1.0.0 | 1; 1; 4; 1 | Pass |

Terminology otherwise stays consistent: **ingredient**, **shopper**,
**shopper note**, **local handoff file**, and **QR code** each have one use.

### README

| Copy | Words | Result |
| --- | ---: | --- |
| Shopping List Handoff | 3 | Product name |
| Turn pasted ingredients into a clear shopping list for someone who does not use your meal-planning app. | 17 | Pass; `pasted-ingredients-to-card` |
| It is for household cooks who need to hand a precise list to another shopper. | 15 | Pass |
| Paste ingredient lines and check the quantities. | 7 | Pass |
| Then print, copy, make a QR code, or save a local handoff file. | 13 | Pass; declared export/QR claims |
| The QR code opens a list in a browser. | 9 | Pass; `qr-recipient` |
| The working list stays in your browser. | 7 | Pass; `local-only` |
| No account is needed. | 5 | Pass; `no-account` |
| Use | 1 | Heading: understandable in README context |
| Paste one ingredient per line, such as `500 g spaghetti` or `1 lemon`. | 13 | Pass |
| Check the handoff card, especially count-based produce and packs. | 9 | Pass |
| Use Copy plain text, Make QR code, Save local file, or print. | 12 | Pass; declared export/QR claims |
| Compatible metric and volume quantities combine into one line. | 9 | Pass; `quantity-normalization` |
| Equal count units, such as two bunches of basil, combine too. | 10 | Pass; `quantity-normalization` |
| Counts and unmeasured items stay visible with a review warning rather than guessing a size. | 15 | Pass; `quantity-normalization` |
| Scanning a QR code opens a readable list in the browser. | 10 | Pass; `qr-recipient` |
| The item data stays in the URL fragment, which is not sent to the server. | 14 | Pass; `qr-private`, `local-data-private` |
| QR codes exclude the list title and shopper note. | 9 | Pass; `qr-private` |
| The local JSON handoff file excludes the note too. | 9 | Pass; `local-file-private` |
| Try the isolated demo at `/demo` or use Try it with sample data. | 13 | Pass; `sample-demo`, `local-only` |
| Demo data uses a different browser-storage key from real lists. | 10 | Pass; `local-only` |
| The app works offline after the first visit. | 8 | Pass; `offline-reload` |
| Develop | 1 | Heading |
| `npm run build` writes the static deployment output to `dist/`, with `dist/index.html` at its root. | 17 | Developer instruction |
| Deploy that directory to Azure Static Web Apps. | 8 | Developer instruction |
| Privacy and limits | 3 | Heading |
| No list data is sent to a server. | 8 | Pass; `local-data-private` |
| The browser stores real lists under `slh:real:list` and the demo under `slh:demo:list`. | 14 | Pass; `local-only` |
| Clearing browser site data clears them. | 6 | Pass; `site-data-clear` |
| Read the in-product Privacy and Terms pages for details. | 9 | Pass |
| Project notes | 2 | Heading |
| The blueprint illustration is original, generated factory artwork. | 7 | Repository provenance |
| Its prompt and provenance are recorded in `.factory/design.md`. | 9 | Repository fact |
| Claim coverage is listed in `.factory/claims.json`; demo behavior is documented in `.factory/demo.md`. | 14 | Repository fact |

## Demo, privacy, and claims

- A clean live `/demo` loaded the realistic Wednesday pasta night card with
  six named items on the first rendered screen. The persistent banner read
  **“Demo — sample data, nothing is saved.”** and exposed **Reset demo** and
  **Start for real**.
- Direct demo entry created only `slh:demo:list`. Reset restored the sample.
  Starting for real removed that key and returned to the separate real list.
- A populated demo flow generated only same-origin `GET` requests for the
  document and bundled assets. There were no request bodies, external origins,
  analytics, or runtime AI calls. The source contains no fetch/XHR call.
- In the clean clone, `npm run lint`, `npm run typecheck`, `npm test` (30
  passed), and `npm run build` passed. `dist/` was produced.
- Every exact command in `.factory/claims.json` passed independently:
  `sample-demo`, `no-account`, `free-use`, `pasted-ingredients-to-card`,
  `plain-text-export`, `local-file-private`, `local-file-roundtrip`,
  `print-sheet`, `qr-recipient`, `qr-private`, `recipient-checkable`,
  `quantity-normalization`, `local-only`, `local-data-private`,
  `site-data-clear`, and `offline-reload`. Each `@claim:` tag occurs exactly
  once in `tests/`.

## History retest

Every earlier review/polish/handoff finding was checked again on live and in
source:

| Earlier id / finding | Live and code result |
| --- | --- |
| F-1-1 recipe-details conversion wording/claim | Fixed: live says “Pasted ingredients become a shopping card”; the declared conversion test passes. F-2-3 is a new terminology finding, not a return of the removed recipe-details promise. |
| F-1-2 “any recipe app” universal promise | Fixed: absent from live and source. |
| F-1-3 browser-site-data deletion claim | Fixed: `site-data-clear` is listed and its exact test passes. |
| F-1-4 decorative “HANDOFF SHEET / 01” | Fixed: absent. |
| F-1-5 “04 / BOUNDARIES” | Fixed: absent. |
| Verification-4 print omission | Fixed: source prints `.print-note`; the print claim test passes. |
| Verification-4 irreversible removal/focus loss | Fixed: source renders an Undo control, persists restoration, and targets it for focus; regression suite passes. |
| Verification-4 404 shell/metadata basics | Partly fixed: live 404 has header, nav, footer, h1, description, canonical, and a home link. F-2-4 records the remaining missing favicon/social metadata. |

## Structure and leverage checks

The live home, demo, privacy, terms, and handoff routes returned 200; an
unknown route returned the designed 404 with HTTP 404. Each tested route had
one h1 and one main. Titles follow the required route pattern, canonical URLs
change with SPA navigation, back navigation restores the route and focuses its
h1, and the live console had no application error. The normal application
links, sitemap routes, icons, and artwork resolved; the unknown route's
network 404 console message was expected.

The blueprint drafting system is distinct from a generic SaaS template. It
uses original blueprint artwork, fixed midnight/cream/red drafting tokens,
and practical-sheet components consistent with `.factory/design.md`.

The brief already implies transfer/import/export, and the product provides
plain text, local-file import/export, print, and QR sharing. AI would not make
this deterministic, local-first handoff materially more useful; no missing AI
feature or embedded provider key was found.

## What would make this perfect

Remove the unsupported “works best” comparison, make print self-explanatory
on the button itself, choose **handoff card** everywhere, and complete each
route's share/icon metadata. Then rerun every declared claim command and the
route metadata crawl from a clean context.
