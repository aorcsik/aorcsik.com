const fs = require('fs');
const path = require('path');
const ejs = require('ejs');
const pages = require('./pages');

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

Object.keys(pages).forEach(async (page) => {
  if (pages[page].title) {
    try {

      const templatePath = `./src/ejs/${page}.ejs`;
      const targetFile = `./docs/${page}.html`;
      const content = await renderTemplate(templatePath, {
        common: pages.common,
        page: pages[page],
      });
      fs.writeFile(targetFile, content, (err) => {
        if (err) throw err;
      });

    } catch (error) {
      console.log(error);
    }
  }
});
