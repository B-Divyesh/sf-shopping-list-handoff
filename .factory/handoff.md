# Shopping List Handoff — independent verification handoff

## Status: FAIL — do not release candidate 8cf8a0d

Candidate `8cf8a0dd5801c69428b714a761858d6b8117d713` was independently tested on
2026-08-28 at <https://shopping-list-handoff.sociobot.in>. The deployment
byte-matches the candidate and the earlier deployment-only concern is resolved.
Product code was not modified.

The full evidence and defect detail are in
[`.factory/verification-4.md`](verification-4.md).

## What passed

- Cold first-read and one-click sample demo gate.
- All 14 exact commands in `.factory/claims.json` after `npm ci`.
- `npm run lint`, `npm run typecheck`, all 27 Playwright tests, and
  `npm run build`.
- Live normal, boundary, invalid-input, recovery, copy, QR recipient, private
  local file, import, and demo-isolation flows.
- Live artifact parity, privacy request log, response security headers,
  immutable asset caching, 304 revalidation, offline reload, and worker cache
  revision behavior.
- Desktop and 390 px mobile, keyboard operation, visible focus, 200% text
  reflow, reduced motion, all 44 px targets, and live axe scans with no
  violations.
- Mobile Lighthouse: 100 Performance, 100 Accessibility, 100 Best Practices,
  100 SEO; LCP 1,307 ms, TBT 90 ms, CLS 0.

Build output is `dist/`. JavaScript is 18.21 KB gzip, CSS is 3.67 KB gzip, the
hero is 33,426 bytes, and the generated offline cache is
`slh-924c848c3790` with 15 shell URLs.

## Release blockers and gaps

1. **High:** print media hides **Note for the shopper**. The sample buyer
   instruction is silently absent from the printed handoff even though the UI
   warns only that the note is excluded from QR. Render it in print and test
   print contents.
2. **Medium:** **Remove item** permanently writes the deletion with no Undo or
   confirmation, no announcement, and focus loss to `<body>`. Add a reversible
   or confirmed flow and deterministic keyboard focus.
3. **Low:** the correct designed HTTP 404 omits the contract's standard
   header/navigation/footer and basic description/canonical metadata.

## Reproduce

```sh
npm ci
jq -r '.[].test' .factory/claims.json | while IFS= read -r test; do bash -lc "$test" || exit; done
npm run lint
npm run typecheck
npm test -- --reporter=list --timeout=30000
npm run build
```

For the blocking print defect, open `/demo`, leave its sample shopper note in
place, emulate print media, and inspect `.note-label` and `#note`: both compute
to `display: none`. For deletion, focus **Remove spaghetti**, press Enter, and
reload; spaghetti remains absent from `slh:demo:list`, with no Undo available.

After repair, repeat the full claim gate and local suite, deploy `dist/`, then
rerun byte parity, privacy requests, axe, 390 px keyboard/reflow, offline
reload/update, response headers/caching, and mobile Lighthouse.
