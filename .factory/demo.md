# Demo sandbox

Open `/demo` or click **Try it with sample data**. It starts with the
Wednesday pasta night list: spaghetti, olive oil, lemon, tomatoes, parmesan,
and basil.

Demo storage uses only the `slh:demo:list` localStorage key. Real use uses
`slh:real:list`; the two keys are never read together. **Reset demo** clears
and reseeds the demo key. **Start for real** discards the demo key and opens an
empty real list.

The shell and sample illustration are cached by the service worker after the
first visit, so the demo can be reloaded offline.

**Make QR code** encodes a `/handoff#list=…` URL. The fragment contains only
item lines and never reaches the server. Opening that URL in a fresh browser
shows a checkable recipient list without writing to localStorage.
