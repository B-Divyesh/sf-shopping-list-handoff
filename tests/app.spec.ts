import { expect, test } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import jsQR from 'jsqr';

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

test('QR handoff contains items but never shopper notes or list title @claim:qr-private', async ({ page }) => {
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
  expect(result?.data).toContain('spaghetti');
  expect(result?.data).not.toContain('Gate code 1234');
  expect(result?.data).not.toContain('123 Oak Street');
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

test('landing has no serious accessibility violations', async ({ page }) => {
  await page.goto('/');
  const scan = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa']).analyze();
  expect(scan.violations.filter(v => ['serious', 'critical'].includes(v.impact || '')).map(v => v.id)).toEqual([]);
});
