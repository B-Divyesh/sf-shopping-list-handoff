import QRCode from 'qrcode';
import './style.css';
import './accessibility.css';

type Item = { id: string; amount: number | null; unit: string; name: string; done: boolean; category: string };
type List = { title: string; note: string; items: Item[]; updatedAt: string };

const sample: List = {
  title: 'Wednesday pasta night', note: 'Pick a ripe lemon. The basil can be loose.', updatedAt: new Date().toISOString(),
  items: [
    { id: 's1', amount: 500, unit: 'g', name: 'spaghetti', done: false, category: 'Pantry' },
    { id: 's2', amount: 2, unit: 'tbsp', name: 'olive oil', done: false, category: 'Pantry' },
    { id: 's3', amount: 1, unit: 'each', name: 'lemon', done: false, category: 'Produce' },
    { id: 's4', amount: 250, unit: 'g', name: 'cherry tomatoes', done: false, category: 'Produce' },
    { id: 's5', amount: 60, unit: 'g', name: 'parmesan', done: false, category: 'Dairy' },
    { id: 's6', amount: 1, unit: 'bunch', name: 'basil', done: false, category: 'Produce' }
  ]
};

const app = document.querySelector<HTMLDivElement>('#app')!;
let demo = location.pathname === '/demo' || new URLSearchParams(location.search).get('demo') === '1';
let list = load();
let showQr = false;
let toast = '';

