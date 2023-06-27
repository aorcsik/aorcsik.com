const http = require('http');
const fs = require('fs');
const path = require('path');

const hostname = '127.0.0.1';
const port = 3000;

const server = http.createServer((req, res) => {
  const url = new URL("http://" + req.hostname + req.url);
  const filePath = './docs/' + url.pathname;
  
  fs.readFile(filePath, (error, content) => {
    if (!error) {

      res.statusCode = 200;
      const extname = path.extname(filePath);
      if (extname == ".js")   res.setHeader('Content-Type', "text/javascript");
      if (extname == ".css")  res.setHeader('Content-Type', "text/css");
      if (extname == ".png")  res.setHeader('Content-Type', "image/png");
      if (extname == ".jpg")  res.setHeader('Content-Type', "image/jpeg");
      if (extname == ".gif")  res.setHeader('Content-Type', "image/gif");
      if (extname == ".webp") res.setHeader('Content-Type', "image/webp");
      if (extname == ".svg")  res.setHeader('Content-Type', "image/svg+xml");
      if (extname == ".html") res.setHeader('Content-Type', "text/html");
      res.end(content);

    } else {
      res.end(`<script>console.error("Server error: ${error.message}");</script>`);
    }
  });
});

server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});