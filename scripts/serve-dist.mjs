import { createReadStream } from 'node:fs';
import { stat } from 'node:fs/promises';
import { createServer } from 'node:http';
import { extname, join, normalize, resolve } from 'node:path';

const root = resolve('dist');
const port = Number(process.env.PORT || 4173);
const routes = new Set(['/', '/demo', '/privacy', '/terms', '/handoff']);
const types = { '.css': 'text/css', '.html': 'text/html; charset=utf-8', '.js': 'text/javascript', '.json': 'application/json', '.png': 'image/png', '.svg': 'image/svg+xml', '.webp': 'image/webp', '.xml': 'application/xml', '.txt': 'text/plain' };

createServer(async (request, response) => {
  const pathname = new URL(request.url || '/', 'http://localhost').pathname;
  let status = 200;
  let relativePath = routes.has(pathname) ? 'index.html' : pathname.replace(/^\/+/, '');
  let file = join(root, normalize(relativePath));
  try { if (!(await stat(file)).isFile()) throw new Error('not a file'); }
  catch { status = 404; file = join(root, '404.html'); }
  response.writeHead(status, { 'Content-Type': types[extname(file)] || 'application/octet-stream', 'Cache-Control': extname(file) === '.html' ? 'no-cache' : 'public, max-age=0' });
  if (request.method === 'HEAD') return response.end();
  createReadStream(file).pipe(response);
}).listen(port, '127.0.0.1', () => console.log(`dist available at http://127.0.0.1:${port}`));
