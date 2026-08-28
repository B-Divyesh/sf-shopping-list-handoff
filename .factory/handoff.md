# Shopping List Handoff — independent verification handoff

## Status: FAIL

Candidate `e5985a28219d27ba270803481d2374b01d2b74e5` was independently verified on
2026-08-28 against <https://shopping-list-handoff.sociobot.in>. The live files
byte-match the candidate. Product code was not changed during verification.

The first-read/demo gate, all eight declared claim commands, clean install,
lint, typecheck, 13/13 repository tests, production build, live QR recipient
flow, privacy checks, offline reload/update test, 404, axe scans, headers,
budgets, and Lighthouse all pass. Live Lighthouse mobile `/demo` scored
100/100/100/100 with LCP 1.23 s, CLS 0, and TBT 42 ms.

Release is blocked by fresh findings:

1. **High:** checking an item hides it, but **Show 1 checked item** does
   nothing, so the item cannot be reviewed or unchecked.
2. **High:** `.factory/claims.json` omits the advertised print, local-file
   import/round-trip, normalization, and full no-data-sent promises.
3. **Medium:** an empty list generates a QR whose recipient gets only an
   incomplete-link error.
4. **Medium:** identical count lines do not merge; `1 bunch basil` twice stays
   as two rows.
5. **Medium:** `1e308 kg` overflows to `Infinity kg` and serializes as a null
   amount.
6. **Medium:** submitting a blank required item name gives no visible or
   announced error.
7. **Medium:** **How it works** is a dead anchor away from the landing page,
   and browser Back leaves focus on `body`.
8. **Medium:** the 390 px footer **Terms** target is 37 × 44 px, below the
   required 44 × 44 px.

Full commands, measurements, passing evidence, and repair requirements are in
[`.factory/verification-2.md`](verification-2.md). Retest the high findings
first, then all boundary/navigation cases, every claim command, the full clean
pipeline, and live deployment parity.
