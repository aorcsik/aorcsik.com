const fs = require('fs');
const { getPages, readFile, renderTemplate, writeFile } = require('./tools');
const BlogPage = require('./BlogPage');


/**
 * @param {string} configPath 
 */
async function buildPages(configPath) {
  /** @type {import('./tools').Config} */
  const config = JSON.parse(await readFile(configPath));

  let context = {...config, basePath: "https://aorcsik.com"};
  
  context.blogPages = [];
  const blogPages = await getPages(`${config.markdownDir}/blog`);
  for (let blogPagePath of blogPages.filter(path => !path.match(/README\.md$/))) {
    const blogPage = await BlogPage.fromFile(config, `blog/${blogPagePath}`)
    if (!blogPage.draft) context.blogPages.push(blogPage);
  }

  context.blogPages.sort(BlogPage.compareReverse);

  const markdownPages = await getPages(config.markdownDir);
  for (let markdownPage of markdownPages) {
    if (markdownPage.match(/\/README.md$/)) continue;

    try {
      const directory = markdownPage.split("/").slice(0, -1).join("/");
      if (directory) {
        const targetDirectory = `${config.webDir}/${directory}`;
        const result = await fs.promises.mkdir(targetDirectory, { recursive: true });
        if (result) console.log("+", result);
      }

      if (directory == "blog") {
        const templatePath = `${config.templateDir}/_blog_post.ejs`;
        const blogPage = await BlogPage.fromFile(config, markdownPage);
        if (blogPage.collection) {
          context.pages = context.blogPages.filter(bP => bP.collection === blogPage.collection).sort(BlogPage.compare);
        }
        const content = await renderTemplate(templatePath, {context: {...context, ...blogPage, bundle: ['client']}});

        const targetFile = `${config.webDir}/${markdownPage.replace(/\.md$/, ".html")}`;
        await writeFile(targetFile, content);
        console.log("+", targetFile);
      }

    } catch (error) {
      console.log(error);
    }
  }

  const pages = await getPages(config.templateDir);
  for (let page of pages) {
    try {
      const directory = page.split("/").slice(0, -1).join("/");
      if (directory) {
        const targetDirectory = `${config.webDir}/${directory}`;
        const result = console.log(await fs.promises.mkdir(targetDirectory, { recursive: true }));
        if (result) console.log("+", result);
      }

      const templatePath = `${config.templateDir}/${page}`;
      context.path = `/${page.replace(/\.ejs$/, ".html")}`;
      const content = await renderTemplate(templatePath, {context: {...context, bundle: ["client"]}});

      const targetFile = `${config.webDir}${context.path}`;
      await writeFile(targetFile, content);
      console.log("+", targetFile);

    } catch (error) {
      console.log(error);
    }
  }
}

if (process.argv[2] && process.argv[2] === '--config' && process.argv[3]) {
  buildPages(process.argv[3]);
} else {
  throw Error("Missing configuration!");
}
