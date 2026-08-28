# Adversarial first-read review 3 — FAIL

**Reviewed:** 2026-08-28

**Live URL:** <https://shopping-list-handoff.sociobot.in>

**Contexts:** fresh Chromium at 390 × 844 and 1440 × 900; clean clone at
`/tmp/shopping-list-handoff-review-3.s9IGpE` from `d2354f0`.

## Verdict: FAIL

The landing page explains the job, audience, and first action within one
mobile screen. The one-click demo then fails its stricter first-screen gate:
it repeats the marketing hero and hides the populated handoff card below the
viewport at both tested widths. Two subjective outcomes are also absent from
the claims manifest. Eight minor copy, routing, and output-quality findings
remain. A zero-finding PASS is not available.

## Cold first read

Before scrolling, I understood the product as follows:

- **What:** it turns pasted ingredients into a shopping list that can be
  handed to another person.
- **For whom:** cooks whose shopper does not use their meal-planning app.
- **First click:** **Try it with sample data**. The adjacent text says it opens
  a pasta list.

This passes at 390 × 844 and 1440 × 900. The mobile first screen contains the
h1, audience sentence, action, stated result, and all three facts. Evidence:
[`live-root-mobile.png`](qa-evidence/review-3/live-root-mobile.png) and
[`live-root-desktop.png`](qa-evidence/review-3/live-root-desktop.png).

## Findings

### F-3-1 — BLOCKING — the one-click demo does not show the product in its first screen

**Location / quote:** Click **“Try it with sample data”** from `/`. The resulting
`/demo` first screen repeats **“Hand off a clear shopping list”**, another
**“Try it with sample data”** button, and the hero artwork. No sample item or
handoff card is visible.

**Evidence:** At 390 × 844, the last visible demo content is the facts/artwork;
the sample list is below the viewport. At 1440 × 900, the `.handoff-sheet`
starts at y = 1017.4. See
[`live-demo-after-click-mobile.png`](qa-evidence/review-3/live-demo-after-click-mobile.png)
and [`live-demo-desktop.png`](qa-evidence/review-3/live-demo-desktop.png).

**Why:** The demo contract requires the first screen after one click to
already look like the product in use. A visitor instead sees the landing page
again and has to infer that sample data exists farther down. The
`@claim:sample-demo` test does not catch this because Playwright
`toBeVisible()` treats below-viewport DOM content as visible.

**Fix:** Make `/demo` start with a demo-specific h1 and the seeded **Wednesday
pasta night** handoff card immediately below the persistent banner. Remove the
duplicate Try action on that route. Add a 390 × 844 claim assertion that the
list title and at least two sample rows intersect the viewport after the
landing button is clicked.

### F-3-2 — BLOCKING — the landing page makes an unlisted, untestable outcome promise

**Location / quote:** Hero audience sentence: **“For cooks who need someone
outside their app to shop without questions.”**

**Why:** “Without questions” promises another person's future behaviour. No
entry in `.factory/claims.json` declares or tests that outcome, and a sandbox
cannot prove it. The phrase also uses “someone” where the rest of the product
uses “shopper.”

**Fix:** Replace it with **“For cooks handing a list to a shopper outside their
meal-planning app.”**

### F-3-3 — BLOCKING — the README makes an unlisted subjective quality claim

**Location / quote:** README opening: **“It is for household cooks who need to
hand a precise list to another shopper.”**

**Why:** “Precise” is an undefined quality promise. No claims entry defines or
tests precision across accepted inputs.

**Fix:** Replace it with **“It is for household cooks handing a shopping list
to another shopper.”**

### F-3-4 — MINOR — the README uses unexplained browser jargon

**Location / quote:** **“The item data stays in the URL fragment, which is not
sent to the server.”**

**Why:** “URL fragment” is implementation terminology, not wording a normal
shopper needs to understand the privacy boundary.

**Fix:** Use **“The list is encoded after the # in the link, so the browser
does not send it to the server.”**

### F-3-5 — MINOR — the README changes the name of the local handoff file

**Location / quote:** **“The local JSON handoff file excludes the note too.”**

**Why:** The interface and terminology table call this a **local handoff
file**. Adding “JSON” introduces jargon and makes one concept look like a
different export.

**Fix:** Use **“The local handoff file leaves out the note too.”**

### F-3-6 — MINOR — the README explains demo isolation with storage jargon

