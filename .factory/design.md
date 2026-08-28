# Shopping List Handoff — visual thesis

## Direction: blueprint drafting sheet

This tool exists at the moment a meal plan crosses from one person and app to
another person. The interface treats that handoff as a clear, portable field
sheet: measured, annotated, and usable with a pen near a kitchen counter.
Deep midnight-blue paper carries fine construction lines. Cream cards resemble
a clipped recipe slip, while tomato-red marks the one action that moves a list
out of the app. The result is deliberately practical rather than a generic
shopping or SaaS dashboard.

## Tokens

| Role | Token | Value |
| --- | --- | --- |
| Drafting paper | `--ink` | `#102A43` |
| Darker edge | `--ink-deep` | `#071C30` |
| Sheet | `--paper` | `#F7F1E3` |
| Sheet shadow | `--paper-shadow` | `#E4D9C4` |
| Blueprint line | `--rule` | `#77B6D2` |
| Annotation | `--muted` | `#BBD5E4` |
| Handoff mark | `--red` | `#9F3027` |
| Success check | `--green` | `#3F8A70` |
| Warning pencil | `--amber` | `#D69A32` |

The page is intentionally a dark single-mode drafting table. Cream sheet
surfaces retain high contrast. Text in cream on ink and ink on paper exceed
4.5:1.

## Type, rhythm, shape

Headings use the self-hosted system `ui-monospace` stack, evoking measurements
without loading a font. Body copy uses a humanist system `ui-sans-serif` stack
for grocery quantities and instructions. Type sizes use a 1.25 scale; body is
17px. Layout spacing uses 4px and 8px increments. Cards have squared corners,
corner registration marks, and narrow drafting rules; controls are sturdy,
rounded 6px labels rather than floating pills.

## Interaction and motion

Adding or regrouping an item gives the paper sheet a 180ms upward settle. A
completed item is crossed by a drawn rule. With reduced motion, both changes
are instant. No decoration loops or scroll effects. Status messages are
written as compact margin notes.

## Original art plan and provenance

Hero art is an original raster illustration: a top-down blueprint table with a
recipe ingredient strip travelling from a phone-shaped origin to a paper
shopping card, with arrows and measurement marks but no readable text. It
clarifies the handoff boundary without promising recipe extraction. Generated
with the factory image model through `/opt/fleet/lib/gen-image.sh` on
2026-08-28. Prompt:

> Blueprint drafting illustration: a cream grocery checklist sheet moves from
> a phone-shaped recipe strip on midnight blue grid paper; cyan construction
> lines and tomato-red drafting arrow; no text, no logos, no watermark, no
> people.

The selected source and prompt sidecar live under `assets/src/`; the shipped
WebP is optimised below 300 KB. Generated imagery is original product artwork.
