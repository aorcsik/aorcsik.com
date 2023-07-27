const fs = require('fs');
const { readFile, renderTemplate, writeFile } = require('./tools');

const templateDir = "./src/ejs";

/**
 * @param {string} templateDir
 * @returns {Promise<string[]>}
 */
async function getPages(templateDir) {
  return new Promise((resolve, reject) => {
    fs.readdir(templateDir, async (err, files) => {
      if (err) reject(err);

      const pages = [];
      for (let filename of files) {
        if (filename[0] !== "_") {
          const stats = fs.lstatSync(`${templateDir}/${filename}`);
          if (stats.isFile()) {
            pages.push(filename);
          } else if (stats.isDirectory()) {
            const pagesInDir = await getPages(`${templateDir}/${filename}`);
            for (let page of pagesInDir) {
              pages.push(`${filename}/${page}`);
            }
          }  
        }
      }

      resolve(pages);
    });
  });
}

/**
 * 
 * @param {string} configPath 
 */
async function buildPages(configPath) {
  const config = JSON.parse(await readFile(configPath));
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
      const content = await renderTemplate(templatePath, { config: config });
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
