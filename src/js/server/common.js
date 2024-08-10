const BlogPage = require('./BlogPage');
const { getPages, renderTemplate } = require('./tools');

/**
 * @param {import('./tools').Config} config
 * @param {boolean} skipDraft
 * @returns {Promise<BlogPage[]>}
 */
const getBlogPages = async (config, skipDraft=false) => {
  /** @type {BlogPage[]} */
  const blogPages = [];
  const blogPagePaths = await getPages(`${config.markdownDir}/blog`);
  for (let blogPagePath of blogPagePaths.filter(path => !path.match(/README\.md$/))) {
    try {
      const blogPage = await BlogPage.fromFile(config, `/blog/${blogPagePath}`);
      if (!skipDraft || !blogPage.draft) blogPages.push(blogPage);
    } catch (err) {
      console.log(err);
    }
  }
  return blogPages;
};

/**
 * @param {import('./tools').Config} config 
 * @param {string} templateName 
 * @param {string} basePath 
 * @param {boolean} skipDraft
 * @returns {Promise<string | null>}
 */
const renderHtml = async (config, templateName, basePath, skipDraft=false) => {
  let context = {...config, basePath: basePath};
  context.blogPages = await getBlogPages(config, skipDraft);
  context.blogPages.sort(BlogPage.compareReverse);

  try {

    try {
      const blogPage = await BlogPage.fromFile(config, `${templateName}.md`);

      if (blogPage.draft && skipDraft) return null;

      if (blogPage.collection) {
        context.pages = context.blogPages.filter(bP => bP.collection === blogPage.collection).sort(BlogPage.compare);

        let previous;
        let current;
        let next;
        context.pages.forEach((bP) => {
          if (bP.path === blogPage.path) {
            current = bP;
          } else if (current && !next) {
            next = bP;
            blogPage.next = next.path;
          } else if (!current) {
            previous = bP;
            blogPage.previous = previous.path;
          }
        });
      }
      context = {...context, ...blogPage};
      templateName = "/_blog_post";
    } catch (error) {
      // "ENOENT: no such file or directory" is expected when the page has no markdown file
      if (!error.message.match(/ENOENT: no such file or directory/)) throw error;
    }

    const templatePath = `${config.templateDir}${templateName}.ejs`;
    context.path = context.path || `${templateName}.html`;
    const content = await renderTemplate(templatePath, {context: {...context, bundle: ["client"]}});
    
    return content;

  } catch (error) {
    console.log(error);
  }

  return null;
};

module.exports = {
  renderHtml: renderHtml,
};