import { expect, test } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import jsQR from 'jsqr';
import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';
import { renderServiceWorker } from '../scripts/service-worker.mjs';

test('demo opens with a ready handoff card without an account @claim:sample-demo @claim:no-account', async ({ page }) => {
  await page.goto('/demo');
  await expect(page.getByText('Demo — sample data, nothing is saved.')).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Hand off a clear shopping list' })).toBeVisible();
  await expect(page.getByText('spaghetti', { exact: true })).toBeVisible();
  await expect(page.getByRole('button', { name: 'Reset demo' })).toBeVisible();
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
  await expect(page.locator('#amount-error')).toHaveText('Amount must be zero or more. Check the number and try again.');
  await expect(page.getByRole('spinbutton', { name: 'Amount' })).toHaveAttribute('aria-invalid', 'true');
  await expect(page.getByText('sugar', { exact: true })).toHaveCount(0);

  await page.getByRole('textbox', { name: 'Paste ingredients' }).fill('-2 g sugar');
  await page.getByRole('button', { name: 'Add ingredients' }).click();
  await expect(page.locator('#paste-error')).toHaveText('Amounts must be zero or more. Fix line 1 and try again.');
  await expect(page.getByText('sugar', { exact: true })).toHaveCount(0);
});

test('demo has no third-party requests and uses a separate local key @claim:local-only', async ({ page }) => {
  const requests: string[] = [];
  page.on('request', request => requests.push(request.url()));
  await page.goto('/demo');
  const keys = await page.evaluate(() => Object.keys(localStorage));
  expect(keys).toContain('slh:demo:list');
  expect(keys).not.toContain('slh:real:list');
  expect(requests.every(url => new URL(url).origin === 'http://127.0.0.1:4173')).toBeTruthy();
});

test('works offline after the first visit @claim:offline-reload', async ({ page, context }) => {
  await page.goto('/demo');
  await page.evaluate(() => navigator.serviceWorker.ready);
  await page.reload();
  await context.setOffline(true);
  await page.reload();
  await expect(page.getByRole('heading', { name: 'Hand off a clear shopping list' })).toBeVisible();
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
  await expect(page.getByRole('heading', { name: 'This sheet is not here.' })).toBeVisible();
  await expect(page.getByRole('link', { name: 'Back to Shopping List Handoff' })).toHaveAttribute('href', '/');
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
  page.on('console', message => { if (message.type() === 'error') errors.push(message.text()); });
  page.on('pageerror', error => errors.push(error.message));
  for (const route of ['/', '/demo', '/privacy', '/terms']) {
    await page.goto(route);
    const scan = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa']).analyze();
    expect(scan.violations.filter(v => ['serious', 'critical'].includes(v.impact || '')).map(v => v.id), route).toEqual([]);
  }
  expect(errors).toEqual([]);
});
