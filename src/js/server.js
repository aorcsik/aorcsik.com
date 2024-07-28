const http = require('http');
const fs = require('fs');
const path = require('path');
const { readFile, renderTemplate, getPages } = require('./tools');
const MarkdownIt = require('markdown-it');
const BlogPage = require('./BlogPage');
const md = new MarkdownIt({html: true});
const express = require('express');
const webpack = require('webpack');
const devMiddleware = require('webpack-dev-middleware');
const hotMiddleware = require('webpack-hot-middleware');
const webpackConfig = require('../../webpack.dev.js');

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
  
  const url = new URL("http://" + req.hostname + req.url);
  const filePath = config.webDir + url.pathname + (url.pathname.match(/\/$/) ? "index.html" : "");
  const extname = path.extname(filePath);

  let context = {...config};

  if (extname == ".html") {
    context.blogPages = [];
    const blogPages = await getPages(`${config.markdownDir}/blog`);
    for (let blogPagePath of blogPages.filter(path => !path.match(/README\.md$/))) {
      try {
        context.blogPages.push(await BlogPage.fromFile(config, `blog/${blogPagePath}`));
      } catch (err) {
        console.log(err);
      }
    }
    const draftBlogPages = await getPages(`${config.markdownDir}/draft`);
    for (let draftBlogPagePath of draftBlogPages.filter(path => !path.match(/README\.md$/))) {
      try {
        context.blogPages.push(await BlogPage.fromFile(config, `draft/${draftBlogPagePath}`));
      } catch (err) {
        console.log(err);
      }
    }

    context.blogPages.sort(BlogPage.compareReverse);

    try {

      let templateName = filePath.replace(`${config.webDir}/`, "").replace(/.html$/, "");

      try {
        const blogPage = await BlogPage.fromFile(config, `${templateName}.md`);
        context = {...context, ...blogPage};
        templateName = "_blog_post";
      } catch (error) {
        
      }

      const templatePath = `${config.templateDir}/${templateName}.ejs`;
      const content = await renderTemplate(templatePath, {context: {...context, bundle: ["client"]}});
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
    return;

  }
};

const compiler = webpack(webpackConfig);
const devMiddlewareOptions = {
  // writeToDisk: true,
};
const app = express();

app.use(devMiddleware(compiler, devMiddlewareOptions));
if (webpackConfig.mode === 'development') app.use(hotMiddleware(compiler));

app.get(/\/.*/, handleRequest);

app.listen(port, hostname, () => {
  process.stdout.write(`Server running at http://${hostname}:${port}/\n`);
});