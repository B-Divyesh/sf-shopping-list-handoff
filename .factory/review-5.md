# Adversarial first-read review 5 — PASS

**Reviewed:** 2026-08-29  
**Live URL:** <https://shopping-list-handoff.sociobot.in>  
**Reviewed code:** `5310a2ac7d050e1e27859b66519b62911fbf4227`  
**Contexts:** fresh Chromium at 390 × 844 and 1440 × 900; clean clone at
`/tmp/slh-review-5-clean`.

## Verdict: PASS

No blocking or minor finding remains. The landing page is clear before
scrolling, the one-click demo starts with realistic data in the viewport, all
16 declared claims pass their exact commands, no live claim is unlisted, and
every earlier review finding remains fixed in the deployed site and source.

## Cold first read

Before scrolling, I understood:

- **What it does:** turns pasted ingredients into a shopping list that can be
  handed to another shopper.
- **For whom:** cooks handing a list to a shopper outside their meal-planning
  app.
- **What to click first:** **Try it with sample data**. The adjacent sentence
  says it opens a ready-to-send pasta list.

This passes at 390 × 844 and 1440 × 900. On mobile, the h1 ends at y = 268.5,
the audience sentence at y = 347.7, the primary action at y = 415.7, and the
last of the three facts at y = 529.7. All are inside the initial 844 px
viewport. No text failed the first-read check.

## Findings

None.

## Copy audit

Counts exclude punctuation and treat hyphenated terms as one word. Navigation,
headings, labels, controls, and empty-state copy are included even when they
are fragments rather than sentences. No copy exceeds 22 words. No banned
word, unsupported marketing adjective, jargon, inconsistent term, metaphor or
mood heading, empty slogan, or non-result-naming button remains.

### Landing page

| Copy | Words | Check |
| --- | ---: | --- |
| Skip to list | 3 | Clear skip action |
| Shopping List Handoff | 3 | Product wordmark |
| Demo; How it works; Privacy | 1; 3; 1 | Clear navigation |
| Hand off a clear shopping list | 6 | Job-focused h1 |
| For cooks handing a list to a shopper outside their meal-planning app. | 12 | Audience and situation |
| Try it with sample data | 5 | Result-naming action; `sample-demo` |
| Opens a ready-to-send pasta list. | 5 | Immediate result; `sample-demo` |
| LOCAL — Stored in this browser | 5 | `local-only`, `local-data-private` |
| OFFLINE — Works after first visit | 5 | `offline-reload` |
| FREE — No account needed | 4 | `free-use`, `no-account` |
| Pasted ingredients become a handoff card. | 6 | `pasted-ingredients-to-card` |
| Paste ingredients or start a list | 6 | Literal section heading |
| Paste one ingredient per line. | 5 | Direct instruction |
| We keep uncertain quantities visible. | 5 | `quantity-normalization` |
| Ingredient source | 2 | Input-section heading |
| Paste ingredients | 2 | Bound field label |
| Add ingredients | 2 | Result-naming button |
| Clear list | 2 | Result-naming button |
| Add one item | 3 | Form heading |
| Amount; Unit; Item | 1; 1; 1 | Bound field labels |
| Add item | 2 | Result-naming button |
| Or open a local handoff file | 6 | File-input instruction |
| Saved only in this browser. | 5 | `local-only`, `local-data-private` |
| Handoff card; Shopping list | 2; 2 | Functional card labels |
| 0 items · 0 left | 4 | Dynamic status |
| Print shopping list | 3 | `print-sheet` |
| Your handoff card will appear here. | 6 | Empty-state result |
| Paste ingredients or add an item above. | 7 | Empty-state next step |
| Note for the shopper (not in QR) | 7 | `qr-private` |
| Copy plain text | 3 | `plain-text-export` |
| Make QR code | 3 | `qr-recipient`, `qr-private` |
| Save local file | 3 | `local-file-private`, `local-file-roundtrip` |
| How it works | 3 | Literal section heading |
| Paste | 1 | Step heading |
| Paste ingredient lines into the list. | 6 | Direct instruction |
| Check | 1 | Step heading |
| Review units and produce counts before sending. | 7 | Direct instruction |
| Hand off | 2 | Step heading |
| Print, copy, scan, or save a local file. | 8 | Declared output actions |
| Your list stays on this device | 6 | Privacy heading; `local-only` |
| There are no accounts or cloud lists. | 7 | `no-account`, `local-data-private` |
| QR codes contain only item names and quantities. | 8 | `qr-private` |
| Notes never go into a QR code. | 7 | `qr-private` |
| Shopping lists for people outside your app. | 7 | Footer description |
| Privacy; Terms; Built by Param Factory; v1.0.0 | 1; 1; 4; 1 | Functional footer |

