const fs = require('fs');
const { readFile, renderTemplate, writeFile } = require('./tools');

/**
 * 
 * @param {string} configPath 
 */
async function buildPages(configPath) {
  const config = JSON.parse(await readFile(configPath));
  const pages = JSON.parse(await readFile(config.pagesJson));

  Object.keys(pages).forEach(async (page) => {
    try {

      const templatePath = `./src/ejs/${page}.ejs`;
      const targetFile = `${config.webDir}/${page}.html`;
      const content = await renderTemplate(templatePath, {
        config: config,
        page: pages[page],
      });
      await writeFile(targetFile, content);
      console.log(targetFile);

    } catch (error) {
      console.log(error);
    }
  });  
}

if (process.argv[2] && process.argv[2] === '--config' && process.argv[3]) {
  buildPages(process.argv[3]);
} else {
  throw Error("Missing configuration!");
}
