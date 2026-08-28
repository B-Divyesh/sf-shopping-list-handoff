import { expect, test } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import jsQR from 'jsqr';
import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';
import { renderServiceWorker } from '../scripts/service-worker.mjs';

test('one click opens an in-viewport sample handoff card without an account @claim:sample-demo @claim:no-account', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/');
  await page.getByRole('button', { name: 'Try it with sample data' }).click();
  await expect(page).toHaveURL(/\/demo$/);
  await expect(page.getByText('Demo — sample data, nothing is saved.')).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Wednesday pasta night handoff' })).toBeVisible();
  await expect(page.getByRole('button', { name: 'Reset demo' })).toBeVisible();
  for (const locator of [page.getByLabel('List title'), page.getByText('spaghetti', { exact: true }), page.getByText('olive oil', { exact: true })]) {
    const box = await locator.boundingBox();
    const label = await locator.textContent() || 'list title';
    expect(box?.y, label).toBeGreaterThanOrEqual(0);
    expect((box?.y || 0) + (box?.height || 0), label).toBeLessThanOrEqual(844);
  }
});

test('the direct demo query opens the isolated sample with its controls', async ({ page }) => {
  await page.goto('/?demo=1');
  await expect(page.getByText('Demo — sample data, nothing is saved.')).toBeVisible();
  await expect(page.getByRole('button', { name: 'Reset demo' })).toBeVisible();
  await expect(page.getByRole('button', { name: 'Start for real' })).toBeVisible();
  await expect(page.getByText('spaghetti', { exact: true })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Wednesday pasta night handoff' })).toBeVisible();
  await expect(page).toHaveTitle('Demo — Shopping List Handoff');
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href', 'https://shopping-list-handoff.sociobot.in/demo');
});

test('a demo handoff has no payment or account gate @claim:free-use', async ({ page, browser }) => {
  const requests: string[] = [];
  page.on('request', request => requests.push(request.url()));
  await page.goto('/demo');
  await page.getByRole('button', { name: 'Make QR code' }).click();
  const handoff = await page.locator('#qr-link').getAttribute('href');
  expect(handoff).toBeTruthy();

  const recipient = await browser.newContext();
  const recipientPage = await recipient.newPage();
  recipientPage.on('request', request => requests.push(request.url()));
  try {
    await recipientPage.goto(handoff!);
    await expect(recipientPage.getByRole('heading', { name: 'Shop this handed-off list' })).toBeVisible();
    const visibleControls = (await Promise.all([page, recipientPage].map(async current =>
      current.locator('a, button, input, textarea, select, form').allTextContents()
    ))).flat();
    expect(visibleControls.join(' ')).not.toMatch(/payment|pay now|checkout|purchase|subscribe|sign in|log in|create account/i);
    expect(requests.every(url => {
      const parsed = new URL(url);
      return parsed.origin === 'http://127.0.0.1:4173' && !/payment|checkout|purchase|subscribe|account/i.test(parsed.pathname);
    })).toBeTruthy();
  } finally {
    await recipient.close();
  }
});

test('pasted ingredients appear as named, quantified lines on the handoff card @claim:pasted-ingredients-to-card', async ({ page }) => {
  await page.goto('/demo');
  await page.getByRole('textbox', { name: 'Paste ingredients' }).fill('750 g red lentils\n2 cans chopped tomatoes\n1 bunch cilantro');
  await page.getByRole('button', { name: 'Add ingredients' }).click();
  await expect(page.getByText('750 g', { exact: true })).toBeVisible();
  await expect(page.getByText('red lentils', { exact: true })).toBeVisible();
  await expect(page.getByText('2 can', { exact: true })).toBeVisible();
  await expect(page.getByText('chopped tomatoes', { exact: true })).toBeVisible();
  await expect(page.getByText('cilantro', { exact: true })).toBeVisible();
});

test('paste normalizes a recipe list and plain text copies it @claim:plain-text-export', async ({ page, context }) => {
  await context.grantPermissions(['clipboard-read', 'clipboard-write']);
  await page.goto('/demo');
  await page.getByRole('textbox', { name: 'Paste ingredients' }).fill('500 g noodles\n1 kg noodles\n2 tbsp olive oil');
  await page.getByRole('button', { name: 'Add ingredients' }).click();
  await expect(page.getByText('1.5 kg', { exact: true })).toBeVisible();
  await page.getByRole('button', { name: 'Copy plain text' }).click();
  await expect.poll(() => page.evaluate(() => navigator.clipboard.readText())).toContain('1.5 kg noodles');
});

test('saved local file leaves shopper notes out @claim:local-file-private', async ({ page }) => {
  await page.goto('/demo');
  await page.getByLabel(/Note for the shopper/).fill('Gate code 1234');
  await page.getByLabel(/Note for the shopper/).press('Tab');
  const download = page.waitForEvent('download');
  await page.getByRole('button', { name: 'Save local file' }).click();
  const file = await download;
  const text = await file.createReadStream().then(async stream => { const chunks: Buffer[] = []; for await (const part of stream) chunks.push(part); return Buffer.concat(chunks).toString('utf8'); });
  expect(text).toContain('shopping-list-handoff/v1');
  expect(text).not.toContain('Gate code 1234');
});

test('a local handoff file imports into a real list @claim:local-file-roundtrip', async ({ page }) => {
  await page.goto('/demo');
  const downloadPromise = page.waitForEvent('download');
  await page.getByRole('button', { name: 'Save local file' }).click();
  const path = await (await downloadPromise).path();
  expect(path).toBeTruthy();
  await page.goto('/');
  await page.locator('#import-file').setInputFiles(path!);
  await expect(page.getByLabel('List title')).toHaveValue('Wednesday pasta night');
  await expect(page.getByText('spaghetti', { exact: true })).toBeVisible();
  await expect(page.getByText('6 items opened from this device.')).toBeVisible();
});

test('print control invokes the browser print dialog and includes the shopper note @claim:print-sheet', async ({ page }) => {
  await page.goto('/demo');
  await page.evaluate(() => { window.print = () => document.body.dataset.printed = 'yes'; });
  await expect(page.getByRole('button', { name: 'Print shopping list' })).toHaveText(/Print shopping list/);
  await page.getByRole('button', { name: 'Print shopping list' }).click();
  await expect.poll(() => page.evaluate(() => document.body.dataset.printed)).toBe('yes');
  await page.emulateMedia({ media: 'print' });
  await expect(page.locator('.print-note')).toHaveText('Note for the shopper: Pick a ripe lemon. The basil can be loose.');
  await expect(page.locator('.print-note')).toBeVisible();
  await expect(page.getByLabel(/Note for the shopper/)).toBeHidden();
  await page.emulateMedia({ media: 'screen' });
});

test('routes set their own title, canonical URL, and share metadata', async ({ page }) => {
  const routes = [
    { path: '/', title: 'Shopping List Handoff — Hand off a shopping list', description: 'Turn pasted ingredients into a handoff card another shopper can use.', canonical: '/' },
    { path: '/demo', title: 'Demo — Shopping List Handoff', description: 'Open a sample pasta-night handoff card and check the item list.', canonical: '/demo' },
    { path: '/privacy', title: 'Privacy — Shopping List Handoff', description: 'Read how Shopping List Handoff keeps ingredient lists in this browser.', canonical: '/privacy' },
    { path: '/terms', title: 'Terms — Shopping List Handoff', description: 'Read the terms for this free local shopping-list tool.', canonical: '/terms' },
    { path: '/handoff#list=not-valid-data', title: 'Shared list — Shopping List Handoff', description: 'Check a shared shopping list in this browser without saving it.', canonical: '/handoff' }
  ];
  for (const route of routes) {
    await page.goto(route.path);
    await expect(page).toHaveTitle(route.title);
    await expect(page.locator('meta[name="description"]')).toHaveAttribute('content', route.description);
    await expect(page.locator('meta[property="og:title"]')).toHaveAttribute('content', route.title);
    await expect(page.locator('meta[property="og:description"]')).toHaveAttribute('content', route.description);
    await expect(page.locator('meta[name="twitter:title"]')).toHaveAttribute('content', route.title);
    await expect(page.locator('meta[name="twitter:description"]')).toHaveAttribute('content', route.description);
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href', `https://shopping-list-handoff.sociobot.in${route.canonical}`);
  }
});

test('QR opens a recipient list and excludes private fields @claim:qr-recipient @claim:qr-private', async ({ page, browser }) => {
  await page.goto('/demo');
  await page.getByLabel('List title').fill('Home address: 123 Oak Street');
  await page.getByLabel('List title').press('Tab');
  await page.getByLabel(/Note for the shopper/).fill('Gate code 1234');
  await page.getByLabel(/Note for the shopper/).press('Tab');
  await page.getByRole('button', { name: 'Make QR code' }).click();
  const pixels = await page.locator('#qr-canvas').evaluate(canvas => {
    const context = (canvas as HTMLCanvasElement).getContext('2d')!;
    return { data: Array.from(context.getImageData(0, 0, 240, 240).data), width: 240, height: 240 };
  });
  const result = jsQR(new Uint8ClampedArray(pixels.data), pixels.width, pixels.height);
  expect(result?.data).toMatch(/^http:\/\/127\.0\.0\.1:4173\/handoff#list=/);
  expect(result?.data).not.toContain('Gate code 1234');
  expect(result?.data).not.toContain('123 Oak Street');
  const recipient = await browser.newContext();
  const recipientPage = await recipient.newPage();
  const recipientRequests: string[] = [];
  recipientPage.on('request', request => recipientRequests.push(request.url()));
  await recipientPage.goto(result!.data);
  await expect(recipientPage.getByRole('heading', { name: 'Shop this handed-off list' })).toBeVisible();
  await expect(recipientPage.getByText('spaghetti', { exact: true })).toBeVisible();
  await expect(recipientPage.getByText('Gate code 1234')).toHaveCount(0);
  await expect(recipientPage.getByText('123 Oak Street')).toHaveCount(0);
  expect(await recipientPage.evaluate(() => Object.keys(localStorage))).toEqual([]);
  expect(recipientRequests.every(url => !url.includes('list=') && !url.includes('spaghetti'))).toBeTruthy();
  const scan = await new AxeBuilder({ page: recipientPage }).withTags(['wcag2a', 'wcag2aa']).analyze();
  expect(scan.violations.filter(v => ['serious', 'critical'].includes(v.impact || '')).map(v => v.id)).toEqual([]);
  await recipient.close();
});

test('a recipient can check items without saving the shared list @claim:recipient-checkable', async ({ page, browser }) => {
  await page.goto('/demo');
  await page.getByRole('button', { name: 'Make QR code' }).click();
  const href = await page.locator('#qr-link').getAttribute('href');
  const recipient = await browser.newContext();
  const recipientPage = await recipient.newPage();
  await recipientPage.goto(href!);
  const item = recipientPage.getByRole('checkbox').first();
  await item.focus();
  await item.press('Space');
  await expect(item).toBeChecked();
  expect(await recipientPage.evaluate(() => Object.keys(localStorage))).toEqual([]);
  await recipient.close();
});

test('an unreadable handoff link gives a recovery path', async ({ page }) => {
  await page.goto('/handoff#list=not-valid-data');
  await expect(page.getByRole('heading', { name: 'This handoff link is incomplete' })).toBeVisible();
  await expect(page.getByRole('link', { name: 'Make a new shopping list' })).toHaveAttribute('href', '/');
});

test('negative quantities are rejected with announced corrections', async ({ page }) => {
  await page.goto('/demo');
  await page.getByRole('spinbutton', { name: 'Amount' }).fill('-2');
  await page.getByRole('textbox', { name: 'Item' }).fill('sugar');
  await page.getByRole('button', { name: 'Add item' }).click();
  await expect(page.locator('#amount-error')).toHaveText('Amount must be between zero and 1,000,000. Check the number and try again.');
  await expect(page.getByRole('spinbutton', { name: 'Amount' })).toHaveAttribute('aria-invalid', 'true');
  await expect(page.getByText('sugar', { exact: true })).toHaveCount(0);

  await page.getByRole('textbox', { name: 'Paste ingredients' }).fill('-2 g sugar');
  await page.getByRole('button', { name: 'Add ingredients' }).click();
  await expect(page.locator('#paste-error')).toHaveText('Amounts must be zero or more. Fix line 1 and try again.');
  await expect(page.getByText('sugar', { exact: true })).toHaveCount(0);
});

test('blank item names get a visible announced error', async ({ page }) => {
  await page.goto('/demo');
  await page.getByRole('button', { name: 'Add item' }).click();
  await expect(page.locator('#name-error')).toHaveText('Add an item name.');
  await expect(page.getByRole('textbox', { name: 'Item' })).toHaveAttribute('aria-invalid', 'true');
  await expect(page.getByRole('textbox', { name: 'Item' })).toBeFocused();
});

test('normalizes compatible quantities and keeps uncertain count units visible @claim:quantity-normalization', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('textbox', { name: 'Paste ingredients' }).fill('500 g rice\n0.5 kg rice\n1 bunch basil\n1 bunch basil');
  await page.getByRole('button', { name: 'Add ingredients' }).click();
  await expect(page.getByText('1 kg', { exact: true })).toBeVisible();
  await expect(page.getByText('2 bunch', { exact: true })).toBeVisible();
  await expect(page.locator('.warning')).toContainText('cannot be converted');
});

test('keeps an entered cooking unit until a compatible merge needs conversion', async ({ page }) => {
  await page.goto('/demo');
  await page.getByRole('textbox', { name: 'Paste ingredients' }).fill('1 tsp cumin');
  await page.getByRole('button', { name: 'Add ingredients' }).click();
  await expect(page.getByText('2 tbsp', { exact: true })).toBeVisible();
  await expect(page.getByText('29.57 ml', { exact: true })).toHaveCount(0);

  await page.goto('/');
  await page.getByRole('textbox', { name: 'Paste ingredients' }).fill('2 tbsp olive oil\n1 tsp olive oil');
  await page.getByRole('button', { name: 'Add ingredients' }).click();
  await expect(page.getByText('2.33 tbsp', { exact: true })).toBeVisible();
});

test('rejects an overflowing amount before it can be saved', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('spinbutton', { name: 'Amount' }).fill('1e308');
  await page.getByRole('textbox', { name: 'Unit' }).fill('kg');
  await page.getByRole('textbox', { name: 'Item' }).fill('boundary sugar');
  await page.getByRole('button', { name: 'Add item' }).click();
  await expect(page.locator('#amount-error')).toContainText('1,000,000');
  await expect(page.getByText('Infinity kg', { exact: false })).toHaveCount(0);
  await page.locator('#import-file').setInputFiles({ name: 'overflow.shopping-list.json', mimeType: 'application/json', buffer: Buffer.from(JSON.stringify({ items: [{ amount: 1e308, unit: 'kg', name: 'imported sugar' }] })) });
  await expect(page.getByText('That file has no readable shopping items. Check quantities and choose a handoff JSON file.')).toBeVisible();
  await expect(page.getByText('imported sugar', { exact: true })).toHaveCount(0);
});

