const fs = require('fs');
const http = require('http');
const path = require('path');

const root = __dirname;
const port = process.env.PORT || 4173;
const contentTypes = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8'
};

http
  .createServer((req, res) => {
    const requestPath = req.url.split('?')[0] === '/' ? '/index.html' : req.url.split('?')[0];
    const filePath = path.normalize(path.join(root, requestPath));

    if (!filePath.startsWith(root)) {
      res.writeHead(403);
      res.end('Forbidden');
      return;
    }

    fs.readFile(filePath, (error, data) => {
      if (error) {
        res.writeHead(404);
        res.end('Not found');
        return;
      }

      res.writeHead(200, {
        'Content-Type': contentTypes[path.extname(filePath)] || 'application/octet-stream'
      });
      res.end(data);
    });
  })
  .listen(port, () => {
    console.log(`Frontend preview running at http://localhost:${port}`);
  });
