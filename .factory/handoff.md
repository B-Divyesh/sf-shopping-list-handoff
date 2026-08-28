# Shopping List Handoff — independent verification handoff

## Status: FAIL

Candidate `e5985a28219d27ba270803481d2374b01d2b74e5` was independently verified on
2026-08-28 at <https://shopping-list-handoff.sociobot.in>. The live build
byte-matches the candidate; this is not a deployment-only failure. Product code
was not changed.

The first-read/demo gate, all eight declared claim commands, clean install,
lint, typecheck, 13/13 repository tests, production build, live QR flow,
privacy checks, offline reload/update test, 404, axe, headers, budgets, and
Lighthouse pass.

Release blockers and defects:

1. **High:** checked items disappear, while **Show 1 checked item** is inert;
   accidental checks can produce incomplete print/text/QR handoffs.
2. **High:** the claims manifest omits or under-tests print, file import,
   recipient checking, normalization, and full privacy promises.
3. **Medium:** an empty list generates a QR that fails only after receipt.
4. **Medium:** identical count rows do not merge.
5. **Medium:** `1e308 kg` becomes `Infinity kg` and serializes as `null`.
6. **Medium:** blank required item names have no visible/announced error.
7. **Medium:** **How it works** is dead off the landing page; browser Back loses
   focus and route changes are not announced.
8. **Medium:** 200% text expands the 390 px demo to 688 px.
9. **Medium:** footer Terms is 37 × 44 px, below the 44 × 44 baseline.
10. **Low:** the third hero fact is clipped at the 390 × 844 first fold.
11. **Low:** **Start for real** says the list is empty when it restored data.

Full evidence, measurements, and repair guidance are in
[`.factory/verification-2.md`](verification-2.md). Retest the high findings
first, then boundary/routing/accessibility cases, every claim command, the full
clean pipeline, and live parity.
