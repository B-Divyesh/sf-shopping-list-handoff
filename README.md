# Shopping List Handoff

Turn pasted ingredients into a clear handoff card for a shopper outside your
meal-planning app.

It is for household cooks handing a shopping list to another shopper.
Paste ingredient lines and check the quantities. Then print, copy, make a QR
code, or save a local handoff file. The QR code opens a list in a browser.
The working list stays in your browser. No account is needed.

Live: https://shopping-list-handoff.sociobot.in

## Use it

1. Paste one ingredient per line, such as `500 g spaghetti` or `1 lemon`.
2. Check the handoff card, especially count-based produce and packs.
3. Use **Copy plain text**, **Make QR code**, **Save local file**, or print.

Compatible metric and volume quantities combine into one line. Equal count
units, such as two bunches of basil, combine too. Counts and unmeasured items
stay visible with a review warning rather than guessing a size.

Scanning a QR code opens a readable list in the browser. The list is encoded
after the # in the link, so the browser does not send it to the server. QR
codes exclude the list title and shopper note. The local handoff file leaves
out the note too.

Try the isolated demo at `/demo` or use **Try it with sample data**. Demo data
is stored separately from your real lists. The app works offline after the
first visit.

## Develop

```sh
npm ci
npm run dev
npm run lint
npm run typecheck
npm test
npm run build
```

`npm run build` writes the static deployment output to `dist/`, with
`dist/index.html` at its root. Deploy that directory to Azure Static Web Apps.

## Privacy and limits

No list data is sent to a server. Real lists and demo lists are stored
separately in this browser. Clearing browser site data clears them.

Read the in-product [Privacy](/privacy) and [Terms](/terms) pages for details.

## Project notes

The blueprint illustration is original, generated factory artwork. Its prompt
and provenance are recorded in `.factory/design.md`. Claim coverage is listed
in `.factory/claims.json`; demo behavior is documented in `.factory/demo.md`.

## License

MIT. See [LICENSE](LICENSE).
