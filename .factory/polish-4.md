# Polish 4 — cumulative zero-finding repair map

**Reviewed base:** `4e518294f2a3293167abe1b6f4b62a5b62dfc8c7`<br>
**Repair code:** `91a358125a8f9237866b52d89c601c35f0251343`<br>
**Deployment:** `048ca186-b7c3-4516-a9f2-2979f3ad8098` to
<https://shopping-list-handoff.sociobot.in>

All `review-*.md`, `polish-*.md`, and the earlier verification records were
re-read. The only open finding in review 4 was removed rather than expanded
into an untestable product promise. The 16-entry claims manifest remains
one-tag-per-id, and every exact manifest command passed from a clean clone.

## Earlier verification findings retained

| Finding id | Change retained | Evidence |
| --- | --- | --- |
| V1 QR recipient path | QR encodes a same-origin `/handoff#list=` recipient view; recipient checks do not persist. | `@claim:qr-recipient`, `@claim:qr-private`, `@claim:recipient-checkable`; [recipient mobile screenshot](qa-evidence/polish-4/live/recipient-mobile-390.png); live [product check](qa-evidence/polish-4/live/live-product-check.json). |
| V1 real 404 | SWA rewrites unknown paths to the designed static 404 while preserving HTTP 404. | `unknown paths return the designed HTTP 404`; [live 404 screenshot](qa-evidence/polish-4/live/404-mobile-390.png); live `/missing-polish-4` is 404 in the product check. |
| V1 negative quantities | Pasted and manual negative amounts show announced corrections and never persist. | `negative quantities are rejected with announced corrections`; clean-clone full suite. |
| V1 focus and touch targets | Skip link, 44 px controls, and the custom checkbox focus ring remain keyboard-operable. | `mobile controls meet target size and checklist focus is visible`; clean-clone full suite. |
| V1 service-worker updates | The generated revisioned service worker precaches the shell and deletes stale caches. | `a new service-worker revision replaces the offline shell`; [live offline result](qa-evidence/polish-4/live-offline.json). |
| V2 checked-item recovery | Checked items can be shown, unchecked, and returned to every export with focus recovery. | `checked items can be restored and return to every handoff export`; clean-clone full suite. |
| V2 claims coverage | The manifest has 16 ids, each occurring once in the browser suite; every exact command passed. | `npm test -- --grep @claim:<id>` for all 16 ids; tag audit in the clean clone. |
| V2 empty QR | An empty list gives an actionable sender-side recovery message. | `empty lists cannot create a broken QR handoff`; clean-clone full suite. |
| V2 count-unit merge | Equal count units merge and still show the review warning. | `@claim:quantity-normalization`; clean-clone claim gate. |
| V2 overflow | Non-finite and impractical quantities are rejected before storage or export. | `rejects an overflowing amount before it can be saved`; clean-clone full suite. |
| V2 blank name | A blank item name receives a visible, announced error and focus returns to the field. | `blank item names get a visible announced error`; clean-clone full suite. |
| V2 route history | Real paths, heading announcement, focus, and scroll-coordinate restoration remain in place. | `routes announce their heading and restore focus with browser history`; clean-clone full suite. |
| V2 200% reflow | The layout retains one horizontal axis at 390 px with 200% text. | `mobile reflows at 200 percent text size and keeps all footer links touch-sized`; [live demo mobile screenshot](qa-evidence/polish-4/live-demo/screenshot-mobile.png). |
| V2 footer target / first fold | Footer links are touch-sized and all three landing facts fit in the first mobile view. | `the first mobile screen includes all three plain-language facts`; [live landing mobile screenshot](qa-evidence/polish-4/live-root/screenshot-mobile.png). |
| V2 returning-user feedback | Exiting demo accurately reports and restores a saved real list. | `start for real accurately acknowledges a saved real list`; clean-clone full suite. |
| V3 free-use promise | The free/no-payment/no-account promise remains a declared, observable claim. | `@claim:free-use`; clean-clone claim gate. |
| V4 printed note | Print media includes the shopper note. | `@claim:print-sheet`; clean-clone claim gate. |
| V4 destructive removal | Removing an item is undoable, announced, persistent, and focus-safe. | `removing an item is undoable, announced, persisted, and returns keyboard focus`; clean-clone full suite. |
| V4 404 shell / metadata | The styled 404 retains shell, title, metadata, icons, and a route home. | `unknown paths return the designed HTTP 404`; [live 404 screenshot](qa-evidence/polish-4/live/404-mobile-390.png). |

## Adversarial review findings

