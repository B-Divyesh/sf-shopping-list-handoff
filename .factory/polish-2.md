# Polish 2 — cumulative review repair map

**Base:** `fd0e976241c01c6c6eba4d67b1fc5c0f9622928e`  
**Review:** `a54d1c790a71b5639c6f992b7574706172218041`

All review, verification, and prior-polish records were read. The earlier
repairs remain in the shipped code and are covered by the regression suite.
This round closes every remaining review-2 finding and adds checks for the
direct demo URL and route share metadata.

| Finding id | Change made | Evidence |
| --- | --- | --- |
| V1 QR recipient path | Privacy-safe recipient handoff remains a real `/handoff#list=` view with checkboxes. | `@claim:qr-recipient`, `@claim:qr-private`, `@claim:recipient-checkable`; `tests/app.spec.ts` full suite. |
| V1 real 404 | Explicit SWA 404 rewrite and the blueprint-styled 404 remain in place. | `unknown paths return the designed HTTP 404`; local `public/404.html` route check. |
| V1 negative quantities | Rejects invalid pasted and quick-add quantities with associated live errors. | `negative quantities are rejected with announced corrections`. |
| V1 focus and touch targets | Skip/focus treatment, 44px controls, and checklist focus ring remain. | `mobile controls meet target size and checklist focus is visible`. |
| V1 service-worker updates | Versioned shell precache continues to replace stale caches. | `a new service-worker revision replaces the offline shell`. |
| V2 checked-item recovery | Checked items remain restorable with keyboard focus recovery. | `checked items can be restored and return to every handoff export`. |
| V2 claim coverage | Manifest has 16 claims, each with one exact tag, and every manifest command passes independently. | `.factory/qa-evidence/polish-2/claims/*.txt`; tag-count audit. |
| V2 empty QR | Empty QR creation gives a recovery message rather than a dead link. | `empty lists cannot create a broken QR handoff`. |
| V2 count-unit merge | Canonical count units combine while uncertain counts retain a warning. | `@claim:quantity-normalization`. |
| V2 overflow | Non-finite/impractical amounts are rejected before persistence or import. | `rejects an overflowing amount before it can be saved`. |
| V2 blank name | Blank quick-add names receive a named, announced error and focus. | `blank item names get a visible announced error`. |
| V2 route history | Real routes retain heading announcement and Back-focus behavior. | `routes announce their heading and restore focus with browser history`. |
| V2 200% reflow | Mobile layout keeps a single scroll axis at 200% text size. | `mobile reflows at 200 percent text size and keeps all footer links touch-sized`. |
| V2 footer target and first fold | Footer targets and three first-screen facts remain touch-sized/visible. | `mobile reflows…`; `the first mobile screen includes all three plain-language facts`. |
| V2 returning-user feedback | Leaving demo accurately distinguishes a saved real list. | `start for real accurately acknowledges a saved real list`. |
| V3 free-use promise | The tested free/no-gate claim remains declared. | `@claim:free-use`. |
| V4 printed note | Print media retains the shopper note. | `@claim:print-sheet`. |
| V4 destructive removal | Removing an item remains undoable, announced, persistent, and focus-safe. | `removing an item is undoable, announced, persisted, and returns keyboard focus`. |
| V4 404 shell/metadata basics | 404 retains header, footer, title, description, canonical, and home link. | `unknown paths return the designed HTTP 404`. |
| F-1-1 | Kept the corrected pasted-ingredients conversion copy and its declared handoff-card claim. | `@claim:pasted-ingredients-to-card`. |
| F-1-2 | Kept the unsupported universal recipe-app compatibility promise out of product copy. | `.factory/copy-audit.md`; landing check. |
| F-1-3 | Kept the declared browser-site-data clearing claim and real storage-clearing test. | `@claim:site-data-clear`. |
| F-1-4 | Kept the decorative first-screen serial label removed. | `.factory/copy-audit.md`; landing screenshot. |
| F-1-5 | Kept the abstract privacy serial marker removed. | `.factory/copy-audit.md`; landing screenshot. |
| F-2-1 | Replaced “One ingredient per line works best.” with the direct instruction “Paste one ingredient per line.” | `.factory/copy-audit.md`; [`live-root/screenshot-mobile.png`](qa-evidence/polish-2/live-root/screenshot-mobile.png); cold live `/`. |
| F-2-2 | Replaced the symbol-only print button with visible “Print shopping list” plus a decorative shortcut. | `@claim:print-sheet`; [`live-demo/screenshot-mobile.png`](qa-evidence/polish-2/live-demo/screenshot-mobile.png); cold live `/demo`. |
| F-2-3 | Standardized the product result as “handoff card” in hero copy and the conversion claim. | `@claim:pasted-ingredients-to-card`; `.factory/copy-audit.md`; [`live-root/screenshot-desktop.png`](qa-evidence/polish-2/live-root/screenshot-desktop.png); cold live `/`. |
| F-2-4 | Route render now updates description, canonical, Open Graph, and Twitter title/description. The static 404 now includes favicon, Apple icon, Open Graph, and Twitter metadata. | `routes set their own title, canonical URL, and share metadata`; `unknown paths return the designed HTTP 404`; [`live-route-check.json`](qa-evidence/polish-2/live-route-check.json), [`live-404-mobile-390.png`](qa-evidence/polish-2/live-404-mobile-390.png); live `/privacy`, `/terms`, `/demo`, `/handoff`, `/missing-polish-2`. |

## Evidence

- Clean dependency install: `npm ci`.
- Static checks: `npm run lint`, `npm run typecheck`, and `npm run build` pass.
- Browser suite: `npm test -- --reporter=list` passes all 32 tests, including
  accessibility, privacy, offline, mobile, routing, and print regressions.
- Every exact command in `.factory/claims.json` passes independently; output
  is retained under `.factory/qa-evidence/polish-2/claims/`.
- Local cold-browser checks: `verify-url.sh` passed for `/` and `/demo` with no
  console errors, one h1, one main landmark, language, title, and image-alt
  checks. Screenshots and reports are under
  `.factory/qa-evidence/polish-2/local-root/` and `local-demo/`.
- Cold live checks passed after deployment: all six routes in
  [`live-route-check.json`](qa-evidence/polish-2/live-route-check.json) have
  the expected unique title, description, OG/Twitter metadata, one h1, one
  main, no console errors, and no serious/critical axe findings. `/missing-polish-2`
  returned HTTP 404. The direct live `/?demo=1` check found the banner, Reset
  demo, Start for real, sample spaghetti, the Demo title, and `/demo` canonical.
