import { getReadPercentage, getScrollValue } from "./common";
import { calculateReadingTime, countWords } from "../server/shared";

import "../../css/editor.css";

const contentScrollHandler = () => {
  const editorScrollValue = document.querySelector(".editor-content").scrollTop;
  const editorContentHeight = document.querySelector(".editor-content pre").offsetHeight;
  const editorContainerHeight = document.querySelector(".editor-content").offsetHeight;

  const readPercentage = getReadPercentage(editorScrollValue, editorContentHeight, editorContainerHeight);

  document.querySelectorAll("iframe").forEach((iframe) => {
    /** @type {Window} */
    const iframeWindow = iframe.contentWindow || iframe;

    const iframeContainerHeight = iframeWindow.innerHeight;
    const iframeContentHeight = iframeWindow.document.querySelector("body").clientHeight;
    const iframeScrollValue = getScrollValue(readPercentage, iframeContentHeight, iframeContainerHeight);

    iframeWindow.scrollTo(0, iframeScrollValue);
  });
};

let savedContent = null;
let isLoading = 0;
const updateStatus = () => {
  const markdownText = document.getElementById("content").innerText;

  let status = "saved";
  if (isLoading > 0) {
    status = "loading";
  } else if (savedContent !== markdownText) {
    status = "changed";
  } else {
    status = "saved";
  }

  document.querySelector(".container").className = document.querySelector(".container").className.replaceAll(/( status-loading| status-saved| status-changed)/gm, "");
  document.querySelector(".container").className += ` status-${status}`;

  if (status === "loading" || status === "saved") {
    document.querySelector("form.editor-container button[name=save]").setAttribute("disabled", true);
  } else {
    document.querySelector("form.editor-container button[name=save]").removeAttribute("disabled");
  }

  return status;
};

/**
 * 
 * @param {HTMLElement} editableContent 
 * @returns {Range}
 */
const getRange = (editableContent) => {
  if (window.getSelection) {
    const sel = window.getSelection();
    if (sel.rangeCount) {
      const range = sel.getRangeAt(0);
      if (range.commonAncestorContainer.parentNode == editableContent) {
        return range;
      }
    }
  }
  return null;
}

