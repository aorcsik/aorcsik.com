const fs = require('fs');
const { getPages, readFile, renderTemplate, writeFile } = require('./tools');


/**
 * @param {string} configPath 
 */
async function buildPages(configPath) {
  const config = JSON.parse(await readFile(configPath));
  config.blogPages = await getPages(`${config.templateDir}/blog`);

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
