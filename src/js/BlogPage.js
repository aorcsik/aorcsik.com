const ejs = require('ejs');
const dayjs = require("dayjs");
const relativeTime = require('dayjs/plugin/relativeTime');
const { readFile, renderTemplate } = require("./tools");
const MarkdownIt = require('markdown-it');

dayjs.extend(relativeTime)

class BlogPage
{
  /**
   * @param {import('./tools').Config} config 
   * @param {string} markdownPath 
   * @returns {Promise<BlogPage>}
   */
  static async fromFile(config, markdownPath) {
    const markdownContent = await readFile(`${config.markdownDir}/${markdownPath}`);
    return await BlogPage.parseMarkdownContent(config, markdownContent, markdownPath);
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
   * @param {import('./tools').Config} config 
   * @param {string} markdownContent 
   * @param {string} markdownPath
   * @returns {Promise<BlogPage>}
   */
  static async parseMarkdownContent(config, markdownContent, markdownPath) {
    const data = new BlogPage();
    let markdownString = markdownContent.toString();

    const titleMatch = markdownString.match(/## (.*)/);
    if (!titleMatch) throw new Error("Invalid Blog Post - Missing title");
    data.title = titleMatch[1].trim();
    markdownString = markdownString.replace(titleMatch[0], "");

    const subtitleMatch = markdownString.match(/### (.*)/);
    if (subtitleMatch) {
      data.subtitle = subtitleMatch ? subtitleMatch[1].trim() : null
      markdownString = markdownString.replace(subtitleMatch[0], "");
    }

    const metaDataMatch = markdownString.match(/\[(.*?)\]\(#meta\)/);
    if (!metaDataMatch) throw new Error("Invalid Blog Post - Missing meta data");

    data.author = metaDataMatch[1].split("|")[0].trim();
    data.published_at = dayjs(metaDataMatch[1].split("|")[1].trim());
    markdownString = markdownString.replace(metaDataMatch[0], "");
    data.tags = [];
    if (metaDataMatch[1].split("|").length > 2) {
      data.tags = metaDataMatch[1].split("|")[2].split(",").map(tag => tag.trim());
    }

    const imageMatches = markdownString.matchAll(/!\[(.*?)\]\((https?:\/\/.*?)\)/gm);
    if (imageMatches) {
      (await Promise.all([...imageMatches].map(async imageMatch => {
        return [imageMatch[0], await renderTemplate(`${config.templateDir}/_blog_image.ejs`, {
            imageUrl: imageMatch[2],
            imageTitle: imageMatch[1],
          })
        ];
      }))).map(([match, image]) => {
        markdownString = markdownString.replace(match, image);
      });
    }


    const videoMatches = markdownString.matchAll(/\[(.*?)\]\(https:\/\/www\.youtube\.com\/embed\/(.*?)\)/gm);
    if (videoMatches) {
      (await Promise.all([...videoMatches].map(async videoMatch => {
        return [videoMatch[0], await renderTemplate(`${config.templateDir}/_blog_video.ejs`, {
            videoId: videoMatch[2],
            videoTitle: videoMatch[1],
          })
        ];
      }))).map(([match, video]) => {
        markdownString = markdownString.replace(match, video);
      });
    }

    const md = new MarkdownIt({html: true});
    data.content = md.render(markdownString);
    data.url = markdownPath.replace(/\.md$/, ".html");
    data.readingTime = BlogPage.calculateReadingTime(markdownString);
    data.draft = !!markdownPath.match(/^draft/);

    return data;
  }

  /**
   * @param {string} text
   * @returns {number}
   */
  static calculateReadingTime(text) {
    text = text.replace(/<[^>]+>/, "");
    const wpm = 225;
    const words = text.trim().split(/\s+/).length;
    return Math.ceil(words / wpm);
  }

  constructor() {}
}

module.exports = BlogPage;