let iframeId = (new Date()).getTime();
let changeThrottle = null;
const changeHandler = (event) => {

  /* fix Grammarly blend mode issue with dark content */ 
  // document.querySelectorAll("grammarly-extension").forEach((gE) => {
  //   const styleNode = document.createElement("style");
  //   styleNode.textContent = `
  //     div[data-grammarly-part="highlight"] { 
  //       mix-blend-mode: normal !important; 
  //     }
  //   `;
  //   gE.shadowRoot.appendChild(styleNode);
  // });


  const editableContent = document.getElementById("content");
  const styleContent = document.getElementById("contentStyle");
  const linesContent = document.getElementById("contentLines");

  const editorInfo = {
    line: 0,
    column: 0,
    wordCount: 0,
    readingTime: 0,
  };

  let markdownText = editableContent.innerText;

  const selection = getRange(editableContent);
  if (selection) {
    let charCount = 0;
    markdownText.split("\n").forEach((l, idx) => {
      const line = `${l}\n`;
      const lineStart = charCount;
      const lineEnd = charCount + line.length;
      if (selection.startOffset >= lineStart && selection.startOffset < lineEnd) {
        // console.log("start:", idx, selection.startOffset - lineStart, line);
      }
      if (selection.endOffset >= lineStart && selection.endOffset < lineEnd) {
        // console.log("end:", idx, selection.endOffset - lineStart, line);
        editorInfo.line = idx + 1;
        editorInfo.column = selection.endOffset - lineStart + 1;
      }
      charCount = lineEnd;
    });
  }

  if (!savedContent) savedContent = markdownText;

  updateStatus();

  const markupMap = {
    "*": "<span class='mdAsterisk'></span>",
    "_": "<span class='mdUnderscore'></span>",
    "#": "<span class='mdHashmark'></span>",
    ">": "<span class='mdGreaterThan'></span>",
    "-": "<span class='mdDash'></span>",
    "=": "<span class='mdEqual'></span>",
    "~": "<span class='mdTilde'></span>",
    "`": "<span class='mdBacktick'></span>",
    "newline": "<span class='mdNewLine'></span>",
    "heading": "<span class='mdHeading'>%%</span>",
    "em": "<span class='mdEm'>%%</span>",
    "strong": "<span class='mdStrong'>%%</span>",
    "strikethrough": "<span class='mdStrikethrough'>%%</span>",
    "quote": "<span class='mdQuote'>%%</span>",
    "list": "<span class='mdList'>%%</span>",
    "list_bullet": "<span class='mdListBullet'>%%</span>",
    "link": "<span class='mdLink'>[<span class='mdLinkText'>%1</span>](<span class='mdLinkUrl'>%2</span><span class='mdLinkTitle'>%3</span>)</span>",
    "code": "<span class='mdCode'>%%</span>",
    "code_block": "<span class='mdCodeBlock'>%%</span>",
    "html": "<span class='mdHtml'>%%</span>",
    "hr": "<span class='mdHr'>%%</span>",
  };

  markdownText = markdownText.replaceAll("<", "&lt;").replaceAll(">", "&gt;");

  const gutterSize = `${markdownText.split("\n").length}`.length;
  linesContent.innerHTML = markdownText.split("\n").map((line, idx) => {
    return `<span class='mdLine${editorInfo.line - 1 === idx ? ' mdLineActive' : ''}'>` + 
      `<span class='mdLineNumber' style='width: ${gutterSize}ch;'>${idx + 1}</span>` +
      `<span class='mdLineContent'>${line}</span>` +
    "</span>";
  }).slice(0, -1).join("\n") + "\n";
  styleContent.style.paddingLeft = `${gutterSize + 1}ch`;
  editableContent.style.paddingLeft = `${gutterSize + 1}ch`;

  let frontMatter = '';
  const mdFrontMatterMatch = markdownText.match(/---.*?---\n/ms);
  if (mdFrontMatterMatch) {
    frontMatter = `<span class='mdFrontMatter'>${mdFrontMatterMatch[0]}</span>`;
    markdownText = markdownText.replace(mdFrontMatterMatch[0], '');
  }

  editorInfo.wordCount = countWords(markdownText);
  editorInfo.readingTime = calculateReadingTime(markdownText);

  const mdHeadingMatch = markdownText.matchAll(/^(#{1,6})(\s+.*)/gm);
  if (mdHeadingMatch) [...mdHeadingMatch].forEach(match => {
    const markup = match[1].split("").map((m) => markupMap[m]).join("");
    markdownText = markdownText.replace(match[0], markupMap.heading.replace("%%", `${markup}${match[2]}`));
  });

  const mdHeadingMatch2 = markdownText.matchAll(/^(.*\n)(-+\n|=+\n)/gm);
  if (mdHeadingMatch2) [...mdHeadingMatch2].forEach(match => {
    const markup = match[2].replaceAll("=", markupMap["="]).replaceAll("-", markupMap["-"]);
    markdownText = markdownText.replace(match[0], markupMap.heading.replace("%%", `${match[1]}${markup}`));
  });

  const mdHrMatch = markdownText.matchAll(/^(___+|---+|\*\*\*+)/gm);
  if (mdHrMatch) [...mdHrMatch].forEach(match => {
    const markup = match[1].split("").map((m) => markupMap[m]).join("");
    markdownText = markdownText.replace(match[0], markupMap.hr.replace("%%", `${markup}`));
  });

  const mdCodeBlockMatch = markdownText.matchAll(/(```)(\s*[^\s]?)(.*?)\1\n/gms);
  if (mdCodeBlockMatch) [...mdCodeBlockMatch].forEach(match => {
    const markup = match[1].split("").map((m) => markupMap[m]).join("");
    console.log(match);
    markdownText = markdownText.replaceAll(match[0], markupMap.code_block.replace("%%", `${markup}${match[2] || ''}${match[3]}${markup}`));
  });

  const mdCodeMatch = markdownText.matchAll(/(`)(.+?)\1/gms);
  if (mdCodeMatch) [...mdCodeMatch].forEach(match => {
    if (match[2].match(/\n\n/)) return;
    const markup = match[1].split("").map(m => markupMap[m]).join("");
    markdownText = markdownText.replace(match[0], markupMap.code.replace("%%", `${markup}${match[2]}${markup}`));
  });

  const mdLinkMatch = markdownText.matchAll(/!?\[([^\]]+?)\]\(([^\s]+?)(\s+".*?")?\)/gm);
  if (mdLinkMatch) [...mdLinkMatch].forEach(match => {
    markdownText = markdownText.replaceAll(match[0], markupMap.link
      .replace("%1", match[1])
      .replace("%2", match[2])
      .replace("%3", match[3] || '')
    );
  });

  const mdQuoteMatch = markdownText.matchAll(/^([ \t]*)(&gt;(\s*&gt;)*)(.*?\n\n)/gms);
  if (mdQuoteMatch) [...mdQuoteMatch].forEach(match => {
    const markup = match[2].replaceAll("&gt;", markupMap['>']);
    const content = match[4].split("\n").map((line) => {
      const lineQuoteMarkerMatch = line.match(/^([ \t]*)(&gt;(\s*&gt;)*)/);
      if (lineQuoteMarkerMatch) {
        line = line.replace(lineQuoteMarkerMatch[0], lineQuoteMarkerMatch[0].replaceAll("&gt;", markupMap['>']));
      }
      return line;
    }).join("\n");
    markdownText = markdownText.replace(match[0], `${match[1]}${markupMap.quote.replace("%%", `${markup}${content}`)}`);
  });

  const listMatch = (markdownText) => {
    const mdListMatch = markdownText.matchAll(/^([ \t]*)(\*|\+|-|\d+\.)(\s+.*?\n\n)/gms);
    if (mdListMatch) [...mdListMatch].forEach(match => {
      let content = match[3];
      if (content.match(/^([ \t]*)(\*|\+|-|\d+\.)(\s+.*?\n\n)/ms)) content = listMatch(content);
      const markup =  markupMap.list_bullet.replace("%%", markupMap[match[2]] ? markupMap[match[2]] : match[2]);
      markdownText = markdownText.replace(match[0], `${match[1]}${markupMap.list.replace("%%", `${markup}${content}`)}`);
    });
    return markdownText;
  }
  markdownText = listMatch(markdownText);

  const mdStrikethroughMatch = markdownText.matchAll(/(~~)(.+?)\1/gms);
  if (mdStrikethroughMatch) [...mdStrikethroughMatch].forEach(match => {
    if (match[2].match(/\n\n/)) return;
    const markup = match[1].split("").map(m => markupMap[m]).join("");
    markdownText = markdownText.replace(match[0], markupMap.strikethrough.replace("%%", `${markup}${match[2]}${markup}`));
  });
  
  const mdStrongMatch = markdownText.matchAll(/(\*\*|__)(.+?)\1/gms);
  if (mdStrongMatch) [...mdStrongMatch].forEach(match => {
    if (match[2].match(/\n\n/)) return;
    const markup = match[1].split("").map(m => markupMap[m]).join("");
    markdownText = markdownText.replace(match[0], markupMap.strong.replace("%%", `${markup}${match[2]}${markup}`));
  });

  const mdEmMatch = markdownText.matchAll(/(\*|_)(.+?)\1/gms);
  if (mdEmMatch) [...mdEmMatch].forEach(match => {
    if (match[2].match(/\n\n/)) return;
    const markup = match[1].split("").map(m => markupMap[m]).join("");
    markdownText = markdownText.replace(match[0], markupMap.em.replace("%%", `${markup}${match[2]}${markup}`));
  });

  const mdHtmlMatch = markdownText.matchAll(/&lt;[\w/].*?&gt;/gm);
  if (mdHtmlMatch) [...mdHtmlMatch].forEach(match => {
    let content = match[0];
    const attributeMatch = match[0].matchAll(/([^\s]+=)((['"]).*?\3)/gm);
    if (attributeMatch) [...attributeMatch].forEach((attrMatch) => {
      content = content.replaceAll(attrMatch[0], `<span class='mdHtmlAttrName'>${attrMatch[1]}</span><span class='mdHtmlAttrValue'>${attrMatch[2]}</span>`);
    });
    markdownText = markdownText.replace(match[0], markupMap.html.replace("%%", content));
  });

  markdownText = markdownText.replaceAll(/\n/gms, `${markupMap.newline}\n`);

  document.getElementById("contentStyle").innerHTML = frontMatter + markdownText;
  document.querySelector(".editor-footer").innerHTML = `
    Ln ${editorInfo.line}, Col ${editorInfo.column} |
    ${editorInfo.wordCount} words | 
    ${editorInfo.readingTime} minute${editorInfo.readingTime > 1 ? "s" : ""}
  `;

  window.clearTimeout(changeThrottle);
  changeThrottle = window.setTimeout(() => { 
    let markdownText = document.getElementById("content").innerText;
    if (document.querySelector("form.editor-container input[name=content]").value !== markdownText) {
      document.querySelector("form.editor-container input[name=content]").value = markdownText;

      isLoading++;
      updateStatus();

      const newIframe = document.createElement("iframe");
      newIframe.setAttribute("name", `temp_iframe_${iframeId}`);
      document.querySelector(".preview-container").appendChild(newIframe);
      window.iframeLoaded = () => {
        const iframeName = document.querySelector("form.editor-container").getAttribute('target');
        document.querySelector(`iframe[name="${iframeName}"]`).style.opacity = 1;
        document.querySelectorAll("iframe").forEach(iframe => {
          if (iframe.getAttribute("name") < iframeName) {
            iframe.remove();
          }
        });
    
        isLoading--;
        updateStatus();
        contentScrollHandler();
      };

      newIframe.addEventListener("error", (event) => {
        console.log(error);
      });

      document.querySelector("form.editor-container").setAttribute("target", `temp_iframe_${iframeId}`);
      iframeId = (new Date()).getTime();
      document.querySelector("form.editor-container").submit();
    }

  }, 250);
};

changeHandler();

const submitHandler = (event) => {
  if (event.submitter.name === "save") {
    savedContent = event.target.content.value;
    // changeHandler();
  }
};

const saveHandéer = () => {
  let markdownText = document.getElementById("content").innerText;
  document.querySelector("form.editor-container input[name=content]").value = markdownText;
  savedContent = markdownText;
};

let separatorDragging = false;

const separatorDragStartHandler = (event) => {
  separatorDragging = true;
  document.querySelector("body").className += " dragging";
};

const separatorDragHandler = (event) => {
  if (separatorDragging) {
    let percentage = event.pageX / window.innerWidth * 100;
    if (percentage > 49 && percentage < 51) percentage = 50;
    document.querySelector(".editor-container").style.width = `${percentage}%`;
  }
};

const separatorDragStopHandler = (event) => {
  if (separatorDragging) {
    separatorDragging = false;
    document.querySelector("body").className = document.querySelector("body").className.replaceAll(" dragging", "");
  }
};

"focus keyup paste input click".split(" ").forEach(eventType => document.getElementById("content").addEventListener(eventType, changeHandler));
document.querySelector("form.editor-container").addEventListener("submit", submitHandler);
// document.querySelector("button[name=save]").addEventListener("click", saveHandéer);
document.querySelector(".editor-content").addEventListener("scroll", contentScrollHandler);
document.querySelector(".separator").addEventListener("mousedown", separatorDragStartHandler);
window.addEventListener("mousemove", separatorDragHandler);
window.addEventListener("mouseup", separatorDragStopHandler);

document.getElementById("content").focus();

if (import.meta.webpackHot) {
  import.meta.webpackHot.dispose(() => {
    "focus keyup paste input click".split(" ").forEach(eventType => document.getElementById("content").removeEventListener(eventType, changeHandler));
    document.querySelector("form.editor-container").removeEventListener("submit", submitHandler);
    // document.querySelector("button[name=save]").removeEventListener("click", saveHandéer);
    document.querySelector(".editor-content").removeEventListener("scroll", contentScrollHandler);
    document.querySelector(".separator").removeEventListener("mousedown", separatorDragStartHandler);
    window.removeEventListener("mousemove", separatorDragHandler);
    window.removeEventListener("mouseup", separatorDragStopHandler);
  });
  import.meta.webpackHot.accept();
}