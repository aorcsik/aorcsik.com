const dayjs = require("dayjs");
const relativeTime = require('dayjs/plugin/relativeTime');
const { readFile } = require("./tools");
const MarkdownIt = require('markdown-it');

dayjs.extend(relativeTime)

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
   * @param {BlogPage} page1
   * @param {BlogPage} page2
   * @returns {number}
   */
  static compare(page1, page2) {
    if (page1.published_at > page2.published_at) return 1;
    if (page1.published_at < page2.published_at) return -1;
    return 0;
  }

  /**
   * @param {BlogPage} page1
   * @param {BlogPage} page2
   * @returns {number}
   */
  static compareReverse(page1, page2) {
    return -1 * BlogPage.compare(page1, page2);
  }

  /**
   * @param {string} markdownContent 
   * @param {string} markdownPath
   */
  constructor(markdownContent, markdownPath) {
    const titleMatch = markdownContent.toString().match(/## (.*)/);
    if (!titleMatch) throw new Error("Invalid Blog Post - Missing title");

    /** @type {string} */
    this.title = titleMatch[1].split("|")[0];
    if (titleMatch[1].split("|").length > 1) {
      this.subtitle = titleMatch[1].split("|")[1];
    } else {
      this.subtitle = null;
    }
    markdownContent = markdownContent.replace(titleMatch[0], "");

    const metaDataMatch = markdownContent.toString().match(/### (.*)/);
    if (!metaDataMatch) throw new Error("Invalid Blog Post - Missing meta data");

    /** @type {string} */
    this.author = metaDataMatch[1].split("|")[0].trim();
    /** @type {dayjs.Dayjs} */
    this.published_at = dayjs(metaDataMatch[1].split("|")[1].trim());
    markdownContent = markdownContent.replace(metaDataMatch[0], "");
    if (metaDataMatch[1].split("|").length > 2) {
      this.tags = metaDataMatch[1].split("|")[2].split(",").map(tag => tag.trim());
    } else {
      this.tags = [];
    }

    const md = new MarkdownIt({html: true});
    /** @type {string} */
    this.content = md.render(markdownContent.toString());
    /** @type {string} */
    this.url = markdownPath.replace(/\.md$/, ".html");
    /** @type {number} */
    this.readingTime = this.calculateReadingTime(markdownContent.toString());
    /** @type {boolean} */
    this.draft = !!markdownPath.match(/^draft/);
  }

  /**
   * @param {string} text
   * @returns {number}
   */
  calculateReadingTime(text) {
    text = text.replace(/<[^>]+>/, "");
    const wpm = 225;
    const words = text.trim().split(/\s+/).length;
    return Math.ceil(words / wpm);
  }
}

module.exports = BlogPage;