**Location / quote:** **“Demo data uses a different browser-storage key from
real lists.”**

**Why:** Visitors need the consequence, not the storage mechanism.

**Fix:** Use **“Demo data is stored separately from your real lists.”**

### F-3-7 — MINOR — decorative serial labels and an unexplained initialism remain

**Locations / quotes:** Header **“SLH 01”**; landing labels **“02 / MAKE THE
LIST”** and **“03 / HOW IT WORKS”**; legal labels **“PRIVACY / 01”** and
**“TERMS / 01”**; 404 label **“DRAWING NOT FOUND / 404.”**

**Why:** The numbers carry no information and “SLH” is not expanded for a
first-time visitor. These are the serial and brand-lore labels prohibited by
the plain-words standard. The meaningful h1/h2 text already supplies the
section context.

**Fix:** Use **Shopping List Handoff** as the wordmark. Remove the serial
labels. Make the actual section h2 **“How it works”** where that section name
is needed.

### F-3-8 — MINOR — the 404 headline uses the blueprint metaphor instead of naming the error

**Location / quote:** 404 h1: **“This sheet is not here.”**

**Why:** A missing route is a page, not a sheet. The visitor has to translate
the visual theme before understanding the error.

**Fix:** Use **“This page was not found”** and keep the blueprint styling as
the visual identity.

### F-3-9 — MINOR — Back restores the route and focus but loses the prior scroll position

**Location:** Client-side navigation from `/` to `/privacy`, then browser Back.

**Evidence:** Starting at landing `scrollY = 1200`, Privacy correctly opened at
0 with its h1 focused. Back returned to `/` with the landing h1 focused but
`scrollY = 0`, not 1200.

**Why:** The site-structure contract requires back/forward navigation to
restore both scroll and focus. Returning a reader to the top loses their place
in the live product.

**Fix:** Save each history entry's scroll coordinates. On `popstate`, focus
the route h1 with `{ preventScroll: true }`, then restore that entry's scroll
position. Add a browser test that starts well below the first screen and
asserts the restored y position.

### F-3-10 — MINOR — legal-page headlines are slogans instead of route names

**Locations / quotes:** Privacy h1 **“Privacy is the default”** and Terms h1
**“Simple terms for a local tool.”**

**Why:** “Privacy is the default” is a broad slogan, while “simple” is a
subjective adjective and “local tool” does not name the product. Neither is as
useful in a heading list as the page's actual subject.

**Fix:** Use **“How Shopping List Handoff stores data”** and **“Terms for
Shopping List Handoff.”**

### F-3-11 — MINOR — normalization creates an impractical quantity

**Location / observed result:** In the live demo, adding unrelated ingredient
lines changes **“2 tbsp olive oil”** to **“29.57 ml olive oil.”** Source
`normalized()` converts every existing non-count unit to its base unit whenever
new items are added.

**Why:** A technically converted value is less concise and harder to check
than the entered cooking measure. The brief calls for a concise, checkable
handoff, not maximum decimal precision.

**Fix:** Preserve an item's entered unit when no merge requires conversion.
When units must combine, choose a practical display unit and rounding rule.
Add a regression test proving that adding an unrelated item does not rewrite
`2 tbsp` and that mixed-unit merges use shopper-readable precision.

## Copy audit

Counts treat hyphenated terms and code paths as one word. Navigation, labels,
headings, buttons, and empty-state text are included so result naming and
out-of-context headings can be checked. No line exceeds 22 words and none uses
a word from the supplied banned-word list.

### Landing page