### README

| Copy | Words | Check |
| --- | ---: | --- |
| Shopping List Handoff | 3 | Product name |
| Turn pasted ingredients into a clear handoff card for a shopper outside your meal-planning app. | 15 | `pasted-ingredients-to-card` |
| It is for household cooks handing a shopping list to another shopper. | 12 | Audience |
| Paste ingredient lines and check the quantities. | 7 | Direct instruction |
| Then print, copy, make a QR code, or save a local handoff file. | 13 | Declared output actions |
| The QR code opens a list in a browser. | 9 | `qr-recipient` |
| The working list stays in your browser. | 7 | `local-only`, `local-data-private` |
| No account is needed. | 4 | `no-account` |
| Use it | 2 | Clear heading |
| Paste one ingredient per line, such as `500 g spaghetti` or `1 lemon`. | 13 | Direct instruction and example |
| Check the handoff card, especially count-based produce and packs. | 9 | Direct instruction |
| Use Copy plain text, Make QR code, Save local file, or print. | 12 | Declared output actions |
| Compatible metric and volume quantities combine into one line. | 9 | `quantity-normalization` |
| Equal count units, such as two bunches of basil, combine too. | 11 | `quantity-normalization` |
| Counts and unmeasured items stay visible with a review warning rather than guessing a size. | 15 | `quantity-normalization` |
| Scanning a QR code opens a readable list in the browser. | 11 | `qr-recipient` |
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
| The blueprint illustration is original, generated factory artwork. | 8 | Provenance fact |
| Its prompt and provenance are recorded in `.factory/design.md`. | 9 | Repository fact |
| Claim coverage is listed in `.factory/claims.json`; demo behavior is documented in `.factory/demo.md`. | 14 | Repository fact |
| License | 1 | Clear heading |
| MIT. | 1 | License fact |
| See LICENSE. | 2 | Direct instruction |

Terminology is consistent: **ingredient**, **handoff card**, **shopper**,
**shopper note**, **local handoff file**, and **QR code** each retain one
meaning.

## Demo and sandbox

- One click from the cold landing page opens `/demo`. At 390 × 844, the demo
  h1, list title, spaghetti row, and olive-oil row all intersect the first
  viewport; the two rows end at y = 703.8 and y = 748.8.
- The persistent banner says **“Demo — sample data, nothing is saved.”** and
  shows **Reset demo** and **Start for real**.
- Changing the title and removing spaghetti, then selecting **Reset demo**,
  restores **Wednesday pasta night** and spaghetti.
- A real `real oats` list was created before demo entry. Demo edits and Reset
  left its stored bytes unchanged. **Start for real** removed the demo key,
  retained only `slh:real:list`, reopened `real oats`, and reported that the
  saved real list was ready.
- The live flow issued four requests: the document, one bundled script, one
  bundled stylesheet, and the hero image. All were same-origin GETs with no
  request body. There were no analytics, third-party font/script, AI, or
  provider-key requests and no console errors.
- After the service worker became ready, a live `/demo` reload succeeded with
  the browser context offline and retained both the demo banner and sample.

