# Polish 3 — cumulative zero-finding repair map

Base review: `ffa605c3ba05c3261c07e186e149c8d78906effa`.

All earlier review and polish records were read before this repair. Evidence
paths are relative to `.factory/qa-evidence/polish-3/`. Every listed claim was
run independently from a clean clone; `clean-clone/claims/` contains one
passing transcript per id and `claims-tag-audit.txt` records exactly one
`@claim:` tag per manifest id.

## Earlier verification repairs retained

| Finding id | Change made | Evidence |
| --- | --- | --- |
| V1 QR recipient path | Retained the privacy-safe `/handoff#list=` recipient view with keyboard checkboxes and no recipient storage. | `@claim:qr-recipient`, `@claim:qr-private`, `@claim:recipient-checkable`; clean-clone claim logs. |
| V1 real 404 | Retained explicit SWA 404 rewrite and the styled static error page. | `unknown paths return the designed HTTP 404`; `local/404-mobile-390.png`. |
| V1 negative quantities | Retained validation before a value can persist or export. | `negative quantities are rejected with announced corrections`. |
| V1 focus and touch targets | Retained skip link, designed checkbox focus, and 44 px mobile controls. | `mobile controls meet target size and checklist focus is visible`; `verify-local-demo/verify.json`. |
| V1 service-worker updates | Retained versioned precache replacement. | `a new service-worker revision replaces the offline shell`. |
| V2 checked-item recovery | Retained checked-item restore, keyboard focus recovery, and export inclusion. | `checked items can be restored and return to every handoff export`. |
| V2 claims coverage | Retained the manifest and added stronger demo/unit claim assertions. | `claims-tag-audit.txt`; all `clean-clone/claims/*.txt`. |
| V2 empty QR | Retained the recovery message instead of a broken link. | `empty lists cannot create a broken QR handoff`. |
| V2 count-unit merge | Retained canonical count-unit merging and review warning. | `@claim:quantity-normalization`. |
| V2 overflow | Retained finite-range validation for manual and imported values. | `rejects an overflowing amount before it can be saved`. |
| V2 blank name | Retained named, announced error and focus recovery. | `blank item names get a visible announced error`. |
| V2 route history | Added scroll-coordinate restoration in addition to prior route/focus recovery. | `routes announce their heading and restore focus with browser history`. |
| V2 200% reflow | Retained one-axis responsive reflow and footer target size. | `mobile reflows at 200 percent text size and keeps all footer links touch-sized`. |
| V2 footer target / first fold | Retained 44 px footer links and all three hero facts in the mobile first screen. | `the first mobile screen includes all three plain-language facts`. |
| V2 returning-user feedback | Retained accurate real-list return message. | `start for real accurately acknowledges a saved real list`. |
| V3 free-use promise | Retained the no-payment/no-account claim and recipient-flow check. | `@claim:free-use`; `clean-clone/claims/free-use.txt`. |
| V4 printed note | Retained printable static shopper note. | `@claim:print-sheet`; print-media assertion. |
| V4 destructive removal | Retained announced Undo, persistence, and focus recovery. | `removing an item is undoable, announced, persisted, and returns keyboard focus`. |
| V4 404 shell / metadata | Retained header, nav, footer, icons, title, canonical, and share metadata. | `unknown paths return the designed HTTP 404`; `local/404-mobile-390.png`. |

## Review 1 and 2 repairs retained

| Finding id | Change made | Evidence |
| --- | --- | --- |
| F-1-1 | Kept pasted-ingredients conversion wording and its declared handoff-card test. | `@claim:pasted-ingredients-to-card`; `clean-clone/claims/pasted-ingredients-to-card.txt`. |
| F-1-2 | Kept unsupported universal recipe-app compatibility wording out of product copy. | `copy-audit.md`; local landing check. |
| F-1-3 | Kept the browser-site-data clearing claim and storage-clearing test. | `@claim:site-data-clear`; clean-clone claim log. |
| F-1-4 | Kept the decorative hero serial removed. | `copy-audit.md`; `local/landing-mobile-390.png`. |
| F-1-5 | Kept the abstract privacy serial removed. | `copy-audit.md`; local route checks. |
| F-2-1 | Kept the direct “Paste one ingredient per line” instruction. | `copy-audit.md`; landing check. |
| F-2-2 | Kept visible “Print shopping list” text on the control. | `@claim:print-sheet`; demo screenshots. |
| F-2-3 | Kept “handoff card” as the result name. | `copy-audit.md`; `@claim:pasted-ingredients-to-card`. |
| F-2-4 | Kept route-specific title, description, canonical, OG, Twitter, favicon, and Apple icon metadata. | `routes set their own title, canonical URL, and share metadata`; 404 test. |