| Copy | Words | Result |
| --- | ---: | --- |
| Skip to list | 3 | Pass |
| SLH 01 | 2 | F-3-7 |
| Demo; How it works; Privacy | 1; 3; 1 | Pass |
| Hand off a clear shopping list | 6 | Pass |
| For cooks who need someone outside their app to shop without questions. | 12 | F-3-2 |
| Try it with sample data | 5 | Pass; `sample-demo` |
| Opens a ready-to-send pasta list. | 5 | Pass; `sample-demo` |
| LOCAL — Stored in this browser | 5 | Pass; `local-only`, `local-data-private` |
| OFFLINE — Works after first visit | 5 | Pass; `offline-reload` |
| FREE — No account needed | 4 | Pass; `free-use`, `no-account` |
| Pasted ingredients become a handoff card. | 6 | Pass; `pasted-ingredients-to-card` |
| 02 / MAKE THE LIST | 4 | F-3-7 |
| Paste ingredients or start a list | 6 | Pass |
| Paste one ingredient per line. | 5 | Pass |
| We keep uncertain quantities visible. | 5 | Pass; `quantity-normalization` |
| Ingredient source; Paste ingredients | 2; 2 | Pass |
| Add ingredients; Clear list | 2; 2 | Pass; result-naming verbs |
| Add one item; Amount; Unit; Item; Add item | 3; 1; 1; 1; 2 | Pass |
| Or open a local handoff file | 6 | Pass |
| Saved only in this browser. | 5 | Pass; `local-only`, `local-data-private` |
| SHOPPER COPY; 0 items · 0 left | 2; 4 | Pass / dynamic status |
| Print shopping list | 3 | Pass; `print-sheet` |
| Your handoff card will appear here. | 6 | Pass |
| Paste ingredients or add an item above. | 7 | Pass |
| Note for the shopper (not in QR) | 7 | Pass; `qr-private` |
| Copy plain text; Make QR code; Save local file | 3; 3; 3 | Pass; declared export claims |
| 03 / HOW IT WORKS | 4 | F-3-7 |
| Make a list someone can use | 6 | Pass |
| Paste; Paste ingredient lines into the list. | 1; 6 | Pass |
| Check; Review units and produce counts before sending. | 1; 7 | Pass; `quantity-normalization` |
| Hand off; Print, copy, scan, or save a local file. | 2; 8 | Pass; declared export claims |
| Your list stays on this device | 6 | Pass; `local-only`, `local-data-private` |
| There are no accounts or cloud lists. | 7 | Pass; `no-account`, `local-data-private` |
| QR codes contain only item names and quantities. | 8 | Pass; `qr-private` |
| Notes never go into a QR code. | 7 | Pass; `qr-private` |
| Clear lists for people outside your app. | 7 | Pass; footer one-liner |
| Privacy; Terms; Built by Param Factory; v1.0.0 | 1; 1; 4; 1 | Pass |

### README

| Copy | Words | Result |
| --- | ---: | --- |
| Shopping List Handoff | 3 | Product name |
| Turn pasted ingredients into a clear shopping list for someone who does not use your meal-planning app. | 17 | Pass; `pasted-ingredients-to-card` |
| It is for household cooks who need to hand a precise list to another shopper. | 15 | F-3-3 |
| Paste ingredient lines and check the quantities. | 7 | Pass |
| Then print, copy, make a QR code, or save a local handoff file. | 13 | Pass; declared export claims |
| The QR code opens a list in a browser. | 9 | Pass; `qr-recipient` |
| The working list stays in your browser. | 7 | Pass; `local-only`, `local-data-private` |
| No account is needed. | 4 | Pass; `no-account` |
| Use it | 2 | Pass; heading |
| Paste one ingredient per line, such as `500 g spaghetti` or `1 lemon`. | 13 | Pass |
| Check the handoff card, especially count-based produce and packs. | 9 | Pass |
| Use Copy plain text, Make QR code, Save local file, or print. | 12 | Pass; declared export claims |
| Compatible metric and volume quantities combine into one line. | 9 | Pass; `quantity-normalization` |
| Equal count units, such as two bunches of basil, combine too. | 11 | Pass; `quantity-normalization` |
| Counts and unmeasured items stay visible with a review warning rather than guessing a size. | 15 | Pass; `quantity-normalization` |
| Scanning a QR code opens a readable list in the browser. | 11 | Pass; `qr-recipient` |
| The item data stays in the URL fragment, which is not sent to the server. | 15 | F-3-4; privacy claim itself is covered |
| QR codes exclude the list title and shopper note. | 9 | Pass; `qr-private` |
| The local JSON handoff file excludes the note too. | 9 | F-3-5; `local-file-private` |
| Try the isolated demo at `/demo` or use Try it with sample data. | 13 | Pass; demo link works, F-3-1 applies after entry |
| Demo data uses a different browser-storage key from real lists. | 10 | F-3-6; `local-only` |
| The app works offline after the first visit. | 8 | Pass; `offline-reload` |
| Develop | 1 | Pass; heading |
| `npm run build` writes the static deployment output to `dist/`, with `dist/index.html` at its root. | 16 | Pass; developer instruction |
| Deploy that directory to Azure Static Web Apps. | 8 | Pass; developer instruction |
| Privacy and limits | 3 | Pass; heading |
| No list data is sent to a server. | 8 | Pass; `local-data-private` |
| The browser stores real lists under `slh:real:list` and the demo under `slh:demo:list`. | 12 | Pass; `local-only` |
| Clearing browser site data clears them. | 6 | Pass; `site-data-clear` |
| Read the in-product Privacy and Terms pages for details. | 9 | Pass |
| Project notes | 2 | Pass; heading |
| The blueprint illustration is original, generated factory artwork. | 8 | Pass; repository provenance |
| Its prompt and provenance are recorded in `.factory/design.md`. | 9 | Pass; repository fact |
| Claim coverage is listed in `.factory/claims.json`; demo behavior is documented in `.factory/demo.md`. | 14 | Pass; repository fact |

