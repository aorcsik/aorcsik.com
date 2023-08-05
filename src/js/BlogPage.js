const { readFile } = require("./tools");
const MarkdownIt = require('markdown-it');

class BlogPage
{
  /**
   * @param {string} markdownDir 
   * @param {string} markdownPath 
   * @returns {Promise<BlogPage>}
   */
  static async fromFile(markdownDir, markdownPath) {
    let markdownContent = await readFile(`${markdownDir}/${markdownPath}`);
    return new BlogPage(markdownContent.toString(), markdownPath);
  }

  /**
   * @param {string} markdownContent 
   * @param {string} markdownPath
   */
  constructor(markdownContent, markdownPath) {
    const titleMatch = markdownContent.toString().match(/## (.*)/);
    /** @type {string} */
    this.title = titleMatch[1];
    markdownContent = markdownContent.replace(titleMatch[0], "");
    const metaDataMatch = markdownContent.toString().match(/### (.*)/);
    /** @type {string} */
    this.author = metaDataMatch[1].split("|")[0].trim();
    /** @type {Date} */
    this.published_at = new Date(metaDataMatch[1].split("|")[1].trim());
    markdownContent = markdownContent.replace(metaDataMatch[0], "");  
    const md = new MarkdownIt({html: true});
    /** @type {string} */
    this.content = md.render(markdownContent.toString());
    /** @type {string} */
    this.url = markdownPath.replace(/\.md$/, ".html");
  }
}

module.exports = BlogPage;