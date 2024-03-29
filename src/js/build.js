const fs = require('fs');
const { getPages, readFile, renderTemplate, writeFile } = require('./tools');
const BlogPage = require('./BlogPage');


/**
 * @param {string} configPath 
 */
async function buildPages(configPath) {
  const config = JSON.parse(await readFile(configPath));
  
  config.blogPages = [];
  const blogPages = await getPages(`${config.markdownDir}/blog`);
  for (let blogPagePath of blogPages) {
    config.blogPages.push(await BlogPage.fromFile(config.markdownDir, `blog/${blogPagePath}`));
  }

  const markdownPages = await getPages(config.markdownDir);
  for (let markdownPage of markdownPages) {
    try {

      const pagePath = markdownPage.split("/");
      let filename = pagePath.pop();
      const directory = pagePath.join("/");

      if (directory) {
        const targetDirectory = `${config.webDir}/${directory}`;
        await fs.promises.mkdir(targetDirectory, { recursive: true });
        console.log("+", targetDirectory);

        filename = `${directory}/${filename}`;
      }

      if (directory == "blog") {
        const blogPage = await BlogPage.fromFile(config.markdownDir, markdownPage);
        const targetFile = `${config.webDir}/${filename.replace(/\.md$/, ".html")}`;
        const content = await renderTemplate(`${config.templateDir}/_blog_post.ejs`, {context: {...config, bundle: ['client'], ...blogPage}});
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

      const templatePath = `${config.templateDir}/${page}`;
      const pagePath = page.split("/");
      let filename = pagePath.pop();
      const directory = pagePath.join("/");

      if (directory) {
        const targetDirectory = `${config.webDir}/${directory}`;
        await fs.promises.mkdir(targetDirectory, { recursive: true });
        console.log("+", targetDirectory);

        filename = `${directory}/${filename}`;
      }

      const targetFile = `${config.webDir}/${filename.replace(/\.ejs$/, ".html")}`;
      const content = await renderTemplate(templatePath, {context: {...config, bundle: ["client"]}});
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
