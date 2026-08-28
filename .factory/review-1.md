# Adversarial first-read review 1 — FAIL

**Reviewed:** 2026-08-28  
**Live URL:** <https://shopping-list-handoff.sociobot.in>  
**Contexts:** fresh Chromium at 390 × 844 and 1440 × 900

## Verdict: FAIL

The first screen is clear and the demo works, but three visitor-facing promises have no matching entry and observable test in `.factory/claims.json`. The claims contract makes these blocking. Two decorative labels also fail the plain-words standard.

## Cold first read

Before scrolling, I understood: this turns pasted ingredients into a shopping list for another person. It is for cooks whose shopper does not use their meal-planning app. I should click **Try it with sample data**; adjacent copy says **“Opens a ready-to-send pasta list.”** This passes at mobile and desktop: the headline, audience, action, outcome, and all three facts fit the first 390 px viewport.

## Findings

### F-1-1 — BLOCKING — core conversion promise has no matching claim

**Location / quote:** Landing caption: “Recipe details become a plain shopping card.” README opening: “Turn pasted recipe ingredients into a clear shopping list for someone who does not use your meal-planning app.”

**Why:** The UI accepts pasted ingredient lines, not general “recipe details.” Neither promise has a claim entry. `plain-text-export` proves copying a prepared list and `quantity-normalization` proves a narrow aggregation case; neither declares or tests the customer-facing conversion.

**Fix:** Use **“Pasted ingredients become a shopping card.”** Add `pasted-ingredients-to-card` and one clean-demo tagged test that pastes realistic lines and asserts their named items and quantities appear on the handoff card. Or remove both promises.

### F-1-2 — BLOCKING — universal recipe-app compatibility is unlisted

**Location / quote:** Landing How it works: “Add ingredient lines from any recipe app.”

**Why:** “Any recipe app” is a universal compatibility promise. No claim entry or test covers copied content from different recipe-app formats; current tests only demonstrate the product's own plain-line textarea input.

**Fix:** Replace with **“Paste ingredient lines into the list.”** If broad source compatibility is intentional, name supported formats and test each one.

### F-1-3 — BLOCKING — site-data deletion promise is unlisted

**Location / quote:** README, Privacy and limits: “Clearing browser site data clears them.”

**Why:** This data-retention promise has no claim entry. `local-only` checks that a fresh demo key is separate from a real key; it does not clear site storage or observe the resulting empty state.

**Fix:** Add `site-data-clear` and a test that creates both namespaces, clears site storage, reloads, and proves no prior list is readable. Or delete the sentence.

### F-1-4 — MINOR — decorative hero label does not help a cold visitor

**Location / quote:** “HANDOFF SHEET / 01” above the landing h1.

**Why:** It is a serial-style decorative label, neither a section name nor an instruction. It uses prominent first-screen space for brand lore, contrary to the plain-words rule.

**Fix:** Remove it; the h1 already names the job.

### F-1-5 — MINOR — abstract section marker is not useful out of context

**Location / quote:** “04 / BOUNDARIES” above the privacy section.

**Why:** “Boundaries” does not name the section for a screen-reader heading list or skim reader. The real heading below supplies the useful meaning.

**Fix:** Remove it, or replace it with **“Privacy”** without a serial number.

## Copy audit

Counts strip punctuation and code formatting. Navigation, controls, headings, and sample dynamic text are included. No item exceeds 22 words. The only flags are F-1-1 through F-1-5.

### Landing

| Copy | Words | Audit |
| --- | ---: | --- |
| Skip to list; SLH 01; Demo; How it works; Privacy | 3; 2; 1; 3; 1 | Pass / wordmark |
| HANDOFF SHEET / 01 | 3 | F-1-4 |
| Hand off a clear shopping list | 6 | Pass |
| For cooks who need someone outside their app to shop without questions. | 12 | Pass |
| Try it with sample data; Opens a ready-to-send pasta list. | 5; 5 | Pass |
| LOCAL — Stored in this browser; OFFLINE — Works after first visit; FREE — No account needed | 5; 5; 4 | local-only; offline-reload; free-use/no-account |
| Recipe details become a plain shopping card. | 7 | F-1-1 |
| 02 / MAKE THE LIST; Paste ingredients or start a list | 4; 6 | Pass |
| One ingredient per line works best. We keep uncertain quantities visible. | 6; 5 | Pass; quantity-normalization |
| Ingredient source; Paste ingredients; Add ingredients; Clear list | 2; 2; 2; 2 | Pass |
| Add one item; Amount; Unit; Item; Add item | 3; 1; 1; 1; 2 | Pass |
| Or open a local handoff file; Saved only in this browser. | 6; 5 | Pass; local-only |
| SHOPPER COPY; 0 items · 0 left; Print shopping list | 2; 4; 3 | Pass / dynamic |
| Your handoff card will appear here. Paste ingredients or add an item above. | 6; 7 | Pass |
| Note for the shopper (not in QR) | 7 | qr-private |
| Copy plain text; Make QR code; Save local file | 3; 3; 3 | declared export/QR claims |
| 03 / HOW IT WORKS; Make a list someone can use; Paste | 4; 6; 1 | Pass |
| Add ingredient lines from any recipe app. | 7 | F-1-2 |
| Check; Review units and produce counts before sending. | 1; 7 | Pass; quantity-normalization |
| Hand off; Print, copy, scan, or save a local file. | 2; 8 | Pass; declared export claims |
| 04 / BOUNDARIES | 2 | F-1-5 |
| Your list stays on this device | 6 | local-data-private |
| There are no accounts or cloud lists. | 7 | no-account/local-data-private |
| QR codes contain only item names and quantities. Notes never go into a QR code. | 8; 7 | qr-private |
| Clear lists for people outside your app. Privacy; Terms; Built by Param Factory; v1.0.0 | 7; 1; 1; 4; 1 | Pass / footer |

