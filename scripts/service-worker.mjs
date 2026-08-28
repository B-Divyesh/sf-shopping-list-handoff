import { createHash } from 'node:crypto';
import { readdir, readFile, writeFile } from 'node:fs/promises';
import { join, relative, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

export function renderServiceWorker(revision, shell) {
  return `const CACHE = 'slh-${revision}';
const PREFIX = 'slh-';
const SHELL = ${JSON.stringify(shell)};
const APP_ROUTES = new Set(['/', '/demo', '/privacy', '/terms', '/handoff']);
self.addEventListener('install', event => event.waitUntil(caches.open(CACHE).then(cache => cache.addAll(SHELL)).then(() => self.skipWaiting())));
self.addEventListener('activate', event => event.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(key => key.startsWith(PREFIX) && key !== CACHE).map(key => caches.delete(key)))).then(() => self.clients.claim())));
self.addEventListener('fetch', event => {
  if (event.request.method !== 'GET') return;
  const url = new URL(event.request.url);
  if (url.origin !== location.origin) return;
  if (event.request.mode === 'navigate') {
    event.respondWith(fetch(event.request).then(response => {
      if (response.ok && APP_ROUTES.has(url.pathname)) caches.open(CACHE).then(cache => cache.put(url.pathname, response.clone()));
      return response;
    }).catch(async () => (await caches.match(url.pathname)) || (APP_ROUTES.has(url.pathname) ? caches.match('/') : caches.match('/404.html'))));
    return;
  }
  event.respondWith(caches.match(event.request).then(hit => hit || fetch(event.request).then(response => {
    if (response.ok) caches.open(CACHE).then(cache => cache.put(event.request, response.clone()));
    return response;
  })));
});
`;
}

async function files(dir) {
  const entries = await readdir(dir, { withFileTypes: true });
  const nested = await Promise.all(entries.map(entry => entry.isDirectory() ? files(join(dir, entry.name)) : [join(dir, entry.name)]));
  return nested.flat();
}

async function build() {
  const root = resolve(fileURLToPath(new URL('..', import.meta.url)));
  const dist = join(root, 'dist');
  const outputFiles = (await files(dist)).filter(file => !file.endsWith('service-worker.js')).sort();
  const hash = createHash('sha256');
  for (const file of outputFiles) { hash.update(relative(dist, file)); hash.update(await readFile(file)); }
  const revision = hash.digest('hex').slice(0, 12);
  const staticFiles = outputFiles.map(file => `/${relative(dist, file).replaceAll('\\', '/')}`).filter(path => !['/index.html', '/staticwebapp.config.json'].includes(path));
  const shell = [...new Set(['/', '/demo', '/privacy', '/terms', '/handoff', ...staticFiles])];
  await writeFile(join(dist, 'service-worker.js'), renderServiceWorker(revision, shell));
  console.log(`service worker ${revision}: ${shell.length} shell URLs`);
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) build();
