const ejs = require('ejs');
const fs = require('fs');
const { Buffer } = require('node:buffer');

/**
 * @typedef {{
 *  gtmID: string;
 *  webDir: string;
 *  favicon: string;
 *  templateDir: string;
 *  markdownDir: string;
 *  avatars: {
 *    [user: string]: string;
 *  };
 * }} Config
 */

/**
 * 
 * @param {string} templatePath 
 * @param {ejs.Data} data 
 * @param {ejs.Options} options 
 * @returns {Promise<string>}
 */
async function renderTemplate(templatePath, data, options) {
  return new Promise((resolve, reject) => {
    ejs.renderFile(templatePath, data, options, function(err, str){
      if (err) reject(err);
      resolve(str);
    });
  });
}

/**
 * @param {string} filePath 
 * @returns {Promise<Buffer>}
 */
async function readFile(filePath) {
  return fs.promises.readFile(filePath);
}

/**
 * 
 * @param {string} filePath 
 * @param {string} content
 * @param {string} createDirectory
 * @returns {Promise<string[]>}
 */
async function writeFile(filePath, content, createDirectory=true) {
  const results = [];
  if (createDirectory) {
    const createDirectoryResult = await fs.promises.mkdir(filePath.split("/").slice(0, -1).join("/"), { recursive: true });
    if (createDirectoryResult) results.push(`D ${createDirectoryResult}`);
  }
  await fs.promises.writeFile(filePath, content);
  results.push(`F ${filePath}`);
  return results;
}

/**
 * @param {string} templateDir
 * @returns {Promise<string[]>}
 */
async function getPages(templateDir) {
  return new Promise((resolve, reject) => {
    fs.readdir(templateDir, async (err, files) => {
      if (err) return reject(err);

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

module.exports = {
  readFile: readFile,
  renderTemplate: renderTemplate,
  writeFile: writeFile,
  getPages: getPages,
};