test('empty lists cannot create a broken QR handoff', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('button', { name: 'Make QR code' }).click();
  await expect(page.getByText('Add an item first, then make a QR code.')).toBeVisible();
  await expect(page.locator('#qr-canvas')).toHaveCount(0);
});

test('checked items can be restored and return to every handoff export', async ({ page, context }) => {
  await context.grantPermissions(['clipboard-read', 'clipboard-write']);
  await page.goto('/demo');
  const item = page.getByRole('checkbox').first();
  await item.focus();
  await item.press('Space');
  const toggle = page.getByRole('button', { name: 'Show 1 checked item' });
  await expect(toggle).toBeFocused();
  await toggle.press('Enter');
  const restored = page.getByRole('checkbox').first();
  await expect(restored).toBeChecked();
  await restored.press('Space');
  await expect(page.getByText('spaghetti', { exact: true })).toBeVisible();
  await page.getByRole('button', { name: 'Copy plain text' }).click();
  await expect.poll(() => page.evaluate(() => navigator.clipboard.readText())).toContain('spaghetti');
  await page.getByRole('button', { name: 'Make QR code' }).click();
  await expect(page.locator('#qr-link')).toHaveAttribute('href', /spaghetti|list=/);
  const download = page.waitForEvent('download');
  await page.getByRole('button', { name: 'Save local file' }).click();
  const exported = await (await download).createReadStream().then(async stream => { const chunks: Buffer[] = []; for await (const chunk of stream) chunks.push(chunk); return Buffer.concat(chunks).toString('utf8'); });
  expect(exported).toContain('spaghetti');
});

