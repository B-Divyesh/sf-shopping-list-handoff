# Shopping List Handoff — verification 3 handoff

## Status: FAIL — release blocked by claims compliance

**Tested candidate:** `13450d2185a367fda112bc13f3219eb239657c3e`

**Tested deployment:** <https://shopping-list-handoff.sociobot.in>

**Report:** `.factory/verification-3.md`

No product code was changed during this independent verification.

## What passed

- Clean `npm ci`, lint, typecheck, production build, and all 26 Playwright tests passed. All 13 exact claim-test commands pass from the demo entry point.
- The live deploy byte-matches the candidate's public artifacts.
- First-read/demo, normal and recovery handoff flows, 390 px/mobile and keyboard use, reduced motion, axe serious/critical scans, privacy request logging, service-worker offline reload/update, response headers, cache policy, and bundle budgets passed.
- Live Lighthouse mobile `/demo` recorded 100/100/100/100 (performance/accessibility/best-practices/SEO); the final screenshot stage crashed Chromium after results had been written.

## Release-blocking defect (High)

The UI claims **“FREE”** and Terms calls it a **“free local utility,”** but `.factory/claims.json` has no price/free claim and no observable tagged test. The factory claims contract says this is a release blocker.

## Next step

Remove/narrow the price promise or add a `free-use` claim with an isolated demo test proving the end-to-end handoff has no payment/account gate. Re-run all declared claim commands and independent QA before release.
