# Independent verification 3 — FAIL

**Candidate:** `13450d2185a367fda112bc13f3219eb239657c3e`

**Verified URL:** <https://shopping-list-handoff.sociobot.in>
**Date:** 2026-08-28
**Scope:** clean-install claim gate, local production build/test gates, live parity, normal/boundary/recovery flows, desktop and 390 px browser QA, keyboard/a11y, privacy/network behavior, PWA, headers/caching, and bundle budget. Product code was not changed.

## Release decision

**FAIL.** The candidate is deployed and its implemented shopping-list handoff works. However, the factory claims contract explicitly makes an unlisted visitor-facing promise release-blocking. The landing page says **“FREE”** and the Terms page says **“Shopping List Handoff is a free local utility,”** but `.factory/claims.json` has no `free`/price claim and no test that proves the promise. The `no-account` claim proves only that an account is not needed; it does not test price or the absence of a payment requirement.

## Mandatory gates

### First read — PASS

A cold, unauthenticated desktop page plainly states what it does (“Hand off a clear shopping list”), who it is for (“cooks who need someone outside their app”), and what to click (“Try it with sample data,” which “Opens a ready-to-send pasta list”).

The live `/?demo=1` and the one-click button both open an isolated ready pasta handoff with the persistent **Demo — sample data, nothing is saved** banner, **Reset demo**, and **Start for real** controls. The demo key was `slh:demo:list`; no real-list key was present.

### Claims — commands PASS; manifest audit FAIL

`.factory/claims.json` exists and declares 13 claims. From the clean checkout, after `npm ci`, I ran every exact command listed in the manifest against the production-build Playwright demo entry point. All passed: `sample-demo`, `no-account`, `plain-text-export`, `local-file-private`, `local-file-roundtrip`, `print-sheet`, `qr-recipient`, `qr-private`, `recipient-checkable`, `quantity-normalization`, `local-only`, `local-data-private`, and `offline-reload` (one tagged test per command; the two shared-test pairs still each selected one test).

The subsequent `npm test -- --reporter=list --timeout=10000` passed all **26** tests (`test-results/.last-run.json` reports `status: passed`). This confirms the tagged cases pass, but does not cure the absent price claim below.

## Local checks — PASS

- Initial clone was clean and at the candidate SHA.
- `npm ci`: pass; 138 packages audited, 0 vulnerabilities.
- `npm run lint`, `npm run typecheck`, and `npm run build`: pass; `dist/` produced.
- Service-worker revision: `slh-924c848c3790`, with 15 cached shell URLs.
- Production initial bundle: JS **18.21 KB gzip**, CSS **3.67 KB gzip**; both within budget. Hero WebP: **33,426 bytes**.

## Live deployment and product QA — PASS

Every deployable candidate artifact byte-matched the live hostname: HTML, 404, favicon, robots, sitemap, service worker, apple icon, hashed JS/CSS, hero, social art, and 404 CSS. `staticwebapp.config.json` is intentionally not publicly served (404), so it was not treated as a parity mismatch.

The clean suite and live browser checks covered demo sample, paste/normalization, quick add, invalid negative/overflow amount handling, blank-item recovery, empty-QR recovery, checked-item restore, text copy, local-file export/import, browser print, QR recipient checking, malformed-handoff recovery, demo reset/exit, and browser Back focus. At 390 x 844, `scrollWidth` was 390; the skip link moved focus to `#page-title`; reduced motion yielded `scroll-behavior: auto` and zero-second toast transitions.

Live axe WCAG 2 A/AA scans of `/`, `/demo`, `/privacy`, `/terms`, malformed `/handoff`, and the 404 had **zero serious or critical** findings (none at any impact). Public routes had one h1 and one main and no page/app console errors. The browser's expected network-error console entry for the deliberately HTTP-404 document is not an application error.

Fresh live Lighthouse mobile `/demo` generated **100 Performance, 100 Accessibility, 100 Best Practices, and 100 SEO**; LCP 305 ms, CLS 0, TBT 0 ms. Lighthouse then reported a Chromium target crash while collecting its optional full-page screenshot, but wrote the complete scored JSON and no audit warning. Independent Playwright checks remained clean.

## Privacy, PWA, and response policy — PASS

A full populated live demo flow recorded five browser requests: the `/demo` document, same-origin JS, CSS, and the hero image (requested twice). All were same-origin **GET** requests; no request body, private title (`Private household 17`), or note (`Gate code 1234`) appeared in the log. The QR link used the same origin and a fragment payload. There are no product APIs, analytics, sign-in, payment, unlock, or backend endpoints, so rate-limit and Microsoft Entra checks are not applicable.

After first load the live service worker controlled the page; `/demo` reloaded offline and retained its heading. The repository test also verifies replacement of an old service-worker cache by a new revision.

`/`, `/demo`, `/privacy`, `/terms`, and `/handoff` returned 200; an unknown path returned the designed 404. HTML revalidates at 30 seconds, hashed JS/CSS use `public, max-age=31536000, immutable`, and the service worker uses `no-cache`. Responses include HSTS, `X-Content-Type-Options: nosniff`, `Referrer-Policy: strict-origin-when-cross-origin`, and a self-only CSP matching the local assets.

## Defects

### High — price promise is absent from the claims manifest

**Evidence:** The first-screen fact is rendered as `FREE No account needed`, and `/terms` renders “Shopping List Handoff is a free local utility.” None of the 13 entries in `.factory/claims.json` claims the product is free or tests that it can be used without payment. The closest entry is `no-account`, whose claim is solely “No account is needed to open and use a handoff card.”

**Why this blocks release:** The supplied claims contract says every statement a visitor could rely on must have one tagged observable test; it specifically says any claim-like live/README sentence with no entry fails review.

**Required repair:** either remove/narrow the free-price copy or add one `free-use` claim with a tagged demo test that exercises the available handoff flow and asserts no payment/checkout/account gate appears or is requested. Then rerun every exact manifest command and this verification.

### Medium / Low

No additional defects found in this verification.

## Retest order

1. Add the missing `free-use` claim/test (or remove the promise).
2. Run every command in `.factory/claims.json` independently from `npm ci`.
3. Repeat the live claim, privacy, offline, axe, and parity checks.
