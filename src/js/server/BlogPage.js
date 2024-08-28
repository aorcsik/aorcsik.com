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
    data.path = `${markdownPath.replace(/\.md$/, ".html")}`;

    const md = new MarkdownIt({html: true});
    data.content = md.render(markdownString);

    const videoMatches = data.content.matchAll(/<p>\s*(<a[^>]+>)video<\/a>\s*<\/p>/gms);
    (await Promise.all([...videoMatches].map(videoMatch => {
      const propMatches = videoMatch[0].matchAll(/(href|title)="(.*?)"/gm);
      const video = {
        match: videoMatch[0],
        href: null,
        videoId: null,
        title: null,
        type: null,
      };
      [...propMatches].forEach(propMatch => {
        video[propMatch[1]] = propMatch[2];
        if (propMatch[1] === "href") {
          const youtubeIdMatch = propMatch[2].match(/https:\/\/youtu\.be\/([A-Za-z0-9_\-]{11})/);
          if (youtubeIdMatch) {
            video.videoId = youtubeIdMatch[1];
            video.type = "youtube";
          }
        }
      });
      return video;
    }).filter(video => {
      return video.type !== null && video.videoId !== null;
    }).map(async video => {
      return [video.match, await renderTemplate(`${config.templateDir}/_blog_video.ejs`, {
        videoType: video.type,
        videoId: video.videoId,
        videoTitle: video.title,
      })];
    }))).map(([match, video]) => {
      data.content = data.content.replace(match, video);
    });

    const imageMatches = data.content.matchAll(/<p>\s*(<img[^>]+>)\s*<\/p>/gms);
    (await Promise.all([...imageMatches].map(imageMatch => {
      const propMatches = imageMatch[0].matchAll(/(src|alt|title)="(.*?)"/gm);
      const image = {
        match: imageMatch[0],
        src: null,
        alt: null,
        title: null,
      };
      [...propMatches].forEach(propMatch => {
        image[propMatch[1]] = propMatch[2];
      });
      return image;
    }).filter(image => {
      return image.title !== null;
    }).map(async image => {
      return [image.match, await renderTemplate(`${config.templateDir}/_blog_image.ejs`, {
        imageUrl: image.src,
        imageAlt: image.alt,
        imageTitle: image.title,
      })];
    }))).map(([match, image]) => {
      data.content = data.content.replace(match, image);
    });

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