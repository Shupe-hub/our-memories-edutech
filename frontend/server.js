import { createReadStream } from 'node:fs';
import { access, stat } from 'node:fs/promises';
import http from 'node:http';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), 'dist');
const port = Number(process.env.PORT || 4173);
const mimeTypes = new Map([
  ['.css', 'text/css; charset=utf-8'], ['.html', 'text/html; charset=utf-8'], ['.ico', 'image/x-icon'],
  ['.jpeg', 'image/jpeg'], ['.jpg', 'image/jpeg'], ['.js', 'text/javascript; charset=utf-8'],
  ['.json', 'application/json; charset=utf-8'], ['.png', 'image/png'], ['.svg', 'image/svg+xml'],
  ['.txt', 'text/plain; charset=utf-8'], ['.webp', 'image/webp'], ['.woff', 'font/woff'], ['.woff2', 'font/woff2'],
]);

if (!Number.isInteger(port) || port < 1 || port > 65535) throw new Error('PORT must be a valid TCP port number.');

async function serveFile(response, filePath, fallback = false, headOnly = false) {
  try {
    await access(filePath);
    const details = await stat(filePath);
    if (!details.isFile()) return false;
    response.writeHead(200, {
      'Content-Length': details.size,
      'Content-Type': mimeTypes.get(path.extname(filePath).toLowerCase()) || 'application/octet-stream',
      'Cache-Control': fallback ? 'no-cache' : 'public, max-age=31536000, immutable',
      'X-Content-Type-Options': 'nosniff',
    });
    if (headOnly) response.end();
    else createReadStream(filePath).pipe(response);
    return true;
  } catch (error) {
    if (error?.code === 'ENOENT' || error?.code === 'ENOTDIR') return false;
    throw error;
  }
}

const server = http.createServer(async (request, response) => {
  if (request.method !== 'GET' && request.method !== 'HEAD') {
    response.writeHead(405, { Allow: 'GET, HEAD' }).end();
    return;
  }
  try {
    const pathname = decodeURIComponent(new URL(request.url, 'http://localhost').pathname);
    const relativePath = pathname === '/' ? '/index.html' : pathname;
    const requested = path.resolve(root, `.${relativePath}`);
    if (!requested.startsWith(`${root}${path.sep}`) && requested !== path.join(root, 'index.html')) {
      response.writeHead(400).end();
      return;
    }
    let served = requested !== root && await serveFile(response, requested, false, request.method === 'HEAD');
    if (!served && path.extname(pathname)) {
      response.writeHead(404).end();
      return;
    }
    if (!served) served = await serveFile(response, path.join(root, 'index.html'), true, request.method === 'HEAD');
    if (!served) response.writeHead(503, { 'Content-Type': 'text/plain; charset=utf-8' }).end('Frontend build is unavailable.');
  } catch (error) {
    if (error instanceof URIError) response.writeHead(400).end();
    else {
      console.error('Frontend request failed.', { name: error?.name || 'Error' });
      if (!response.headersSent) response.writeHead(500).end();
      else response.destroy();
    }
  }
});

server.listen(port, '0.0.0.0', () => console.log(`Our Memories EduTech frontend listening on port ${port}.`));
server.on('error', (error) => {
  console.error('Frontend HTTP listener failed.', { code: typeof error?.code === 'string' ? error.code : 'UNKNOWN' });
  process.exitCode = 1;
});