function key() { return `slh:${demo ? 'demo' : 'real'}:list`; }
function fresh(): List { return { title: 'My shopping list', note: '', items: [], updatedAt: new Date().toISOString() }; }
function clone<T>(value: T): T { return JSON.parse(JSON.stringify(value)); }
function load(): List {
  try {
    const stored = localStorage.getItem(key());
    if (stored) return JSON.parse(stored) as List;
    const created = demo ? clone(sample) : fresh();
    localStorage.setItem(key(), JSON.stringify(created));
    return created;
  } catch { return demo ? clone(sample) : fresh(); }
}
function save() { list.updatedAt = new Date().toISOString(); localStorage.setItem(key(), JSON.stringify(list)); }
function uid() { return `${Date.now()}-${Math.random().toString(16).slice(2)}`; }
function esc(s: string) { return s.replace(/[&<>'"]/g, c => ({ '&':'&amp;', '<':'&lt;', '>':'&gt;', "'":'&#39;', '"':'&quot;' }[c]!)); }
function number(value: number | null) { return value === null ? '' : Number.isInteger(value) ? String(value) : String(Math.round(value * 100) / 100); }

const units: Record<string, { base: string; factor: number; label: string }> = {
  g: { base: 'g', factor: 1, label: 'g' }, kg: { base: 'g', factor: 1000, label: 'kg' },
  oz: { base: 'g', factor: 28.3495, label: 'oz' }, lb: { base: 'g', factor: 453.592, label: 'lb' },
  ml: { base: 'ml', factor: 1, label: 'ml' }, l: { base: 'ml', factor: 1000, label: 'L' },
  tsp: { base: 'ml', factor: 4.92892, label: 'tsp' }, tbsp: { base: 'ml', factor: 14.7868, label: 'tbsp' },
  cup: { base: 'ml', factor: 236.588, label: 'cup' },
  each: { base: 'count', factor: 1, label: 'each' }, bunch: { base: 'count', factor: 1, label: 'bunch' },
  clove: { base: 'count', factor: 1, label: 'clove' }, can: { base: 'count', factor: 1, label: 'can' }, pack: { base: 'count', factor: 1, label: 'pack' }
};
const aliases: Record<string, string> = { kilograms: 'kg', kilogram: 'kg', grams: 'g', gram: 'g', ounces: 'oz', ounce: 'oz', pounds: 'lb', pound: 'lb', litres: 'l', litre: 'l', liters: 'l', liter: 'l', milliliters: 'ml', milliliter: 'ml', tablespoons: 'tbsp', tablespoon: 'tbsp', teaspoons: 'tsp', teaspoon: 'tsp', cups: 'cup', cup: 'cup', cloves: 'clove', bunches: 'bunch', pcs: 'each', pieces: 'each' };
function canonicalUnit(value: string) { const v = value.toLowerCase().replace(/[.]/g, '').trim(); return aliases[v] || v; }
function category(name: string) {
  const n = name.toLowerCase();
  if (/tomato|lemon|basil|onion|garlic|pepper|lettuce|fruit|vegetable|herb/.test(n)) return 'Produce';
  if (/milk|cheese|butter|yogurt|parmesan|cream/.test(n)) return 'Dairy';
  if (/chicken|beef|fish|salmon|pork/.test(n)) return 'Protein';
  if (/bread|pasta|rice|flour|oil|salt|sugar|can|spice/.test(n)) return 'Pantry';
  return 'Other';
}
function parseAmount(raw: string) { const fraction: Record<string, number> = { '½': .5, '¼': .25, '¾': .75, '⅓': 1/3, '⅔': 2/3 }; const direct = fraction[raw]; if (direct) return direct; const m = raw.match(/^(\d+)?\s*(\d+)\/(\d+)$/); if (m) return (Number(m[1] || 0) + Number(m[2]) / Number(m[3])); return Number(raw); }
function parse(text: string): Item[] {
  return text.split(/\n|;/).map(line => line.trim().replace(/^[-*•\[\]xX\s]+/, '')).filter(Boolean).map(line => {
    const match = line.match(/^(\d+(?:\.\d+)?|\d+\s+\d+\/\d+|\d+\/\d+|[½¼¾⅓⅔])\s*([a-zA-Z.]+)?\s+(.+)$/);
    const amount = match ? parseAmount(match[1]) : null; const rawUnit = match?.[2] || ''; const name = (match?.[3] || line).replace(/\s*,\s*$/, ''); const unit = canonicalUnit(rawUnit);
    return { id: uid(), amount: Number.isFinite(amount!) ? amount : null, unit, name, done: false, category: category(name) };
  });
}
function normalized(items: Item[]) {
  const output: Item[] = [];
  for (const item of items) {
    const info = units[item.unit];
    const base = item.amount !== null && info && info.base !== 'count' ? info.base : item.unit;
    const amount = item.amount !== null && info && info.base !== 'count' ? item.amount * info.factor : item.amount;
    const existing = output.find(other => other.name.toLowerCase() === item.name.toLowerCase() && (units[other.unit]?.base || other.unit) === base && other.amount !== null && amount !== null);
    if (existing && existing.amount !== null && amount !== null) {
      const existingInfo = units[existing.unit];
      existing.amount = existingInfo && existingInfo.base !== 'count' ? existing.amount * existingInfo.factor + amount : existing.amount + amount;
      existing.unit = base;
    } else output.push({ ...item, amount, unit: base });
  }
  return output.map(item => {
    if (item.amount === null || !units[item.unit] || units[item.unit].base === 'count') return item;
    if (item.unit === 'g' && item.amount >= 1000) return { ...item, amount: item.amount / 1000, unit: 'kg' };
    if (item.unit === 'ml' && item.amount >= 1000) return { ...item, amount: item.amount / 1000, unit: 'l' };
    return { ...item, amount: Math.round(item.amount * 100) / 100 };
  });
}
function listText() { return `${list.title}\n${list.items.filter(i => !i.done).map(i => `- ${[number(i.amount), i.unit, i.name].filter(Boolean).join(' ')}`).join('\n')}${list.note ? `\n\nNote: ${list.note}` : ''}`; }
function setToast(message: string) { toast = message; render(); window.setTimeout(() => { if (toast === message) { toast = ''; render(); } }, 2600); }
function navigate(path: string) { history.pushState({}, '', path); demo = path === '/demo'; list = load(); showQr = false; render(); window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior }); requestAnimationFrame(() => document.querySelector<HTMLElement>('h1')?.focus()); }
window.addEventListener('popstate', () => { demo = location.pathname === '/demo' || new URLSearchParams(location.search).get('demo') === '1'; list = load(); showQr = false; render(); });

function header() { return `<header class="site-header"><a class="wordmark" href="/" data-route>SLH <span>01</span></a><nav aria-label="Main navigation"><a href="/demo" data-route>Demo</a><a href="#how">How it works</a><a href="/privacy" data-route>Privacy</a></nav></header>`; }
function footer() { return `<footer><p>Clear lists for people outside your app.</p><p><a href="/privacy" data-route>Privacy</a> · <a href="/terms" data-route>Terms</a> · Built by Param Factory · v1.0.0</p></footer>`; }
function facts() { return `<ul class="facts"><li><b>LOCAL</b> Stored in this browser</li><li><b>OFFLINE</b> Works after first visit</li><li><b>FREE</b> No account needed</li></ul>`; }
function landing() { return `<main id="main" tabindex="-1">
  <section class="hero" aria-labelledby="page-title"><div class="hero-copy"><p class="eyebrow">HANDOFF SHEET / 01</p><h1 id="page-title" tabindex="-1">Hand off a clear shopping list</h1><p class="lede">For cooks who need someone outside their app to shop without questions.</p><div class="hero-actions"><button class="primary" id="try-demo">Try it with sample data</button><span>Opens a ready-to-send pasta list.</span></div>${facts()}</div><figure class="hero-art"><img src="/assets/blueprint-handoff.webp" width="1200" height="800" fetchpriority="high" decoding="async" alt="A drafted recipe list transfers from a phone-shaped sheet to a paper checklist."/><figcaption>Recipe details become a plain shopping card.</figcaption></figure></section>
  <section class="app-section" aria-labelledby="builder-title"><div class="section-mark">02 / MAKE THE LIST</div><div class="section-head"><h2 id="builder-title">Paste ingredients or start a list</h2><p>One ingredient per line works best. We keep uncertain quantities visible.</p></div>${builder()}</section>
  <section id="how" class="how" aria-labelledby="how-title"><div class="section-mark">03 / HOW IT WORKS</div><h2 id="how-title">Make a list someone can use</h2><ol><li><b>Paste</b><span>Add ingredient lines from any recipe app.</span></li><li><b>Check</b><span>Review units and produce counts before sending.</span></li><li><b>Hand off</b><span>Print, copy, scan, or save a local file.</span></li></ol></section>
  <section class="privacy-note" aria-labelledby="privacy-title"><div><p class="section-mark">04 / BOUNDARIES</p><h2 id="privacy-title">Your list stays on this device</h2></div><p>There are no accounts or cloud lists. QR codes contain only item names and quantities. Notes never go into a QR code.</p></section>
</main>`; }
function builder() {
  const incomplete = list.items.filter(i => !i.done); const groups = [...new Set(incomplete.map(i => i.category))];
  const warning = incomplete.filter(i => ['each','bunch','clove','can','pack'].includes(i.unit) || (i.amount !== null && !i.unit)).length;
  return `<div class="workbench"><section class="input-sheet" aria-labelledby="paste-title"><h3 id="paste-title">Ingredient source</h3><label for="paste">Paste ingredients</label><textarea id="paste" rows="7" placeholder="500 g spaghetti&#10;2 tbsp olive oil&#10;1 lemon"></textarea><div class="input-actions"><button class="secondary" id="add-pasted">Add ingredients</button><button class="text-button" id="clear-list">Clear list</button></div><form id="add-form" class="quick-add"><h3>Add one item</h3><label><span>Amount</span><input name="amount" inputmode="decimal" /></label><label><span>Unit</span><input name="unit" placeholder="g, each" /></label><label class="wide"><span>Item</span><input name="name" required placeholder="e.g. pasta" /></label><button class="secondary wide" type="submit">Add item</button></form><label class="file-import" for="import-file"><span>Or open a local handoff file</span><input id="import-file" type="file" accept="application/json,.json" /></label><p class="local-note">Saved only in this browser${demo ? '; demo data uses a separate space' : ''}.</p></section>
  <section class="handoff-sheet" aria-labelledby="card-title"><div class="sheet-top"><div><p class="eyebrow">SHOPPER COPY</p><input aria-label="List title" id="list-title" value="${esc(list.title)}" /><p class="updated">${list.items.length} item${list.items.length === 1 ? '' : 's'} · ${incomplete.length} left</p></div><button class="icon-button" id="print" aria-label="Print shopping list" title="Print shopping list">⌘P</button></div>
  ${warning ? `<p class="warning" role="status"><b>CHECK:</b> ${warning} count or unmeasured item${warning === 1 ? '' : 's'} cannot be converted. Confirm the pack or produce size.</p>` : ''}
  <div class="checklist">${groups.length ? groups.map(group => `<section class="group"><h3>${group}</h3><ul>${incomplete.filter(i => i.category === group).map(item => `<li><label><input type="checkbox" data-done="${item.id}" /><span class="tick" aria-hidden="true"></span><span class="amount">${esc([number(item.amount), item.unit].filter(Boolean).join(' '))}</span><span>${esc(item.name)}</span></label><button class="remove" data-remove="${item.id}" aria-label="Remove ${esc(item.name)}">×</button></li>`).join('')}</ul></section>`).join('') : `<div class="empty"><p>Your handoff card will appear here.</p><p>Paste ingredients or add an item above.</p></div>`}</div>
  ${list.items.some(i => i.done) ? `<button class="text-button done-toggle" id="show-done">Show ${list.items.filter(i => i.done).length} checked item${list.items.filter(i => i.done).length === 1 ? '' : 's'}</button>` : ''}
  <label class="note-label" for="note">Note for the shopper <span>(not in QR)</span></label><textarea id="note" rows="2" placeholder="Optional pickup note">${esc(list.note)}</textarea>
  <div class="export-row"><button class="primary" id="copy-text">Copy plain text</button><button class="secondary" id="qr">${showQr ? 'Hide QR' : 'Make QR code'}</button><button class="secondary" id="save-file">Save local file</button></div>${showQr ? `<div class="qr-panel"><canvas id="qr-canvas" width="240" height="240" aria-label="QR code for the shopping list"></canvas><p>Scan to open this list in a browser. Notes stay out.</p></div>` : ''}</section></div>`;
}
function legal(kind: 'privacy' | 'terms') { const title = kind === 'privacy' ? 'Privacy is the default' : 'Simple terms for a local tool'; const paragraphs = kind === 'privacy' ? ['Shopping List Handoff stores your list in this browser only. It does not send ingredient lists, notes, or device identifiers to a server.', 'A QR code embeds a compact list of item names, quantities, and units. It never includes your note. Anyone who scans the code can read those list items.', 'You can clear browser storage in your browser settings or use Clear list. Demo data is stored in a separate browser key and is discarded when you reset it.'] : ['Shopping List Handoff is a free local utility. Use it for ordinary shopping information and check the final list before sharing it.', 'The tool does not place orders, contact retailers, or provide live collaboration. A saved file and a QR code are copies you choose to share.', 'The software is provided as-is, without warranties.']; return `<main id="main" tabindex="-1" class="legal"><p class="eyebrow">${kind.toUpperCase()} / 01</p><h1 id="page-title" tabindex="-1">${title}</h1>${paragraphs.map(p => `<p>${p}</p>`).join('')}<p><a href="/" data-route>Return to your list</a></p></main>`; }
function render() {
  const route = location.pathname;
  const isLegal = route === '/privacy' || route === '/terms';
  const currentTitle = route === '/privacy' ? 'Privacy — Shopping List Handoff' : route === '/terms' ? 'Terms — Shopping List Handoff' : route === '/demo' ? 'Demo — Shopping List Handoff' : 'Shopping List Handoff — Share a clear shopping list';
  document.title = currentTitle;
  app.innerHTML = `${header()}${demo ? `<aside class="demo-banner" aria-label="Demo mode"><span><b>Demo</b> — sample data, nothing is saved.</span><button id="reset-demo">Reset demo</button><button id="start-real">Start for real</button></aside>` : ''}${isLegal ? legal(route.slice(1) as 'privacy' | 'terms') : landing()}${footer()}<div class="toast" role="status" aria-live="polite">${esc(toast)}</div>`;
  bind(); if (showQr) makeQr();
}
function bind() {
  document.querySelectorAll<HTMLElement>('[data-route]').forEach(link => link.addEventListener('click', event => { const href = link.getAttribute('href'); if (href?.startsWith('/')) { event.preventDefault(); navigate(href); } }));
  document.querySelector<HTMLButtonElement>('#try-demo')?.addEventListener('click', () => navigate('/demo'));
  document.querySelector<HTMLButtonElement>('#add-pasted')?.addEventListener('click', () => { const area = document.querySelector<HTMLTextAreaElement>('#paste')!; const items = parse(area.value); if (!items.length) return setToast('Add at least one ingredient line first.'); list.items = normalized([...list.items, ...items]); area.value = ''; save(); setToast(`${items.length} ingredient${items.length === 1 ? '' : 's'} added to the card.`); });
  document.querySelector<HTMLButtonElement>('#clear-list')?.addEventListener('click', () => { if (!list.items.length || confirm('Clear every item from this list?')) { list = fresh(); save(); render(); setToast('The list is clear.'); } });
  document.querySelector<HTMLFormElement>('#add-form')?.addEventListener('submit', event => { event.preventDefault(); const data = new FormData(event.currentTarget as HTMLFormElement); const name = String(data.get('name') || '').trim(); if (!name) return; const raw = String(data.get('amount') || '').trim(); const amount = raw ? Number(raw) : null; const unit = canonicalUnit(String(data.get('unit') || '')); list.items = normalized([...list.items, { id: uid(), amount: Number.isFinite(amount!) ? amount : null, unit, name, done: false, category: category(name) }]); save(); render(); setToast(`${name} added.`); });
  document.querySelector<HTMLInputElement>('#import-file')?.addEventListener('change', async event => { const file = (event.target as HTMLInputElement).files?.[0]; if (!file) return; try { const parsed = JSON.parse(await file.text()); const incoming = parsed.list || parsed; if (!Array.isArray(incoming.items)) throw new Error('missing items'); const safeItems = incoming.items.map((item: Partial<Item>) => ({ id: uid(), amount: typeof item.amount === 'number' ? item.amount : null, unit: canonicalUnit(String(item.unit || '')), name: String(item.name || '').trim(), done: false, category: category(String(item.name || '')) })).filter((item: Item) => item.name); if (!safeItems.length) throw new Error('empty items'); list = { title: String(incoming.title || 'Imported shopping list'), note: '', items: normalized(safeItems), updatedAt: new Date().toISOString() }; save(); render(); setToast(`${safeItems.length} items opened from this device.`); } catch { setToast('That file has no readable shopping items. Choose a handoff JSON file.'); } });
  document.querySelector<HTMLInputElement>('#list-title')?.addEventListener('change', event => { list.title = (event.target as HTMLInputElement).value.trim() || 'My shopping list'; save(); render(); });
  document.querySelector<HTMLTextAreaElement>('#note')?.addEventListener('change', event => { list.note = (event.target as HTMLTextAreaElement).value; save(); setToast('Shopper note saved on this device.'); });
  document.querySelectorAll<HTMLInputElement>('[data-done]').forEach(box => box.addEventListener('change', () => { const item = list.items.find(i => i.id === box.dataset.done); if (item) { item.done = box.checked; save(); render(); } }));
  document.querySelectorAll<HTMLButtonElement>('[data-remove]').forEach(button => button.addEventListener('click', () => { list.items = list.items.filter(i => i.id !== button.dataset.remove); save(); render(); }));
  document.querySelector<HTMLButtonElement>('#copy-text')?.addEventListener('click', async () => { try { await navigator.clipboard.writeText(listText()); } catch { const area = document.createElement('textarea'); area.value = listText(); document.body.append(area); area.select(); document.execCommand('copy'); area.remove(); } setToast('Plain text copied. Send it in any message app.'); });
  document.querySelector<HTMLButtonElement>('#save-file')?.addEventListener('click', () => { const data = JSON.stringify({ format: 'shopping-list-handoff/v1', exportedAt: new Date().toISOString(), list: { ...list, note: undefined } }, null, 2); download(data, `${safeName(list.title)}.shopping-list.json`, 'application/json'); setToast('Local file saved. Shopper notes are left out.'); });
  document.querySelector<HTMLButtonElement>('#qr')?.addEventListener('click', () => { showQr = !showQr; render(); });
  document.querySelector<HTMLButtonElement>('#print')?.addEventListener('click', () => window.print());
  document.querySelector<HTMLButtonElement>('#reset-demo')?.addEventListener('click', () => { localStorage.removeItem('slh:demo:list'); list = clone(sample); save(); render(); setToast('Demo reset to the pasta list.'); });
  document.querySelector<HTMLButtonElement>('#start-real')?.addEventListener('click', () => { localStorage.removeItem('slh:demo:list'); navigate('/'); setToast('Demo discarded. Your real list starts empty.'); });
}
function safeName(name: string) { return name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') || 'shopping-list'; }
function download(contents: string, filename: string, type: string) { const a = document.createElement('a'); a.href = URL.createObjectURL(new Blob([contents], { type })); a.download = filename; a.click(); window.setTimeout(() => URL.revokeObjectURL(a.href), 1000); }
async function makeQr() { const canvas = document.querySelector<HTMLCanvasElement>('#qr-canvas'); if (!canvas) return; const payload = JSON.stringify({ v: 1, i: list.items.filter(i => !i.done).map(i => [i.amount, i.unit, i.name]) }); await QRCode.toCanvas(canvas, payload, { width: 240, margin: 2, color: { dark: '#102A43', light: '#F7F1E3' }, errorCorrectionLevel: 'M' }); }
if ('serviceWorker' in navigator) window.addEventListener('load', () => navigator.serviceWorker.register('/service-worker.js').catch(() => undefined));
render();
