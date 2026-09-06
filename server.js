const http = require('http');
const fs = require('fs');
const path = require('path');

const root = __dirname;
const port = Number(process.env.PORT || 3000);
const types = {
  '.css': 'text/css; charset=utf-8',
  '.html': 'text/html; charset=utf-8',
  '.ico': 'image/x-icon',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.svg': 'image/svg+xml',
  '.txt': 'text/plain; charset=utf-8',
  '.webp': 'image/webp',
  '.xml': 'application/xml; charset=utf-8'
};

function resolveRequest(url) {
  let pathname;
  try {
    pathname = decodeURIComponent(new URL(url, 'http://localhost').pathname);
  } catch {
    return null;
  }
  if (pathname === '/') pathname = '/index.html';
  if (!path.extname(pathname)) pathname += '.html';
  const resolved = path.resolve(root, `.${pathname}`);
  return resolved.startsWith(root + path.sep) ? resolved : null;
}

const server = http.createServer((request, response) => {
  const file = resolveRequest(request.url || '/');
  if (!file) {
    response.writeHead(400).end('Bad Request');
    return;
  }
  fs.stat(file, (statError, stat) => {
    if (statError || !stat.isFile()) {
      response.writeHead(404, { 'Content-Type': 'text/html; charset=utf-8' });
      response.end('<!doctype html><meta charset="utf-8"><title>页面未找到</title><h1>页面未找到</h1><p><a href="/">返回首页</a></p>');
      return;
    }
    const extension = path.extname(file).toLowerCase();
    const headers = {
      'Content-Type': types[extension] || 'application/octet-stream',
      'X-Content-Type-Options': 'nosniff',
      'Referrer-Policy': 'strict-origin-when-cross-origin',
      'Cache-Control': extension === '.html' ? 'public, max-age=0, must-revalidate' : 'public, max-age=604800, immutable'
    };
    response.writeHead(200, headers);
    fs.createReadStream(file).pipe(response);
  });
});

server.listen(port, '0.0.0.0', () => {
  console.log(`SFHY website listening on port ${port}`);
});
