# Shopping List Handoff — review 2 handoff

## Status: FAIL

This reviewer work order did not modify product code. It added
`.factory/review-2.md`, committed below.

## What was verified

- Fresh live Chromium checks at 390 × 844 and 1440 × 900.
- Direct `/demo` isolation, Reset demo, Start for real, populated sample data,
  and outgoing-request logging.
- Clean-clone `npm ci`, lint, typecheck, 30-test Playwright suite, production
  build, and all 16 exact claim commands.
- Live routes, deep-link/back focus, HTTP 404, metadata, header/footer, and
  prior review findings.

## Remaining work

See `review-2.md`. Blocking F-2-1 is an unlisted claim:
“One ingredient per line works best.” Replace it with the direct instruction
or add a specific observable claim test. Minor findings cover the print
button's visible label, `shopping card`/`handoff card` terminology, and
incomplete per-route/404 metadata.

## How to verify after repair

```sh
npm ci
npm run lint
npm run typecheck
npm test
npm run build
```

Then run each command listed in `.factory/claims.json` individually and review
the live `/`, `/demo`, `/privacy`, `/terms`, `/handoff`, and an unknown route.