## Review 3 repairs

| Finding id | Change made | Evidence |
| --- | --- | --- |
| F-3-1 | `/demo` and `?demo=1` now render a demo-specific h1, banner, Reset, Start for real, and the seeded card before the builder. The landing action opens `/demo` in one click. | `one click opens an in-viewport sample handoff card without an account @claim:sample-demo`; `local/demo-mobile-390.png`, `local/demo-desktop-1440.png`. |
| F-3-2 | Rewrote the hero audience sentence to name cooks and shoppers without promising another person’s behaviour. | `copy-audit.md`; `local/landing-mobile-390.png`. |
| F-3-3 | Rewrote the README audience sentence without the undefined “precise” promise. | `copy-audit.md`; README review. |
| F-3-4 | Replaced “URL fragment” with a plain explanation of the `#` portion of a shared link. | README; `copy-audit.md`. |
| F-3-5 | Replaced “local JSON handoff file” with “local handoff file.” | README; `copy-audit.md`. |
| F-3-6 | Replaced browser-storage-key language with the result of demo isolation. | README and Privacy copy; `copy-audit.md`. |
| F-3-7 | Replaced `SLH 01` with the full wordmark and removed landing, legal, and 404 serial labels. | `copy-audit.md`; local landing, demo, and 404 screenshots. |
| F-3-8 | Replaced the blueprint-metaphor 404 h1 with “This page was not found.” | `unknown paths return the designed HTTP 404`; `local/404-mobile-390.png`. |
| F-3-9 | Stores scroll coordinates per history entry; Back focuses the h1 without scrolling it into view, then restores the saved position. | `routes announce their heading and restore focus with browser history`. |
| F-3-10 | Replaced slogan-like legal h1s with “How Shopping List Handoff stores data” and “Terms for Shopping List Handoff.” | route metadata/history test; `copy-audit.md`. |
| F-3-11 | Normalization preserves an entered unit when no merge occurs; mixed volume merges choose readable tsp/tbsp/cup measures and two-decimal precision. | `@claim:quantity-normalization`; clean-clone claim log. |

## Local evidence summary

- Clean clone: `clean-clone/full-gates.txt` records `npm ci`, lint, typecheck,
  32 Playwright tests, and build passing.
- Declared-claim gate: all 16 exact manifest commands passed; transcripts are
  in `clean-clone/claims/`.
- Basic browser verification: `verify-local-root/verify.json` and
  `verify-local-demo/verify.json` show title, `lang`, one h1, main landmark,
  zero missing alts, zero unnamed buttons, and no console errors.
- Axe WCAG 2 A/AA scan is part of `public routes have no serious accessibility
  violations or console errors`, covering `/`, `/demo`, `/privacy`, `/terms`,
  `/handoff`, and a real 404.
- Cold screenshot evidence: `local/landing-mobile-390.png`,
  `local/demo-mobile-390.png`, `local/demo-desktop-1440.png`, and
  `local/404-mobile-390.png`.

## Cold deployed URL checks

The deployed URL was opened in fresh Chromium contexts after Azure deployment
`8c3a40df-844c-4d75-8afd-5549b2a3b52b`. This check applies to every table row
above that is observable in the product:

- [Landing](https://shopping-list-handoff.sociobot.in/) has the rewritten
  audience sentence and current root metadata.
- [Demo](https://shopping-list-handoff.sociobot.in/demo) and
  [direct demo](https://shopping-list-handoff.sociobot.in/?demo=1) have the
  banner, Reset demo, Start for real, the demo h1, and two sample rows in the
  390 × 844 viewport.
- [Privacy](https://shopping-list-handoff.sociobot.in/privacy),
  [Terms](https://shopping-list-handoff.sociobot.in/terms), and a
  [missing page](https://shopping-list-handoff.sociobot.in/missing-polish-3)
  have the required literal headings and route metadata; the latter returns
  HTTP 404.
- `live-product-check.json`, `live-route-metadata.json`, `live-privacy.json`,
  `live-axe.json`, `verify-live-root.txt`, and `verify-live-demo.txt` record
  the cold checks. The live mobile screenshots are in `live-root/`,
  `live-demo/`, and `live-404/`.
