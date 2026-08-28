# Shopping List Handoff

Turn pasted recipe ingredients into a clear shopping list for someone who does
not use your meal-planning app.

It is for household cooks who need to hand a precise list to another shopper.
Paste ingredient lines, check the quantities, then print, copy as plain text,
make a private QR code, or save a local handoff file. The list stays in the
browser on your device. No account is needed.

Live: https://shopping-list-handoff.sociobot.in

## Use it

1. Paste one ingredient per line, such as `500 g spaghetti` or `1 lemon`.
2. Check the handoff card, especially count-based produce and packs.
3. Use **Copy plain text**, **Make QR code**, **Save local file**, or print.

QR codes contain ingredient lines only. They exclude the list title and shopper
note. The local JSON handoff file excludes the shopper note too.

Try the isolated demo at `/demo` or use **Try it with sample data**. Demo data
uses a different browser-storage key from real lists. The app works offline
after the first visit.

## Develop

```sh
npm install
npm run dev
npm test
npm run build
```

`npm run build` writes the static deployment output to `dist/`, with
`dist/index.html` at its root. Deploy that directory to Azure Static Web Apps.

## Privacy and limits

No list data is sent to a server. The browser stores real lists under
`slh:real:list` and the demo under `slh:demo:list`. Clearing browser site data
clears them.

Read the in-product [Privacy](/privacy) and [Terms](/terms) pages for details.

## Project notes

The blueprint illustration is original, generated factory artwork. Its prompt
and provenance are recorded in `.factory/design.md`. Claim coverage is listed
in `.factory/claims.json`; demo behavior is documented in `.factory/demo.md`.