| Finding id | Change made | Evidence |
| --- | --- | --- |
| F-1-1 | Kept the specific **“Pasted ingredients become a handoff card”** claim and its concrete conversion test. | `@claim:pasted-ingredients-to-card`; [live landing screenshot](qa-evidence/polish-4/live-root/screenshot-mobile.png). |
| F-1-2 | Kept the unsupported universal recipe-app compatibility claim out of all product copy. | `.factory/copy-audit.md`; cold live `/` check in [product check](qa-evidence/polish-4/live/live-product-check.json). |
| F-1-3 | Kept the declared browser-site-data clearing claim and actual storage-clearing test. | `@claim:site-data-clear`; clean-clone claim gate. |
| F-1-4 | Kept decorative hero serial text removed. | `.factory/copy-audit.md`; [live landing screenshot](qa-evidence/polish-4/live-root/screenshot-mobile.png). |
| F-1-5 | Kept the abstract privacy serial marker removed. | `.factory/copy-audit.md`; cold live `/privacy` route check. |
| F-2-1 | Kept the direct instruction **“Paste one ingredient per line.”** | `.factory/copy-audit.md`; [live landing screenshot](qa-evidence/polish-4/live-root/screenshot-mobile.png). |
| F-2-2 | Kept visible **“Print shopping list”** button text, with its shortcut only as decoration. | `@claim:print-sheet`; [live demo screenshot](qa-evidence/polish-4/live-demo/screenshot-mobile.png). |
| F-2-3 | Kept **handoff card** as the single result term. | `@claim:pasted-ingredients-to-card`; `.factory/copy-audit.md`. |
| F-2-4 | Kept per-route title, description, canonical, Open Graph, Twitter, and static-404 icon metadata. | `routes set their own title, canonical URL, and share metadata`; all live routes in [product check](qa-evidence/polish-4/live/live-product-check.json). |
| F-3-1 | `/demo` and `?demo=1` start with the banner, demo h1, sample card, and rows in the first mobile viewport. | `@claim:sample-demo`; [direct-demo screenshot](qa-evidence/polish-4/live/direct-demo-mobile-390.png); live `/?demo=1` check. |
| F-3-2 | Kept the audience sentence specific to cooks handing a list to a shopper, without predicting shopper behaviour. | `.factory/copy-audit.md`; [live landing screenshot](qa-evidence/polish-4/live-root/screenshot-mobile.png). |
| F-3-3 | Kept undefined quality wording out of the README audience sentence. | `.factory/copy-audit.md`; README review. |
| F-3-4 | Kept the README explanation of the `#` part of the link in plain words. | `.factory/copy-audit.md`; `@claim:qr-private`. |
| F-3-5 | Kept **local handoff file** as the sole file-export term. | `.factory/copy-audit.md`; `@claim:local-file-private`. |
| F-3-6 | Kept demo isolation explained as separate data, not as storage-key jargon. | `.factory/copy-audit.md`; `@claim:local-only`. |
| F-3-7 | Kept the expanded wordmark and removed serial labels across landing, legal, and 404 routes. | `.factory/copy-audit.md`; [live 404 screenshot](qa-evidence/polish-4/live/404-mobile-390.png). |
| F-3-8 | Kept the literal 404 heading **“This page was not found.”** | `unknown paths return the designed HTTP 404`; [live 404 screenshot](qa-evidence/polish-4/live/404-mobile-390.png). |
| F-3-9 | Kept history scroll restoration with heading focus and live announcement. | `routes announce their heading and restore focus with browser history`; clean-clone full suite. |
| F-3-10 | Kept literal, product-specific Privacy and Terms h1s. | `routes set their own title, canonical URL, and share metadata`; live `/privacy` and `/terms` checks. |
| F-3-11 | Kept readable cooking units when unmerged and practical units when compatible values merge. | `@claim:quantity-normalization`; clean-clone claim gate. |
| F-4-1 | Deleted **“The tool does not place orders, contact retailers, or provide live collaboration.”** instead of making three unverifiable promises. Terms now contains only the declared free-use statement, a direct instruction, and its legal limitation. | `terms use bounded legal copy without unlisted system-behavior promises`; [live Terms mobile screenshot](qa-evidence/polish-4/live-terms/screenshot-mobile.png); cold live `/terms` check in [product check](qa-evidence/polish-4/live/live-product-check.json). |

## Verification

- Clean clone at `91a358125a8f9237866b52d89c601c35f0251343`:
  `npm ci`, `npm run lint`, `npm run typecheck`, `npm test -- --reporter=list`
  (**33 passed**), and `npm run build` all passed.
- Every exact `test` command in `.factory/claims.json` passed independently:
  16 claims, 16 passing runs, and one `@claim:<id>` occurrence for every id.
- `verify-url.sh` passed locally for `/demo` and `/terms`, and cold on live
  `/`, `/demo`, and `/terms`. Evidence is under
  `qa-evidence/polish-4/local-*` and `qa-evidence/polish-4/live-*`.
- The full Playwright suite covers browser flows, keyboard/mobile reflow,
  print, privacy request logging, local storage, service-worker replacement,
  offline reload, routing, real 404, and axe WCAG 2 A/AA scans.
- Lighthouse on the deployed `/demo`: **100 performance, 98 accessibility,
  100 best practices, 100 SEO**, LCP **946 ms**, CLS **0**, TBT **22 ms**.
  See [live-lighthouse.json](qa-evidence/polish-4/live-lighthouse.json).
- Cold live audit covered `/`, `/demo`, `/?demo=1`, `/privacy`, `/terms`,
  `/handoff`, and an HTTP 404. Each had one h1/main, the expected title and
  canonical URL, no console errors, and no serious/critical axe finding. It
  also proved demo-only storage, recipient no-storage, same-origin GET-only
  requests, and the Terms removal. See
  [live-product-check.json](qa-evidence/polish-4/live/live-product-check.json).
- A cold live `/demo` service-worker reload succeeded offline; see
  [live-offline.json](qa-evidence/polish-4/live-offline.json).

No unresolved finding or known functional gap remains.