test('removing an item is undoable, announced, persisted, and returns keyboard focus', async ({ page }) => {
  await page.goto('/demo');
  const remove = page.getByRole('button', { name: 'Remove spaghetti' });
  await remove.focus();
  await remove.press('Enter');
  await expect(page.getByText('spaghetti', { exact: true })).toHaveCount(0);
  const undo = page.getByRole('button', { name: 'Undo removal' });
  await expect(page.locator('.undo-notice')).toContainText('spaghetti removed from this list.');
  await expect(undo).toBeFocused();
  expect(await page.evaluate(() => localStorage.getItem('slh:demo:list'))).not.toContain('spaghetti');
  await undo.click();
  await expect(page.getByText('spaghetti', { exact: true })).toBeVisible();
  await expect(page.getByRole('checkbox').first()).toBeFocused();
  await page.reload();
  await expect(page.getByText('spaghetti', { exact: true })).toBeVisible();
});

test('demo storage is separate from real-list storage @claim:local-only', async ({ page }) => {
  const requests: string[] = [];
  page.on('request', request => requests.push(request.url()));
  await page.goto('/demo');
  const keys = await page.evaluate(() => Object.keys(localStorage));
  expect(keys).toContain('slh:demo:list');
  expect(keys).not.toContain('slh:real:list');
  expect(requests.every(url => new URL(url).origin === 'http://127.0.0.1:4173')).toBeTruthy();
});