### README

| Copy | Words | Audit |
| --- | ---: | --- |
| Shopping List Handoff | 3 | Product name |
| Turn pasted recipe ingredients into a clear shopping list for someone who does not use your meal-planning app. | 18 | F-1-1 |
| It is for household cooks who need to hand a precise list to another shopper. | 15 | Audience |
| Paste ingredient lines and check the quantities. | 7 | Instruction |
| Then print, copy, make a QR code, or save a local handoff file. | 13 | declared export/QR claims |
| The QR code opens a list in a browser. | 9 | qr-recipient |
| The working list stays in your browser. No account is needed. | 7; 5 | local-only; no-account |
| Paste one ingredient per line, such as `500 g spaghetti` or `1 lemon`. | 13 | Instruction |
| Check the handoff card, especially count-based produce and packs. | 9 | Instruction |
| Use Copy plain text, Make QR code, Save local file, or print. | 12 | Instruction |
| Compatible metric and volume quantities combine into one line. | 9 | quantity-normalization |
| Equal count units, such as two bunches of basil, combine too. | 10 | quantity-normalization |
| Counts and unmeasured items stay visible with a review warning rather than guessing a size. | 15 | quantity-normalization |
| Scanning a QR code opens a readable list in the browser. | 10 | qr-recipient |
| The item data stays in the URL fragment, which is not sent to the server. | 14 | qr-private/local-data-private |
| QR codes exclude the list title and shopper note. | 9 | qr-private |
| The local JSON handoff file excludes the note too. | 9 | local-file-private |
| Try the isolated demo at `/demo` or use Try it with sample data. | 13 | sample-demo/local-only |
| Demo data uses a different browser-storage key from real lists. | 10 | local-only |
| The app works offline after the first visit. | 8 | offline-reload |
| `npm run build` writes the static deployment output to `dist/`, with `dist/index.html` at its root. | 17 | Developer instruction |
| Deploy that directory to Azure Static Web Apps. | 8 | Developer instruction |
| No list data is sent to a server. | 8 | local-data-private |
| The browser stores real lists under `slh:real:list` and the demo under `slh:demo:list`. | 14 | local-only |
| Clearing browser site data clears them. | 6 | F-1-3 |
| Read the in-product Privacy and Terms pages for details. | 9 | Pass |
| The blueprint illustration is original, generated factory artwork. | 7 | Provenance note |
| Its prompt and provenance are recorded in `.factory/design.md`. | 9 | Repository fact |
| Claim coverage is listed in `.factory/claims.json`; demo behavior is documented in `.factory/demo.md`. | 14 | Repository fact |

Terminology is consistent: **ingredient**, **handoff card**, **shopper**, **shopper note**, **local handoff file**, and **QR code** each retain one meaning across landing and README.

## Demo, sandbox, claims, and privacy

The one-click demo passes: `/demo` has a ready six-item Wednesday pasta night card, **“Demo — sample data, nothing is saved.”**, **Reset demo**, and **Start for real**. I created a real “real oats” list, entered demo, reset it, and started for real. The real JSON was unchanged during demo; exiting removed `slh:demo:list` while retaining `slh:real:list`. Source inspection confirms separate namespaces.

All 14 exact `.factory/claims.json` commands passed independently after `npm ci`: `sample-demo`, `no-account`, `free-use`, `plain-text-export`, `local-file-private`, `local-file-roundtrip`, `print-sheet`, `qr-recipient`, `qr-private`, `recipient-checkable`, `quantity-normalization`, `local-only`, `local-data-private`, and `offline-reload`. `npm run typecheck`, `npm run lint`, `npm test` (**28/28**), and `npm run build` pass; `dist/` is produced. Initial JS is 18.38 KB gzip and CSS is 3.80 KB gzip.

Live populated-demo request logging showed only same-origin static GETs, with no request body, list title, note, or QR fragment. No external scripts, fonts, analytics, or AI calls were observed. The offline claim test passes. Listed claims passing does not cure F-1-1 through F-1-3.

## Structure, history, and missed leverage

The blueprint drafting visual system is product-specific, not a generic SaaS template. Header/footer, skip link, focus-on-route-change, Back handling, reduced motion, Privacy/Terms, canonical/OG/favicon, designed HTTP 404, and all discovered links work. Valid routes returned 200; the unknown route returned a styled 404. Each reviewed route had one h1, one main, title, description, and canonical. The expected browser error for deliberately opening the 404 was not counted as an application error.

No earlier `.factory/review-*.md` or `.factory/polish-*.md` exists. The earlier handoff reports print, undo, and 404 repairs; each is confirmed live and in source/tests: print includes the shopper note, removal is undoable with focus recovery, and the 404 has shell, metadata, and a route home. No earlier finding is re-opened.

The brief implies private handoff plus import/export, all present through local file, plain text, print, and QR. AI would add no obvious value to this deterministic local task and is not expected.

## What would make this perfect

Claim-test or remove the three remaining promises, remove or replace the two decorative labels, then rerun the complete fresh-context review. That would make the product immediately usable and contractually honest.