## Claims

Every exact command in `.factory/claims.json` ran independently from the clean
clone. Every manifest id appears exactly once as an `@claim:<id>` tag.

| Claim id | Exact command | Result |
| --- | --- | --- |
| `sample-demo` | `npm test -- --grep @claim:sample-demo` | PASS |
| `no-account` | `npm test -- --grep @claim:no-account` | PASS |
| `free-use` | `npm test -- --grep @claim:free-use` | PASS |
| `pasted-ingredients-to-card` | `npm test -- --grep @claim:pasted-ingredients-to-card` | PASS |
| `plain-text-export` | `npm test -- --grep @claim:plain-text-export` | PASS |
| `local-file-private` | `npm test -- --grep @claim:local-file-private` | PASS |
| `local-file-roundtrip` | `npm test -- --grep @claim:local-file-roundtrip` | PASS |
| `print-sheet` | `npm test -- --grep @claim:print-sheet` | PASS |
| `qr-recipient` | `npm test -- --grep @claim:qr-recipient` | PASS |
| `qr-private` | `npm test -- --grep @claim:qr-private` | PASS |
| `recipient-checkable` | `npm test -- --grep @claim:recipient-checkable` | PASS |
| `quantity-normalization` | `npm test -- --grep @claim:quantity-normalization` | PASS |
| `local-only` | `npm test -- --grep @claim:local-only` | PASS |
| `local-data-private` | `npm test -- --grep @claim:local-data-private` | PASS |
| `site-data-clear` | `npm test -- --grep @claim:site-data-clear` | PASS |
| `offline-reload` | `npm test -- --grep @claim:offline-reload` | PASS |

The landing, README, demo, Privacy, Terms, recipient, metadata, errors, and
dynamic output copy were cross-checked against the manifest. No unlisted
claim-like sentence or untested declared claim was found.

## Earlier finding verification

Every earlier review and polish record plus the prior handoff was read. Each
row below was checked in current source and, where observable, on the live
site. “Fixed” means independently verified in this round.

