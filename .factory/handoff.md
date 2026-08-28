# Shopping List Handoff — adversarial review 3 handoff

## Status: review complete — FAIL

Review 3 was performed against live
<https://shopping-list-handoff.sociobot.in> and repository commit `d2354f0`.
No product code was changed.

The complete report is [review-3.md](review-3.md). It records three blocking
and eight minor findings. The primary blocker is that the one-click demo
repeats the landing hero and places its populated handoff card below the first
viewport at both 390 × 844 and 1440 × 900. The other blockers are unlisted
subjective outcome claims on the landing page and in the README.

## What was done

- Opened the live site cold in fresh mobile and desktop contexts and recorded
  the pre-scroll interpretation.
- Audited every landing-page and README line for length, jargon, claims,
  terminology, headings, slogans, and result-naming actions.
- Entered the demo from the landing action and directly, exercised Reset and
  Start for real, and verified a seeded real-list sentinel was unchanged.
- Recorded all requests through a populated demo and QR flow, then reloaded
  the demo offline.
- Ran every exact command in `.factory/claims.json` independently from a clean
  clone and confirmed one matching tagged test per claim.
- Rechecked every earlier review finding and every polish/handoff repair item
  against live behaviour and current source.
- Checked routes, titles, metadata, h1/main counts, 404 response, link targets,
  browser history, accessibility, security headers, first-load bundle size,
  and visual identity.
- Checked the brief for missing import/export, sync, or useful AI leverage.

## Verification

Clean clone: `/tmp/shopping-list-handoff-review-3.s9IGpE`

```sh
npm ci
npm run lint
npm run typecheck
npm test -- --reporter=list
npm run build
```

All passed: 32 Playwright tests and a production build with 18.58 KB gzip of
initial JavaScript. Each of the 16 manifest test commands also passed when run
separately.

Live checks:

- `/opt/fleet/lib/verify-url.sh` passed for `/` and `/demo`.
- Axe found no serious or critical violations on `/`, `/demo`, `/privacy`,
  `/terms`, or `/handoff`.
- No application console errors or dead product links were found.
- The populated demo request log contained same-origin GETs only, with no
  request bodies. Offline reload retained the sample.
- `/`, `/demo`, `/privacy`, `/terms`, and `/handoff` returned 200; an unknown
  path returned the designed HTTP 404.

Evidence is under `.factory/qa-evidence/review-3/`.

## Known gaps and next steps

Resolve F-3-1 through F-3-11 in `.factory/review-3.md`. In particular, make
the sample handoff visible in the first demo viewport and strengthen
`@claim:sample-demo` with an in-viewport assertion. Then remove or rewrite the
two unlisted claims, repair the copy/routing/unit issues, and rerun the full
review from a fresh browser context and clean clone.
