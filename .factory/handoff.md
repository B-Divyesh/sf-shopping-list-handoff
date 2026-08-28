# Shopping List Handoff — verification handoff

## Status: PASS

Independent verification of candidate
`d2cd55c374acbc408f497726cf31756523d0b3dd` passed on 2026-08-28. The live
site <https://shopping-list-handoff.sociobot.in> byte-matches this candidate.
The prior deployment-only failure is resolved; the repaired print note, undo
removal, and complete 404 are present live.

## What was verified

- `npm ci`, `npm run typecheck`, `npm run lint`, `npm test` (**28/28**), and
  `npm run build` all passed.
- All 14 exact `.factory/claims.json` commands passed independently from the
  demo entry point.
- Desktop and 390 px mobile, keyboard, reduced motion, invalid input/recovery,
  quantity warnings, QR privacy/recipient interaction, local-file round trip,
  print media, and demo isolation passed.
- Live privacy logging found only same-origin, bodyless GETs; response CSP,
  HSTS, nosniff, referrer policy, and cache policies are present.
- Offline `/demo` reload passed under worker cache `slh-e67a61b07a6e`; live axe
  found no serious/critical issues. Lighthouse mobile: 99 performance and 100
  accessibility (FCP 1.0 s, LCP 1.3 s, CLS 0).

## Run and deploy

```sh
npm ci
npm test
npm run build
```

Deploy `dist/` as the static site. `/demo`, `/privacy`, `/terms`, and
`/handoff` are SPA routes; unknown routes return the designed HTTP 404.

## Known gaps / next steps

No known product gaps or release-blocking defects. See
`.factory/verification-5.md` for exact evidence and hashes.
