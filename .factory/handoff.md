# Shopping List Handoff — review 1 handoff

## Status: FAIL

This reviewer made no product-code changes. The complete adversarial report is `.factory/review-1.md`.

## What was verified

- Fresh live desktop and 390 px mobile first-read checks pass.
- The one-click `/demo` shows a ready six-item handoff, persistent sandbox banner, Reset, and Start for real. A real list remained unchanged through demo entry, reset, and exit; the demo key was discarded on exit.
- Every one of the 14 exact claims commands passed independently; `npm run typecheck`, `npm run lint`, `npm test` (28/28), and `npm run build` pass.
- Live request logging showed same-origin, bodyless static GETs only. Routing, metadata, link crawl, Privacy/Terms, 404, and the product-specific visual system pass review.

## Blocking gaps

Three visitor-facing promises have no matching claim entry and observable claim test: conversion of pasted ingredients to a card, compatibility with “any recipe app,” and clearing browser site data. Two minor plain-words labels also need removal or replacement. See F-1-1 through F-1-5 for exact quotes and repairs.

## Re-run

```sh
npm ci
npm test
npm run build
```

Then run every command in `.factory/claims.json` and repeat the complete fresh-context review after claims/copy fixes.
