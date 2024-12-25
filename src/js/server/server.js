const http = require('http');
const path = require('path');
const { readFile, renderTemplate, writeFile } = require('./tools');
const { renderHtml } = require('./common');
const express = require('express');
const webpack = require('webpack');
const devMiddleware = require('webpack-dev-middleware');
const hotMiddleware = require('webpack-hot-middleware');
const webpackConfig = require('../../../webpack.dev.js');

const hostname = '127.0.0.1';
const port = 3000;

let configPath = "";
if (process.argv[2] && process.argv[2] === '--config' && process.argv[3]) {
  configPath = process.argv[3];
} else {
  throw Error("Missing configuration!");
}


/**
 * @param {http.IncomingMessage} req 
 * @param {http.ServerResponse} res
 */
const handleRequest = async (req, res) => {
  /** @type {import('./tools').Config} */
  const config = JSON.parse(await readFile(configPath));
  
  const url = new URL(`${req.protocol}://${req.hostname}${req.url}`);
  const filePath = url.pathname + (url.pathname.match(/\/$/) ? "index.html" : "");
  const extname = path.extname(filePath);

  if (extname == ".html") {
    let templateName = filePath.replace(/\.html$/, "");

    let content;
    if (req.query.edit) {
      let rawContent;
      try {
        rawContent = await readFile(`${config.markdownDir}/${templateName}.md`);
      } catch (error) {
        rawContent = `---
title: Title
published_at: ${(new Date()).toISOString().split("T")[0].replaceAll("-", ".")}
author: aorcsik
draft: true
---

...
`;
      }

      content = await renderTemplate(`${config.templateDir}/editor.ejs`, {context: {
        debug: req.query.debug,
        rawContent: rawContent,
        path: `${templateName}.html`,
        filename: `${templateName}.md`,
        bundle: ["editor"]
      }});
    } else {
      content = await renderHtml(config, templateName, `${req.protocol}://${req.hostname}:${port}`);
    }

    res.statusCode = 200;
    res.setHeader('Content-Type', "text/html");
    res.end(content);
    return;
  }

  try {

    const content = await readFile(config.webDir + filePath);
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

    try {

      const content = await renderTemplate("./src/ejs/404.ejs", {context: {...config, bundle: ["client"]}});
      res.statusCode = 404;
      res.end(content);
      return;

    } catch (error) {
      console.log(error);
    }

    res.statusCode = 500;
    res.end(`<script>console.error("Server error: ${error.message}");</script>`);
  }
};

const compiler = webpack(webpackConfig);
const devMiddlewareOptions = {
  // writeToDisk: true,
};
const app = express();

app.use(express.urlencoded());

app.use(devMiddleware(compiler, devMiddlewareOptions));
if (webpackConfig.mode === 'development') app.use(hotMiddleware(compiler));

app.get(/\/.*/, handleRequest);

const handlePreview = async (req, res) => {
  /** @type {import('./tools').Config} */
  const config = JSON.parse(await readFile(configPath));

  config.preview = {
    filename: req.body.filename,
    content: req.body.content,
    saved: false,
  };

  if (req.body.save) {
    const targetFile = `${config.markdownDir}${req.body.filename}`;
    process.stdout.write(`Saving ${targetFile}: `);
    writeFile(targetFile, req.body.content.replaceAll("\r\n", "\n"));
    process.stdout.write(`ok\n`);
    config.preview.saved = true;
  }

  let templateName = req.body.filename.replace(/\.md$/, "");
  let content = await renderHtml(config, templateName, `${req.protocol}://${req.hostname}:${port}`);

  res.statusCode = 200;
  res.setHeader('Content-Type', "text/html");
  res.end(content);
};

app.post(/\/preview.*/, handlePreview);

app.listen(port, hostname, () => {
  process.stdout.write(`Server running at http://${hostname}:${port}/\n`);
});