## Demo and sandbox verification

- Direct `/demo` and the landing action both seed **Wednesday pasta night**
  with spaghetti, olive oil, lemon, cherry tomatoes, parmesan, and basil.
- The persistent banner is present with **Reset demo** and **Start for real**.
- Reset restores the original title and six items.
- A deliberately seeded real list and private note remained byte-for-byte
  unchanged during demo edits and Reset. Start for real removed
  `slh:demo:list`, preserved `slh:real:list`, and reopened the real list.
- A populated live flow produced only same-origin GET requests for the page
  and bundled assets. There were no request bodies, external origins,
  analytics calls, AI calls, or device identifiers.
- After the first live visit, an offline reload of `/demo` retained the demo
  banner and sample list.
- F-3-1 remains blocking because the populated card is not in the first
  viewport after entry.

## Claims verification

Every exact command from `.factory/claims.json` ran separately in the clean
clone. Every claim id appears in exactly one test. All listed tests pass; the
unlisted claims are F-3-2 and F-3-3.

| Claim | Exact command | Result |
| --- | --- | --- |
| `sample-demo` | `npm test -- --grep @claim:sample-demo` | PASS — 1 test |
| `no-account` | `npm test -- --grep @claim:no-account` | PASS — 1 test |
| `free-use` | `npm test -- --grep @claim:free-use` | PASS — 1 test |
| `pasted-ingredients-to-card` | `npm test -- --grep @claim:pasted-ingredients-to-card` | PASS — 1 test |
| `plain-text-export` | `npm test -- --grep @claim:plain-text-export` | PASS — 1 test |
| `local-file-private` | `npm test -- --grep @claim:local-file-private` | PASS — 1 test |
| `local-file-roundtrip` | `npm test -- --grep @claim:local-file-roundtrip` | PASS — 1 test |
| `print-sheet` | `npm test -- --grep @claim:print-sheet` | PASS — 1 test |
| `qr-recipient` | `npm test -- --grep @claim:qr-recipient` | PASS — 1 test |
| `qr-private` | `npm test -- --grep @claim:qr-private` | PASS — 1 test |
| `recipient-checkable` | `npm test -- --grep @claim:recipient-checkable` | PASS — 1 test |
| `quantity-normalization` | `npm test -- --grep @claim:quantity-normalization` | PASS — 1 test |
| `local-only` | `npm test -- --grep @claim:local-only` | PASS — 1 test |
| `local-data-private` | `npm test -- --grep @claim:local-data-private` | PASS — 1 test |
| `site-data-clear` | `npm test -- --grep @claim:site-data-clear` | PASS — 1 test |
| `offline-reload` | `npm test -- --grep @claim:offline-reload` | PASS — 1 test |

The full clean-clone gates also pass: `npm run lint`, `npm run typecheck`, 32
Playwright tests, and `npm run build`. The build emits `dist/`; initial JS is
49.19 KB raw / 18.58 KB gzip.

## History retest

Every finding or repair item in the earlier reviews, polish records, and
handoff was checked against current source plus the live deployment. “Fixed”
below means observable now, not merely marked fixed earlier.

