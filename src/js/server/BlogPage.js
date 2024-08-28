const ejs = require('ejs');
const YAML = require('yaml');
const dayjs = require("dayjs");
const relativeTime = require('dayjs/plugin/relativeTime');
const { readFile, renderTemplate} = require("./tools");
const { calculateReadingTime } = require("./shared");
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
    let markdownString;
    if (config.preview && config.preview.filename === markdownPath) {
      markdownString = config.preview.content;
    } else {
      const markdownContent = await readFile(`${config.markdownDir}${markdownPath}`);
      markdownString = markdownContent.toString();
    }
    return await BlogPage.parseMarkdownContent(config, markdownString, markdownPath);
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
   * @param {string} markdownString 
   * @param {string} markdownPath
   * @returns {Promise<BlogPage>}
   */
  static async parseMarkdownContent(config, markdownString, markdownPath) {
    const data = new BlogPage();
    data.rawContent = markdownString;

    let metaData;
    const metaDataYamlMatch = markdownString.match(/^---(.*?)---/s);
    if (metaDataYamlMatch) {
      markdownString = markdownString.replace(metaDataYamlMatch[0].trim(), '');
      metaData = YAML.parse(metaDataYamlMatch[1]);
    }

    const metaDataJsonMatch = markdownString.match(/<!--\s+(\{.*?\})\s+-->/s);
    if (metaDataJsonMatch) {
      markdownString = markdownString.replace(metaDataJsonMatch[0], '');
      metaData = JSON.parse(metaDataJsonMatch[1]);
    }

    if (!metaData) {
      throw new Error(`Invalid Blog Post (${markdownPath}) - Missing meta data`);
    }

    Object.keys(metaData).forEach(key => {
      if (key === 'published_at') {
        data[key] = dayjs(metaData[key]);
      } else {
        data[key] = metaData[key];
      }
    });

    data.readingTime = calculateReadingTime(markdownString);

    const imageMatches = markdownString.matchAll(/!\[(.*?)\]\((https?:\/\/.*?)(\s+"(.*?)")?\)/gm);
    if (imageMatches) {
      (await Promise.all([...imageMatches].map(async imageMatch => {
        return [imageMatch[0], await renderTemplate(`${config.templateDir}/_blog_image.ejs`, {
            imageUrl: imageMatch[2],
            imageTitle: imageMatch[1],
            imageAlt: imageMatch[4] || null,
          })
        ];
      }))).map(([match, image]) => {
        markdownString = markdownString.replace(match, image);
      });
    }

    const videoMatches = markdownString.matchAll(/\[(.*?)\]\(https:\/\/youtu\.be\/(.*?)#embed\)/gm);
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
    data.path = `${markdownPath.replace(/\.md$/, ".html")}`;

    return data;
  }

  constructor() {
    /** @type {string} */
    this.rawContent = '';

    /** @type {string} */
    this.title = '';

    /** @type {string} */
    this.subtitle = '';

    /** @type {string} */
    this.description = '';

    /** @type {string} */
    this.author = '';

    /** @type {dayjs.Dayjs} */
    this.published_at = '';

    /** @type {string[]} */
    this.tags = [];

    /** @type {string} */
    this.content = '';

    /** @type {string} */
    this.path = '';

    /** @type {number?} */
    this.readingTime = null;

    /** @type {boolean} */
    this.draft = false;

    /** @type {string?} */
    this.image = null;
  }
}

module.exports = BlogPage;