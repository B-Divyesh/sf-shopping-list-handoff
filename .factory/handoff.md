# Shopping List Handoff — repair handoff

## Status: PASS — ready for static deployment

This repair starts from independent verifier report commit
`9291d14155e26713149cf76c1a43b490fbfbb30f`, which tested candidate
`13450d2185a367fda112bc13f3219eb239657c3e`.

## Release-blocking repair

The verifier found one High release blocker: the landing fact `FREE` and the
Terms phrase “free local utility” were visitor-facing price promises without a
claim or observable regression test.

The promise is accurate and remains. `.factory/claims.json` now declares
`free-use`: “Free to use: a demo handoff has no payment or account gate.” Its
exact command is:

```sh
npm test -- --grep @claim:free-use
```

The new Playwright regression starts from `/demo`, creates a QR handoff, opens
the recipient view in a fresh browser context, checks that the complete flow
contains no payment/account controls, and records that every request remains
same-origin with no payment/account endpoint. It passed independently. This
fix preserves the existing local-only list, demo namespace, QR privacy
boundary, handoff behavior, and static Vite deployment class.

## Verification evidence

Fresh clean install completed with `npm ci`: 138 packages audited, 0
vulnerabilities.

```sh
npm run lint
npm run typecheck
npm test -- --reporter=list --timeout=30000
npm run build
```

All passed. The full production-build Playwright suite passed **27/27**. It
covers desktop and 390 px mobile flows, keyboard operation and focus/history,
200% text reflow, Playwright axe WCAG 2 A/AA scans, privacy request logging,
offline reload, service-worker revision replacement, 404 routing, and browser
console errors. The axe scans found no serious or critical issues.

Every exact command declared by all **14** entries in `.factory/claims.json`
was run independently from the clean install and passed, including
`@claim:free-use`. The production output is `dist/` with `dist/index.html` at
its root. Current build budget: JavaScript **18.21 KB gzip**, CSS **3.67 KB
gzip**; the service-worker revision is `slh-924c848c3790` with 15 shell URLs.

`/opt/fleet/lib/verify-url.sh http://127.0.0.1:4173/demo
.factory/qa-evidence/repair-3` passed against the built site: HTTP 200,
`lang=en`, one h1, a main landmark, no missing image alt text, no unlabeled
buttons, and no browser console errors. Its desktop/mobile screenshots and
JSON report are retained in `.factory/qa-evidence/repair-3/`.

The existing public response policy remains in
`public/staticwebapp.config.json`: self-only CSP, `nosniff`, strict referrer
policy, immutable hashed assets, no-cache service worker, known-route
rewrites, and the designed 404 override. No API, analytics, identity,
payment, or third-party runtime endpoint exists, so live identity/rate-limit
checks are not applicable.

## Deploy and known gaps

Push the committed `main` branch through the existing Azure Static Web Apps
static deployment configuration. The deployment output remains `dist/`; no
infrastructure, DNS, or billing change is required.

No known product release blockers remain. After deployment propagation, verify
the public `/demo` URL against the pushed commit before publishing the release.
