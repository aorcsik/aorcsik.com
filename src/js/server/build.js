const { getPages, readFile, writeFile } = require('./tools');
const { renderHtml } = require('./common');

const basePath = "https://aorcsik.com";

/**
 * @param {string} configPath 
 */
async function buildPages(configPath) {
  /** @type {import('./tools').Config} */
  const config = JSON.parse(await readFile(configPath));

  const markdownPages = await getPages(config.markdownDir);
  for (let page of markdownPages) {
    if (page.match(/\/README.md$/)) continue;

    try {
      const content = await renderHtml(config, `/${page.replace(/\.md$/, "")}`, basePath, true);
      if (content !== null) {
        (await writeFile(`${config.webDir}/${page.replace(/\.md$/, ".html")}`, content)).forEach((result) => {
          process.stdout.write(`+ ${result}\n`);
        });
      }
    } catch (error) {
      console.log(error);
    }
  }

  const pages = await getPages(config.templateDir);
  for (let page of pages) {
    try {
      const content = await renderHtml(config, `/${page.replace(/\.md$/, "")}`, basePath, true);
      if (content !== null) {
        (await writeFile(`${config.webDir}/${page.replace(/\.ejs$/, ".html")}`, content)).forEach((result) => {
          process.stdout.write(`+ ${result}\n`);
        });
      }
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
