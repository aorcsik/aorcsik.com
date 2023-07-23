const ejs = require('ejs');
const fs = require('fs');
const { Buffer } = require('node:buffer');

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
  return new Promise((resolve, reject) => {
    fs.readFile(filePath, (error, content) => {
      if (error) reject(error);
      resolve(content);
    });
  });
}

/**
 * 
 * @param {string} filePath 
 * @param {string} content 
 * @returns {Promise<void>}
 */
async function writeFile(filePath, content) {
  return new Promise((resolve, reject) => {
    fs.writeFile(filePath, content, (err) => {
      if (err) reject(err);
      resolve();
    });
  })
}

module.exports = {
  readFile: readFile,
  renderTemplate: renderTemplate,
  writeFile: writeFile,
};