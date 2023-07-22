const http = require('http');
const fs = require('fs');
const path = require('path');
const ejs = require('ejs');
const { Buffer } = require('node:buffer');
const pages = require('./pages');

const hostname = '127.0.0.1';
const port = 3000;

/**
 * @param {string} filePath 
 * @returns {Promise<Buffer>}
 */
async function readFile(filePath) {
  return new Promise((resolve, reject) => {
    fs.readFile(filePath, (error, content) => {
      if (error) reject(error);
      resolve(content);
    });
  });
}

/**
 * 
 * @param {string} templatePath 
 * @param {ejs.Data} data 
 * @param {ejs.Options} options 
 * @returns {Promise<string>}
 */
async function renderTemplate(templatePath, data, options) {
  return new Promise((resolve, reject) => {
    ejs.renderFile(templatePath, data, options, function(err, str){
      if (err) reject(err);
      resolve(str);
    });
  });
}

/**
 * @param {http.IncomingMessage} req 
 * @param {http.ServerResponse} res
 */
const handleRequest = async (req, res) => {
  const url = new URL("http://" + req.hostname + req.url);
  const filePath = './docs' + url.pathname + (url.pathname.match(/\/$/) ? "index.html" : "");
  const extname = path.extname(filePath);

  if (extname == ".html") {
    try {

      const templateName = filePath.replace(/^\.\/docs\//, "").replace(/.html$/, "");
      const templatePath = `./src/ejs/${templateName}.ejs`;
      const content = await renderTemplate(templatePath, {
        common: pages.common,
        page: pages[templateName],
      });
      res.statusCode = 200;
      res.setHeader('Content-Type', "text/html");
      res.end(content);
      return;

    } catch (error) {
      console.log(error);
    }
  }

  try {

    const content = await readFile(filePath);
    res.statusCode = 200;
    if (extname == ".js")   res.setHeader('Content-Type', "text/javascript");
    if (extname == ".css")  res.setHeader('Content-Type', "text/css");
    if (extname == ".png")  res.setHeader('Content-Type', "image/png");
    if (extname == ".jpg")  res.setHeader('Content-Type', "image/jpeg");
    if (extname == ".gif")  res.setHeader('Content-Type', "image/gif");
    if (extname == ".webp") res.setHeader('Content-Type', "image/webp");
    if (extname == ".svg")  res.setHeader('Content-Type', "image/svg+xml");
    if (extname == ".html") res.setHeader('Content-Type', "text/html");
    res.end(content);
    return;

  } catch (error) {

    res.end(`<script>console.error("Server error: ${error.message}");</script>`);
    return;

  }
};

const server = http.createServer(handleRequest);
server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});