test('a complete populated handoff sends no list, note, or device data to a server @claim:local-data-private', async ({ page }) => {
  const requests: { url: string; body: string | null }[] = [];
  page.on('request', request => requests.push({ url: request.url(), body: request.postData() }));
  await page.goto('/demo');
  await page.getByLabel('List title').fill('Private household 17');
  await page.getByLabel('List title').press('Tab');
  await page.getByLabel(/Note for the shopper/).fill('Gate code 1234');
  await page.getByLabel(/Note for the shopper/).press('Tab');
  await page.getByRole('button', { name: 'Copy plain text' }).click();
  await page.getByRole('button', { name: 'Make QR code' }).click();
  await page.getByRole('button', { name: 'Save local file' }).click();
  const observed = JSON.stringify(requests);
  expect(observed).not.toContain('Private household 17');
  expect(observed).not.toContain('Gate code 1234');
  expect(requests.every(request => request.body === null && new URL(request.url).origin === 'http://127.0.0.1:4173')).toBeTruthy();
});

test('clearing browser site data removes saved real and demo lists @claim:site-data-clear', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('textbox', { name: 'Item' }).fill('real oats');
  await page.getByRole('textbox', { name: 'Item' }).press('Enter');
  await page.goto('/demo');
  await page.getByRole('textbox', { name: 'Item' }).fill('demo fennel');
  await page.getByRole('textbox', { name: 'Item' }).press('Enter');
  expect(await page.evaluate(() => Object.keys(localStorage).sort())).toEqual(['slh:demo:list', 'slh:real:list']);
  await page.evaluate(() => localStorage.clear());
  expect(await page.evaluate(() => Object.keys(localStorage))).toEqual([]);
  await page.goto('/');
  await expect(page.getByText('real oats', { exact: true })).toHaveCount(0);
  await expect(page.getByText('demo fennel', { exact: true })).toHaveCount(0);
  await expect(page.getByText('Your handoff card will appear here.')).toBeVisible();
});

