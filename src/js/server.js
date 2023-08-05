const http = require('http');
const fs = require('fs');
const path = require('path');
const { readFile, renderTemplate, getPages } = require('./tools');
const MarkdownIt = require('markdown-it');
const BlogPage = require('./BlogPage');
const md = new MarkdownIt({html: true});

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
  let config = JSON.parse(await readFile(configPath));
  
  config.blogPages = [];
  const blogPages = await getPages(`${config.markdownDir}/blog`);
  for (let blogPagePath of blogPages) {
    config.blogPages.push(await BlogPage.fromFile(config.markdownDir, `blog/${blogPagePath}`));
  }

  const url = new URL("http://" + req.hostname + req.url);
  const filePath = config.webDir + url.pathname + (url.pathname.match(/\/$/) ? "index.html" : "");
  const extname = path.extname(filePath);

  if (extname == ".html") {
    try {

      let templateName = filePath.replace(`${config.webDir}/`, "").replace(/.html$/, "");

      try {
        const blogPage = await BlogPage.fromFile(config.markdownDir, `${templateName}.md`);
        config = {...config, ...blogPage};
        templateName = "_blog_post";
      } catch (error) {
        
      }

      const templatePath = `${config.templateDir}/${templateName}.ejs`;
      const content = await renderTemplate(templatePath, {context: {...config, bundle: ["client"]}});
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

const server = http.createServer(handleRequest);
server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});