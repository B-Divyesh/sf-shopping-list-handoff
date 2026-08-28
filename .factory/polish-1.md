# Polish 1 — cumulative review repair map

**Base reviewed:** `4050e39013f02032b4ffbea9fac58bd35079f4da`  
**Candidate repaired:** recorded in the final handoff after commit and deployment.

All earlier verification reports and the adversarial review were read. Earlier
repairs remain in the product and are re-executed by the current suite; the
latest report’s open findings are repaired in this round.

| Finding | Change made | Evidence |
| --- | --- | --- |
| V1 QR recipient path | Encoded a privacy-safe `/handoff#list=` URL and built a checkable receiver view. | `@claim:qr-recipient`, `@claim:qr-private`, `@claim:recipient-checkable`; local `/handoff` check. |
| V1 real 404 | Configured explicit app rewrites and a styled HTTP 404 with shell and metadata. | `unknown paths return the designed HTTP 404`; local `/missing-release-check`. |
| V1 negative quantities | Rejects invalid quick-add and pasted amounts with announced corrections. | `negative quantities are rejected with announced corrections`. |
| V1 focus and touch targets | Added designed checklist focus, 44 px controls, skip target, and mobile assertions. | `mobile controls meet target size and checklist focus is visible`. |
| V1 service-worker updates | Versions and precaches the generated shell, deleting stale caches. | `a new service-worker revision replaces the offline shell`. |
| V2 checked-item recovery | Added Show checked items, keyboard restoration, focus recovery, and restored exports. | `checked items can be restored and return to every handoff export`. |
| V2 claim coverage | Added focused claim entries/tests for print, local-file round trip, recipient checks, quantities, privacy, free use, conversion, and cleared site data. | Every command in `.factory/claims.json`; tag-count audit reports 16/16 once. |
| V2 empty QR | Sender now receives “Add an item first” without creating a broken recipient link. | `empty lists cannot create a broken QR handoff`. |
| V2 count-unit merge | Canonicalizes plural count units and combines equal named count units. | `@claim:quantity-normalization`. |
| V2 overflow | Rejects non-finite and impractical amounts before persistence, export, or import. | `rejects an overflowing amount before it can be saved`. |
| V2 blank name | Shows an associated, live-announced name error and returns focus to the field. | `blank item names get a visible announced error`. |
| V2 route history | Uses real paths, fixes off-home How-it-works links, announces route headings, and restores focus on Back. | `routes announce their heading and restore focus with browser history`. |
| V2 200% reflow | Wraps/stacks header, cards, forms, and exports without horizontal overflow. | `mobile reflows at 200 percent text size and keeps all footer links touch-sized`. |
| V2 footer target and first fold | Makes footer links 44 px and keeps all three facts in the 390 px first view. | `mobile reflows…`; `the first mobile screen includes all three plain-language facts`. |
| V2 returning-user feedback | Start-for-real now accurately says a saved real list is ready. | `start for real accurately acknowledges a saved real list`. |
| V3 free-use promise | Added `free-use` claim and a no-account/no-payment demo-and-recipient test. | `@claim:free-use`. |
| V4 printed note | Renders a readable static shopper note under print media. | `@claim:print-sheet`. |
| V4 destructive removal | Added an announced Undo control, persistence, and predictable focus recovery. | `removing an item is undoable, announced, persisted, and returns keyboard focus`. |
| V4 404 shell/metadata | Added header, nav, footer, title, description, canonical and route-home to the designed 404. | `unknown paths return the designed HTTP 404`. |
| F-1-1 blocking conversion claim | Rewrote “Recipe details” to “Pasted ingredients become a shopping card” in the UI and README; added a clean-demo claim test for quantities and names. | `@claim:pasted-ingredients-to-card`; screenshot/live URL recorded in final handoff. |
| F-1-2 blocking broad compatibility | Replaced “any recipe app” with “Paste ingredient lines into the list.” | Source copy audit; local and live `/#how` check. |
| F-1-3 blocking site-data deletion | Added `site-data-clear`, which creates both namespaces, clears browser storage, reloads, and proves neither list is readable. | `@claim:site-data-clear`. |
| F-1-4 minor decorative hero label | Removed “HANDOFF SHEET / 01” from the first screen. | Source copy audit; landing screenshot/live check. |
| F-1-5 minor abstract privacy label | Removed “04 / BOUNDARIES”; the meaningful privacy heading remains. | Source copy audit; landing screenshot/live check. |

## Screenshots and URLs

Current evidence is
`qa-evidence/polish-1/landing-mobile-390.png`,
`qa-evidence/polish-1/demo-mobile-390.png`, and
`qa-evidence/polish-1/404-mobile-390.png`. Cold live checks passed at
`https://shopping-list-handoff.sociobot.in` after deployment; their matching
screenshots are under `qa-evidence/polish-1/live/`. The live page serves
`assets/index-qAET-YQJ.js`, includes the two rewritten phrases, and does not
include either removed label. The test suite also covers the 390 px first
screen, 200% text reflow, receiver view, legal routes, and 404.