test('works offline after the first visit @claim:offline-reload', async ({ page, context }) => {
  await page.goto('/demo');
  await page.evaluate(() => navigator.serviceWorker.ready);
  await page.reload();
  await context.setOffline(true);
  await page.reload();
  await expect(page.getByRole('heading', { name: 'Wednesday pasta night handoff' })).toBeVisible();
  await context.setOffline(false);
});

test('small screen remains usable and keyboard can add an item', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/');
  await page.getByRole('button', { name: 'Try it with sample data' }).click();
  await expect(page.getByRole('button', { name: 'Copy plain text' })).toBeVisible();
  await page.getByRole('textbox', { name: 'Item' }).fill('oats');
  await page.getByRole('textbox', { name: 'Item' }).press('Enter');
  await expect(page.getByText('oats', { exact: true })).toBeVisible();
});

test('the first mobile screen includes all three plain-language facts', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/');
  for (const fact of await page.locator('.facts li').all()) {
    const box = await fact.boundingBox();
    expect(box?.y).toBeGreaterThanOrEqual(0);
    expect((box?.y || 0) + (box?.height || 0)).toBeLessThanOrEqual(844);
  }
});

test('start for real accurately acknowledges a saved real list', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('textbox', { name: 'Item' }).fill('oats');
  await page.getByRole('textbox', { name: 'Item' }).press('Enter');
  await page.getByRole('button', { name: 'Try it with sample data' }).click();
  await page.getByRole('button', { name: 'Start for real' }).click();
  await expect(page.getByText('Your saved real list is ready.')).toBeVisible();
  await expect(page.getByText('oats', { exact: true })).toBeVisible();
});

