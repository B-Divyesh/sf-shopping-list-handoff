# Copy audit — polish 4

Reviewed 2026-08-29 against the landing page, demo, legal routes, 404, and
README. Counts exclude punctuation and code paths. Every sentence is 22 words
or fewer. No banned marketing word, serial label, unexplained initialism, or
unlisted claim remains.

## Landing page

| Copy | Words | Result |
| --- | ---: | --- |
| Shopping List Handoff | 3 | Product wordmark |
| Demo; How it works; Privacy | 1; 3; 1 | Navigation |
| Hand off a clear shopping list | 6 | Plain job headline |
| For cooks handing a list to a shopper outside their meal-planning app. | 12 | Audience and situation |
| Try it with sample data | 5 | `sample-demo` |
| Opens a ready-to-send pasta list. | 5 | `sample-demo` |
| Stored in this browser | 4 | `local-only` |
| Works after first visit | 4 | `offline-reload` |
| No account needed | 3 | `no-account` |
| Pasted ingredients become a handoff card. | 6 | `pasted-ingredients-to-card` |
| Paste ingredients or start a list | 6 | Section heading |
| Paste one ingredient per line. | 5 | Direct instruction |
| We keep uncertain quantities visible. | 5 | `quantity-normalization` |
| Ingredient source; Paste ingredients; Add ingredients; Clear list | 2; 2; 2; 2 | Labels and verbs |
| Add one item; Amount; Unit; Item; Add item | 3; 1; 1; 1; 2 | Labels and verbs |
| Or open a local handoff file | 6 | Local-file instruction |
| Saved only in this browser. | 5 | `local-only` |
| Shopping list; Print shopping list | 2; 3 | Functional card labels |
| Your handoff card will appear here. | 6 | Empty state |
| Paste ingredients or add an item above. | 7 | Empty-state next step |
| Note for the shopper (not in QR) | 7 | `qr-private` |
| Copy plain text; Make QR code; Save local file | 3; 3; 3 | Export verbs |
| How it works | 3 | Section heading |
| Paste ingredient lines into the list. | 6 | Direct instruction |
| Review units and produce counts before sending. | 7 | Direct instruction |
| Print, copy, scan, or save a local file. | 8 | Export instructions |
| Your list stays on this device | 6 | `local-only` |
| There are no accounts or cloud lists. | 7 | `no-account`, `local-data-private` |
| QR codes contain only item names and quantities. | 8 | `qr-private` |
| Notes never go into a QR code. | 7 | `qr-private` |
| Shopping lists for people outside your app. | 7 | Product description |

## Demo, routes, and errors

| Copy | Words | Result |
| --- | ---: | --- |
| Demo — sample data, nothing is saved. | 6 | `local-only` |
| Reset demo; Start for real | 2; 3 | Isolated-demo controls |
| Wednesday pasta night handoff | 4 | Demo-specific h1 |
| Check the sample list, then copy, print, scan, or save it. | 11 | Export actions already covered above |
| How Shopping List Handoff stores data | 6 | Privacy route h1 |
| Terms for Shopping List Handoff | 5 | Terms route h1 |
| Shopping List Handoff is free to use. | 7 | `free-use` |
| Use it for ordinary shopping information and check the final list before sharing it. | 13 | Direct instruction |
| The software is provided as-is, without warranties. | 7 | Legal limitation |
| This page was not found | 6 | Literal 404 h1 |
| Shop this handed-off list | 5 | Recipient h1 |
| This handoff link is incomplete | 5 | Recovery h1 |

## README claim sentences

| Copy | Words | Claim or purpose |
| --- | ---: | --- |
| Turn pasted ingredients into a clear handoff card for a shopper outside your meal-planning app. | 15 | `pasted-ingredients-to-card` |
| It is for household cooks handing a shopping list to another shopper. | 12 | Audience |
| Compatible metric and volume quantities combine into one line. | 9 | `quantity-normalization` |
| Scanning a QR code opens a readable list in the browser. | 10 | `qr-recipient` |
| The list is encoded after the # in the link, so the browser does not send it to the server. | 19 | `qr-private`, `local-data-private` |
| The local handoff file leaves out the note too. | 9 | `local-file-private` |
| Demo data is stored separately from your real lists. | 9 | `local-only` |
| The app works offline after the first visit. | 8 | `offline-reload` |
| No list data is sent to a server. | 8 | `local-data-private` |
| Clearing browser site data clears them. | 6 | `site-data-clear` |
| Turn pasted ingredients into a handoff card. | 7 | Catalog; `pasted-ingredients-to-card` |

## Terminology

| Concept | Product word |
| --- | --- |
| Shareable checked list | handoff card |
| Food line from a recipe | ingredient |
| Person buying the food | shopper |
| Optional private instruction | shopper note |
| Downloadable file | local handoff file |
| Scannable transfer | QR code |

## Flags

None. The review-four unsupported Terms scope promise is removed. The
review-three subjective outcomes, browser-storage jargon, local-file jargon,
decorative serial labels, slogan headings, and blueprint-metaphor 404 wording
are absent.