| Earlier item | Round-5 confirmation |
| --- | --- |
| F-1-1 conversion wording/claim | Fixed: landing and README name pasted ingredients and a handoff card; the tagged conversion test passes. |
| F-1-2 universal recipe-app compatibility | Fixed: “any recipe app” is absent from live copy and source. |
| F-1-3 site-data deletion claim | Fixed: `site-data-clear` is declared and passes. |
| F-1-4 decorative hero serial | Fixed: “HANDOFF SHEET / 01” is absent. |
| F-1-5 abstract privacy serial | Fixed: “04 / BOUNDARIES” is absent. |
| F-2-1 subjective “works best” copy | Fixed: the live instruction is “Paste one ingredient per line.” |
| F-2-2 symbol-only print control | Fixed: the visible control says “Print shopping list”; `print-sheet` passes. |
| F-2-3 shopping-card terminology | Fixed: the result is consistently “handoff card.” |
| F-2-4 route/404 metadata | Fixed: every tested route has its own title, description, canonical, OG and Twitter values; 404 has both icons. |
| F-3-1 demo below the first screen | Fixed: title and two realistic rows are inside the 390 × 844 viewport. |
| F-3-2 “shop without questions” | Fixed: the audience sentence names cooks and shoppers without predicting behaviour. |
| F-3-3 undefined “precise” claim | Fixed: absent from README. |
| F-3-4 “URL fragment” jargon | Fixed: README explains the `#` portion of the link. |
| F-3-5 JSON/file terminology | Fixed: README uses “local handoff file.” |
| F-3-6 browser-storage-key jargon | Fixed: README says demo data is stored separately. |
| F-3-7 serial labels and `SLH 01` | Fixed: full wordmark and literal headings are live. |
| F-3-8 metaphorical 404 h1 | Fixed: live h1 is “This page was not found.” |
| F-3-9 Back scroll restoration | Fixed: live Back restored y = 1200 and focused/announced the landing h1. |
| F-3-10 slogan-like legal h1s | Fixed: Privacy and Terms use literal product-specific h1s. |
| F-3-11 impractical unit conversion | Fixed: normalization preserves matching measures and the tagged test proves readable mixed-unit output. |
| F-4-1 unlisted Terms boundary | Fixed: the sentence is absent live and in source; its regression test passes. |
| V1 QR recipient path | Fixed: a generated same-origin recipient page is readable, checkable, private, and storage-free. |
| V1 real 404 | Fixed: a missing path returns HTTP 404 with the designed page and a route home. |
| V1 negative quantities | Fixed: announced validation prevents persistence and export. |
| V1 focus/touch targets | Fixed: keyboard and 44 px regression tests pass; live axe has no serious/critical issue. |
| V1 service-worker updates | Fixed: revision replacement and live offline reload pass. |
| V2 checked-item recovery | Fixed: checked items can be restored and re-enter every output. |
| V2 claim coverage | Fixed: 16 manifest ids, 16 single tag occurrences, 16 passing exact commands. |
| V2 empty QR | Fixed: an empty list gives the tested add-an-item recovery message. |
| V2 count-unit merge | Fixed: equal counts merge and keep the review warning. |
| V2 overflow | Fixed: finite-range validation prevents invalid storage/import. |
| V2 blank name | Fixed: the associated error is visible, announced, and focused. |
| V2 route history | Fixed: real routes restore heading focus, announcement, and scroll. |
| V2 200% reflow | Fixed: live 390 px layout remains 390 px wide at 200% text. |
| V2 footer targets/first fold | Fixed: tests pass and all three facts are in the live first viewport. |
| V2 returning-user feedback | Fixed: saved real data and accurate feedback survive demo exit. |
| V3 free-use promise | Fixed: `free-use` passes through sender and recipient flows. |
| V4 printed note | Fixed: print media includes the static shopper note. |
| V4 destructive removal | Fixed: remove is announced, persisted, undoable, and focus-safe. |
| V4 404 shell/metadata | Fixed: live 404 has header, nav, footer, icons, canonical and social metadata. |

## Structure, accessibility, and identity

- `/`, `/demo`, `/privacy`, `/terms`, and `/handoff` return 200. A missing
  path returns the designed page with HTTP 404. All discovered internal links
  resolve; the deliberate missing path is the only 404.
- Every checked route has `lang="en"`, one h1, one main, a consistent header
  and footer, route-specific title/description/canonical/OG/Twitter metadata,
  favicon and Apple touch icon. `robots.txt` and `sitemap.xml` resolve.
- Client navigation moves focus to and announces the new h1. Back restores the
  prior route, focused h1, announcement, and y = 1200 scroll position.
- Axe WCAG 2 A/AA scans of all public routes and the 404 found no serious or
  critical violations. The supplied URL verifier passed `/` and `/demo` with
  no console error, missing alt, or unnamed button.
- The clean clone passed lint, typecheck, all 33 Playwright tests, and build.
  `dist/` was produced; initial JavaScript is 49.67 KB raw / 18.66 KB gzip.
- The midnight drafting grid, cream field sheet, measurement typography,
  tomato-red transfer action, original blueprint art, and restrained motion
  match `.factory/design.md`. This is recognisably product-specific rather
  than a generic SaaS template.

## Missed leverage

No finding. The brief implies portable transfer, and the product supplies
plain text, print, QR transfer, local-file export, and local-file import. Sync
would conflict with the stated local-first boundary. AI would add network,
cost, and key handling to a deterministic parsing and handoff task without an
obvious user benefit. No decorative AI, provider key, or Azure endpoint is
present.

## What would make this perfect

Nothing remains to change within the brief and review checklist. Preserve the
current claim manifest, clean-demo isolation tests, route crawl, accessibility
scan, and mobile first-viewport assertions as release gates.