test('routes announce their heading and restore focus with browser history', async ({ page }) => {
  await page.goto('/');
  await page.evaluate(() => window.scrollTo(0, 1200));
  await expect.poll(() => page.evaluate(() => window.scrollY)).toBeGreaterThanOrEqual(1200);
  await page.getByLabel('Main navigation').getByRole('link', { name: 'Privacy' }).evaluate((link: HTMLElement) => link.click());
  await expect(page.getByRole('heading', { name: 'How Shopping List Handoff stores data' })).toBeFocused();
  await expect(page.locator('#route-announcement')).toHaveText('How Shopping List Handoff stores data.');
  await expect(page.getByRole('link', { name: 'How it works' })).toHaveAttribute('href', '/#how');
  await page.goBack();
  await expect(page.getByRole('heading', { name: 'Hand off a clear shopping list' })).toBeFocused();
  await expect(page.locator('#route-announcement')).toHaveText('Hand off a clear shopping list.');
  await expect.poll(() => page.evaluate(() => window.scrollY)).toBeGreaterThanOrEqual(1190);
});

test('mobile reflows at 200 percent text size and keeps all footer links touch-sized', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/demo');
  await page.evaluate(() => { document.documentElement.style.fontSize = '200%'; });
  await expect.poll(() => page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(390);
  for (const link of await page.getByRole('contentinfo').getByRole('link').all()) {
    const box = await link.boundingBox();
    expect(box?.width).toBeGreaterThanOrEqual(44);
    expect(box?.height).toBeGreaterThanOrEqual(44);
  }
});

test('mobile controls meet target size and checklist focus is visible', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/demo');
  for (const control of [page.getByRole('button', { name: 'Reset demo' }), page.getByRole('button', { name: 'Start for real' }), page.getByRole('button', { name: 'Remove spaghetti' })]) {
    const box = await control.boundingBox();
    expect(box?.width).toBeGreaterThanOrEqual(44);
    expect(box?.height).toBeGreaterThanOrEqual(44);
  }
  const checkbox = page.getByRole('checkbox').first();
  await checkbox.focus();
  const focus = await checkbox.evaluate(element => {
    const tick = element.nextElementSibling as HTMLElement;
    const style = getComputedStyle(tick);
    return { width: style.outlineWidth, style: style.outlineStyle, color: style.outlineColor };
  });
  expect(focus).toEqual({ width: '3px', style: 'solid', color: 'rgb(159, 48, 39)' });
  await checkbox.press('Space');
  await expect(page.getByRole('button', { name: 'Show 1 checked item' })).toBeVisible();
});

