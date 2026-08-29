# Shopping List Handoff — review 4 handoff

## Status: review failed

No product code was modified. The independent review is recorded in
[review-4.md](review-4.md). It finds one blocking claims-contract gap:
the Terms promise that the tool does not place orders, contact retailers, or
provide live collaboration has no manifest entry or targeted observable test.

## Verification performed

From a fresh clone: `npm ci`, `npm run lint`, `npm run typecheck`, the full
32-test Playwright suite, and `npm run build` passed. All 16 exact commands in
`.factory/claims.json` also passed independently; every manifest id occurs
once as an `@claim:` tag. The build emitted `dist/` with 18.73 KB gzip initial
JavaScript.

Fresh live browser checks at 390 × 844 and desktop confirmed the first read,
one-click in-viewport sample demo, Reset/Start-for-real behavior, real/demo
storage separation, same-origin/no-body request log, offline reload, route
metadata, accessibility scan, link crawl, HTTP 404, and route focus/scroll
history behavior. No console errors or serious/critical axe violations were
observed.

## Next step

Remove the unsupported Terms sentence or add a narrow declared claim and an
observable test as specified in F-4-1. Re-run the complete review after that
change.
