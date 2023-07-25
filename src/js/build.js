const fs = require('fs');
const { readFile, renderTemplate, writeFile } = require('./tools');

const templateDir = "./src/ejs";

/**
 * @param {string} templateDir
 * @returns {Promise<string[]>}
 */
async function getPages(templateDir) {
  return new Promise((resolve, reject) => {
    fs.readdir(templateDir, function (err, files) {
      if (err) reject(err);
      resolve(files.filter(filename => filename[0] != "_"));
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

  pages.forEach(async (page) => {
    try {

      const templatePath = `${config.templateDir}/${page}`;
      const targetFile = `${config.webDir}/${page.replace(/\.ejs$/, ".html")}`;
      const content = await renderTemplate(templatePath, { config: config });
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