test('unknown paths return the designed HTTP 404', async ({ page }) => {
  const response = await page.goto('/missing-release-check');
  expect(response?.status()).toBe(404);
  await expect(page).toHaveTitle('Page not found — Shopping List Handoff');
  await expect(page.getByRole('heading', { name: 'This page was not found' })).toBeVisible();
  await expect(page.getByRole('link', { name: 'Back to Shopping List Handoff' })).toHaveAttribute('href', '/');
  await expect(page.getByRole('banner').getByLabel('Main navigation')).toBeVisible();
  await expect(page.getByRole('contentinfo')).toContainText('Built by Param Factory');
  await expect(page.locator('meta[name="description"]')).toHaveAttribute('content', /shopping-list page is missing/i);
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href', 'https://shopping-list-handoff.sociobot.in/404');
  await expect(page.locator('link[rel="icon"]')).toHaveAttribute('href', '/favicon.svg');
  await expect(page.locator('link[rel="apple-touch-icon"]')).toHaveAttribute('href', '/apple-touch-icon.png');
  await expect(page.locator('meta[property="og:title"]')).toHaveAttribute('content', 'Page not found — Shopping List Handoff');
  await expect(page.locator('meta[property="og:description"]')).toHaveAttribute('content', /shopping-list page is missing/i);
  await expect(page.locator('meta[name="twitter:title"]')).toHaveAttribute('content', 'Page not found — Shopping List Handoff');
  const config = JSON.parse(await readFile('public/staticwebapp.config.json', 'utf8'));
  expect(config.navigationFallback).toBeUndefined();
  expect(config.routes.filter((route: { rewrite?: string }) => route.rewrite === '/index.html').map((route: { route: string }) => route.route)).toEqual(['/demo', '/privacy', '/terms', '/handoff']);
});

test('a new service-worker revision replaces the offline shell', async ({ browser }) => {
  let revision = 'one';
  const server = createServer((request, response) => {
    response.setHeader('Cache-Control', 'no-store');
    if (request.url === '/service-worker.js') {
      response.setHeader('Content-Type', 'text/javascript');
      response.end(renderServiceWorker(revision, ['/']));
      return;
    }
    response.setHeader('Content-Type', 'text/html');
    response.end(`<!doctype html><p id="revision">${revision}</p><script>navigator.serviceWorker.register('/service-worker.js')</script>`);
  });
  await new Promise<void>(resolve => server.listen(0, '127.0.0.1', resolve));
  const address = server.address();
  if (!address || typeof address === 'string') throw new Error('fixture server did not start');
  const context = await browser.newContext();
  const page = await context.newPage();
  try {
    await page.goto(`http://127.0.0.1:${address.port}/`);
    await page.evaluate(() => navigator.serviceWorker.ready);
    await page.reload();
    await expect(page.locator('#revision')).toHaveText('one');
    revision = 'two';
    await page.evaluate(async () => {
      const registration = await navigator.serviceWorker.getRegistration();
      if (!registration) throw new Error('missing registration');
      const changed = new Promise<void>((resolve, reject) => {
        const timeout = window.setTimeout(() => reject(new Error('worker update timed out')), 5000);
        navigator.serviceWorker.addEventListener('controllerchange', () => { window.clearTimeout(timeout); resolve(); }, { once: true });
      });
      await registration.update();
      await changed;
    });
    await context.setOffline(true);
    await page.reload();
    await expect(page.locator('#revision')).toHaveText('two');
    expect(await page.evaluate(() => caches.keys())).toEqual(['slh-two']);
  } finally {
    await context.setOffline(false);
    await context.close();
    await new Promise<void>((resolve, reject) => server.close(error => error ? reject(error) : resolve()));
  }
});

test('public routes have no serious accessibility violations or console errors', async ({ page }) => {
  const errors: string[] = [];
  page.on('console', message => { if (message.type() === 'error' && !message.text().includes('server responded with a status of 404')) errors.push(message.text()); });
  page.on('pageerror', error => errors.push(error.message));
  for (const route of ['/', '/demo', '/privacy', '/terms', '/handoff', '/missing-accessibility-check']) {
    await page.goto(route);
    const scan = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa']).analyze();
    expect(scan.violations.filter(v => ['serious', 'critical'].includes(v.impact || '')).map(v => v.id), route).toEqual([]);
  }
  expect(errors).toEqual([]);
});