| Earlier finding / repair | Current verification |
| --- | --- |
| F-1-1 recipe-details conversion wording/claim | Fixed: wording names pasted ingredients and `pasted-ingredients-to-card` passes. |
| F-1-2 universal “any recipe app” promise | Fixed: absent from live copy and source. |
| F-1-3 site-data deletion claim | Fixed: declared; exact clearing test passes. |
| F-1-4 `HANDOFF SHEET / 01` | Fixed: exact label is absent. F-3-7 covers different serial labels that remain. |
| F-1-5 `04 / BOUNDARIES` | Fixed: absent. |
| F-2-1 “works best” input promise | Fixed: live instruction is “Paste one ingredient per line.” |
| F-2-2 symbol-only print button | Fixed: visible button says “Print shopping list”; print test passes. |
| F-2-3 shopping-card / handoff-card mismatch | Fixed: current result name is “handoff card.” |
| F-2-4 route and 404 share/icon metadata | Fixed: all tested routes have route-specific metadata; 404 has favicon, Apple icon, OG and Twitter tags. |
| V1 QR recipient path | Fixed: generated `/handoff#list=` opens a checkable recipient view. |
| V1 real 404 | Fixed: unknown path returns styled HTTP 404 with a route home. |
| V1 negative quantities | Fixed: regression test passes with an announced correction. |
| V1 focus and touch targets | Fixed: regression assertions and live axe checks pass. |
| V1 service-worker updates | Fixed: revision replacement test passes. |
| V2 checked-item recovery | Fixed: restore/export regression passes. |
| V2 claim coverage | Fixed for the 16 listed claims; F-3-2 and F-3-3 are newly identified unlisted claims. |
| V2 empty QR | Fixed: recovery-message regression passes. |
| V2 count-unit merge | Fixed: declared normalization test passes. |
| V2 overflow | Fixed: invalid amount regression passes. |
| V2 blank name | Fixed: associated announced error test passes. |
| V2 route history focus | Fixed for route and h1 focus. F-3-9 is the separately required scroll-restoration failure. |
| V2 200% reflow | Fixed: reflow regression passes. |
| V2 footer targets and first fold | Fixed: targets and all three facts pass at 390 px. |
| V2 returning-user feedback | Fixed: saved real-list feedback regression passes. |
| V3 free-use promise | Fixed: declared exact test passes. |
| V4 printed note | Fixed: print regression includes the note. |
| V4 destructive removal | Fixed: Undo, persistence, announcement, and focus regression passes. |
| V4 404 shell/metadata basics | Fixed: shell and complete metadata verify live. |
| Handoff “Known gaps: None” | No longer accurate because this review identifies F-3-1 through F-3-11. |

## Structure, accessibility, and identity

- `/`, `/demo`, `/privacy`, `/terms`, and `/handoff` return 200. A random
  missing path returns the designed 404 with HTTP 404.
- Each route has `lang="en"`, one h1, one main landmark, a route title,
  description, canonical URL, favicon, Apple icon, and OG/Twitter metadata.
  The social image is 1200 × 630.
- The internal-link crawl found no dead product links. QR recipient links also
  open and are covered by their claim tests.
- Route changes move focus to the new h1 and announce it. F-3-9 records the
  failed scroll restoration on Back.
- `/opt/fleet/lib/verify-url.sh` passed on live `/` and `/demo`; reports are in
  `qa-evidence/review-3/verify-root/verify.json` and
  `qa-evidence/review-3/verify-demo/verify.json`.
- Live axe scans of `/`, `/demo`, `/privacy`, `/terms`, and `/handoff` found no
  serious or critical violations. No application console errors were found.
- The blueprint drafting-sheet identity is distinct rather than a generic
  SaaS template. Its midnight grid, cream paper, drafting marks, original art,
  and restrained motion match `.factory/design.md`. F-3-7 and F-3-8 concern
  copy clarity, not the visual direction.

## Missed leverage

The brief implies transfer and portable output. The product already supplies
plain text, print, a local-file import/export round trip, and QR transfer. A
runtime AI feature would add cost and a network/privacy boundary to a
deterministic parsing task without an obvious user benefit. No missing AI
feature, sync requirement, decorative AI, provider key, or direct Azure model
call was found. F-3-11 is the concrete remaining leverage in the deterministic
normalization already present.

## What would make this perfect

Put the populated handoff card in the first demo viewport and add a viewport
assertion to its claim test. Remove or rewrite the two unlisted subjective
promises. Replace the three README jargon phrases, delete serial/lore labels,
use literal route headings, restore scroll on browser history, and preserve
human-friendly ingredient units. Then rerun every claim command, the full
suite, the live privacy/offline log, and the two-viewport cold/demo check. At
that point there should be no remaining finding to describe.
