# Copy audit — polish 2

Reviewed 2026-08-28 against the landing page and README. Counts exclude
navigation, punctuation, and code examples. No sentence exceeds 22 words and
no banned marketing words appear.

| Copy | Words | Result |
| --- | ---: | --- |
| Hand off a clear shopping list | 6 | Pass |
| For cooks who need someone outside their app to shop without questions. | 12 | Pass |
| Opens a ready-to-send pasta list. | 5 | Pass |
| Stored in this browser | 4 | Pass |
| Works after first visit | 4 | Pass |
| No account needed | 3 | Pass |
| Pasted ingredients become a handoff card. | 6 | `pasted-ingredients-to-card` |
| Paste ingredients or start a list | 6 | Pass |
| Paste one ingredient per line. | 5 | Instruction |
| We keep uncertain quantities visible. | 5 | Pass |
| Saved only in this browser. | 5 | Pass |
| Your handoff card will appear here. | 6 | Pass |
| Print shopping list | 3 | `print-sheet` |
| Paste ingredients or add an item above. | 8 | Pass |
| Make a list someone can use | 6 | Pass |
| Paste ingredient lines into the list. | 6 | Instruction |
| Review units and produce counts before sending. | 7 | Pass |
| Print, copy, scan, or save a local file. | 8 | Pass |
| Your list stays on this device | 6 | Pass |
| There are no accounts or cloud lists. | 7 | Pass |
| QR codes contain only item names and quantities. | 8 | Pass |
| Notes never go into a QR code. | 7 | Pass |
| Scan to open this list in a browser. | 8 | Pass |
| The code includes item lines only. | 6 | Pass |
| Shop this handed-off list | 5 | Pass |
| Check each item as you shop. | 7 | Pass |
| This copy is not saved in the browser. | 8 | Pass |
| This handoff link is incomplete | 5 | Pass |
| The list data is missing or unreadable. | 7 | Pass |
| Ask the sender to make a new QR code. | 9 | Pass |

## Terminology

| Concept | Product word |
| --- | --- |
| Shareable checked list | handoff card |
| Food line from a recipe | ingredient |
| Person buying the food | shopper |
| Optional private instruction | shopper note |
| Downloadable JSON | local handoff file |
| Scannable transfer | QR code |

## README claim sentences

| Copy | Words | Claim |
| --- | ---: | --- |
| Turn pasted ingredients into a clear shopping list for someone who does not use your meal-planning app. | 18 | `pasted-ingredients-to-card` |
| The QR code opens a list in a browser. | 9 | `qr-recipient` |
| The working list stays in your browser. | 7 | `local-only` |
| No account is needed. | 5 | `no-account` |
| Compatible metric and volume quantities combine into one line. | 9 | `quantity-normalization` |
| Equal count units, such as two bunches of basil, combine too. | 10 | `quantity-normalization` |
| The item data stays in the URL fragment, which is not sent to the server. | 14 | `qr-private`, `local-data-private` |
| The app works offline after the first visit. | 8 | `offline-reload` |
| No list data is sent to a server. | 8 | `local-data-private` |
| Clearing browser site data clears them. | 6 | `site-data-clear` |

## Flags

None. The earlier broad “any recipe app” phrase, unsupported “recipe details”
wording, unsupported “works best” comparison, decorative serial labels, and
ambiguous “shopping card” label are absent.
