import { getReadPercentage, getScrollValue } from "./common";
import { calculateReadingTime, countWords } from "../server/shared";

import "../../css/editor.css";

const contentId = "contentTextarea";

const getContent = () => {
  const editableContent = document.getElementById(contentId);
  if (editableContent.value) {
    return editableContent.value;
  }
  return editableContent.innerText.replace(/\n$/s, "");
};

const previewScrollMatcher = (editorScrollValue, editorContentHeight, editorContainerHeight) => {
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

const textareaContentScrollHandler = (event) => {
  const textareaContent = document.getElementById(contentId);
  const styleContent = document.getElementById("contentStyle");
  const linesContent = document.getElementById("contentLines");
  
  styleContent.parentNode.style.marginTop = `-${textareaContent.scrollTop}px`;
  linesContent.parentNode.style.marginTop = `-${textareaContent.scrollTop}px`;

  if (textareaContent.offsetHeight >= textareaContent.scrollHeight) {
    document.querySelector(".contentScrollbar").style.display = "none";
  } else {
    document.querySelector(".contentScrollbar").style.display = "block";
    document.querySelector(".contentScrollbar").style.height = `${textareaContent.offsetHeight / textareaContent.scrollHeight * textareaContent.offsetHeight}px`;
    document.querySelector(".contentScrollbar").style.top = `${textareaContent.scrollTop / (textareaContent.scrollHeight) * textareaContent.offsetHeight}px`;  
  }

  previewScrollMatcher(textareaContent.scrollTop, textareaContent.scrollHeight, textareaContent.offsetHeight);
};

let savedContent = null;
let updateStatusThrottle = null;
const updateStatus = () => {
  if (updateStatusThrottle) window.clearTimeout(updateStatusThrottle);
  updateStatusThrottle = window.setTimeout(() => {
    const markdownText = getContent();
    const isLoading = document.querySelectorAll(".preview-container iframe").length;

    let status;
    if (isLoading > 1) {
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
  }, 100);
};

/**
 * 
 * @param {HTMLElement} editableContent 
 * @returns {Range}
 */
const getRange = (editableContent) => {
  if (editableContent.selectionStart || editableContent.selectionStart === 0) {
    return {
      startOffset: editableContent.selectionStart,
      endOffset: editableContent.selectionEnd
    };
  }
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
  // document.querySelectorAll("grammarly-extension").forEach((gE) => {
  //   const styleNode = document.createElement("style");
  //   /* fix Grammarly blend mode issue with dark content */ 
  //   styleNode.textContent = `
  //     div[data-grammarly-part="highlight"] { 
  //       mix-blend-mode: normal !important; 
  //     }
  //   `;
  //   /* change grammarly tool position */
  //   styleNode.textContent = `
  //     div[data-grammarly-part="button"] > div > div { 
  //       position: fixed !important;
  //       top: auto !important;
  //       bottom: 10px !important;
  //     }
  //   `;
  //   gE.shadowRoot.appendChild(styleNode);
  // });

  const editableContent = document.getElementById(contentId);
  const styleContent = document.getElementById("contentStyle");
  const linesContent = document.getElementById("contentLines");

  if (event && event.relatedTarget && event.relatedTarget.tagName === "GRAMMARLY-POPUPS") {
    window.setTimeout(() => {
      editableContent.blur();
      window.setTimeout(() => {
        editableContent.focus();
      }, 5);
    }, 5);
  }

  const editorInfo = {
    line: 0,
    column: 0,
    wordCount: 0,
    readingTime: 0,
  };

  let markdownText = getContent();

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
    "space": "<span class='mdSpace'> </span>",

    "heading": "<span class='mdHeading'>%%</span>",
    "em": "<span class='mdEm'>%%</span>",
    "strong": "<span class='mdStrong'>%%</span>",
    "strikethrough": "<span class='mdStrikethrough'>%%</span>",
    "quote": "<span class='mdQuote'>%%</span>",
    "list": "<span class='mdList'>%%</span>",
    "list_bullet": "<span class='mdListBullet'>%%</span>",
    "link": "<span class='mdLink'><span class='mdLinkText'>%1</span><span class='mdLinkParams'><span class='mdLinkUrl'>%2</span><span class='mdLinkTitle'>%3</span></span></span>",
    "linkRef": "<span class='mdLink'><span class='mdLinkText'>%1</span><span class='mdLinkRef'>%2</span></span>",
    "image": "<span class='mdLink mdImage'><span class='mdLinkText'>%1</span><span class='mdLinkParams'><span class='mdLinkUrl'>%2</span><span class='mdLinkTitle'>%3</span></span></span>",
    "imageRef": "<span class='mdLink mdImage'><span class='mdLinkText'>%1</span><span class='mdLinkRef'>%2</span></span>",
    "reference": "<span class='mdReference'><span class='mdLinkRef'>%1</span>%2<span class='mdLinkUrl'>%3</span><span class='mdLinkTitle'>%4</span></span>",
    "code": "<span class='mdCode'>%%</span>",
    "code_block": "<span class='mdCodeBlock'>%%</span>",
    "html": "<span class='mdHtml'>%%</span>",
    "hr": "<span class='mdHr'>%%</span>",
    "comment": "<span class='mdComment'><span class='mdCommentStart'></span>%%<span class='mdCommentEnd'></span></span>",
  };

  markdownText = markdownText.replaceAll("<", "&lt;").replaceAll(">", "&gt;");

  const gutterSize = `${markdownText.split("\n").length}`.length;
  linesContent.innerHTML = markdownText.split("\n").map((line, idx) => {
    return `<span class='mdLine${editorInfo.line - 1 === idx ? ' mdLineActive' : ''}'>` + 
      `<span class='mdLineNumber' style='width: ${gutterSize}ch;'>${idx + 1}</span>` +
      `<span class='mdLineContent'>${line}</span>` +
    "</span>";
  }).join("\n");
  styleContent.style.paddingLeft = `${gutterSize + 1}ch`;
  editableContent.style.paddingLeft = `${gutterSize + 1}ch`;

  let frontMatter = '';
  const mdFrontMatterMatch = markdownText.match(/(---)(.*?)(---\n)/ms);
  if (mdFrontMatterMatch) {
    let frontMatterContent = mdFrontMatterMatch[2];
    const recordsMatch = frontMatterContent.matchAll(/(\s*.*?:|\s*-\s+)(.*\n)/gm);
    if (recordsMatch) [...recordsMatch].forEach(match => {
      frontMatterContent = frontMatterContent.replace(match[0], 
        `<span class='mdFrontMatterRecordName'>${match[1]}</span>` +
        `<span class='mdFrontMatterRecordValue'>${match[2]}</span>`
      );
    });
    frontMatter = "<span class='mdFrontMatter'>" +
      mdFrontMatterMatch[1].replaceAll("-", markupMap['-']) +
      frontMatterContent +
      mdFrontMatterMatch[3].replaceAll("-", markupMap['-']) +
    "</span>";
    markdownText = markdownText.replace(mdFrontMatterMatch[0], '');
  }

  editorInfo.wordCount = countWords(markdownText);
  editorInfo.readingTime = calculateReadingTime(markdownText);

  const comments = [];
  const mdCommentMatch = markdownText.matchAll(/&lt;!--(.*?)--&gt;/gms);
  if (mdCommentMatch) [...mdCommentMatch].forEach(match => {
    markdownText = markdownText.replaceAll(match[0], `{comment:${comments.length}}`);
    comments.push(markupMap.comment.replace("%%", match[1]));
  });

  const mdHeadingMatch = markdownText.matchAll(/^(#{1,6})(\s+.*)/gm);
  if (mdHeadingMatch) [...mdHeadingMatch].forEach(match => {
    const markup = match[1].split("").map((m) => markupMap[m]).join("");
    markdownText = markdownText.replace(match[0], markupMap.heading.replace("%%", `${markup}${match[2]}`));
  });

  const mdHeadingMatch2 = markdownText.matchAll(/^(\s*[^\s]+\n)(-+\n|=+\n)/gm);
  if (mdHeadingMatch2) [...mdHeadingMatch2].forEach(match => {
    const markup = match[2].replaceAll("=", markupMap["="]).replaceAll("-", markupMap["-"]);
    markdownText = markdownText.replace(match[0], markupMap.heading.replace("%%", `${match[1]}${markup}`));
  });

  const mdHrMatch = markdownText.matchAll(/^(___+|---+|\*\*\*+)/gm);
  if (mdHrMatch) [...mdHrMatch].forEach(match => {
    const markup = match[1].split("").map((m) => markupMap[m]).join("");
    markdownText = markdownText.replace(match[0], markupMap.hr.replace("%%", `${markup}`));
  });

  const mdCodeBlockMatch = markdownText.matchAll(/(```)(\s*[^\s]?)(.*?)(\1(\n\n|\n?$))/gms);
  if (mdCodeBlockMatch) [...mdCodeBlockMatch].forEach(match => {
    const markupStart = match[1].split("").map((m) => markupMap[m] || m).join("");
    const markupEnd = match[4].split("").map((m) => markupMap[m] || m).join("");
    markdownText = markdownText.replaceAll(match[0], markupMap.code_block.replace("%%", `${markupStart}${match[2] || ''}${match[3]}${markupEnd}`));
  });

  const mdCodeMatch = markdownText.matchAll(/(`)(.+?)\1/gms);
  if (mdCodeMatch) [...mdCodeMatch].forEach(match => {
    if (match[2].match(/\n\n/)) return;
    const markup = match[1].split("").map(m => markupMap[m]).join("");
    markdownText = markdownText.replace(match[0], markupMap.code.replace("%%", `${markup}${match[2]}${markup}`));
  });

  const mdImageMatch = markdownText.matchAll(/!\[([^\]]+?)\]\(([^\s]*?)(\s+".*?")?\)/gm);
  if (mdImageMatch) [...mdImageMatch].forEach(match => {
    markdownText = markdownText.replaceAll(match[0], markupMap.image
      .replace("%1", match[1])
      .replace("%2", match[2])
      .replace("%3", match[3] || '')
    );      
  });
  const mdImageReferenceMatch = markdownText.matchAll(/!\[([^\]]+?)\]\[([^\]]+?)\]/gm);
  if (mdImageReferenceMatch) [...mdImageReferenceMatch].forEach(match => {
    markdownText = markdownText.replaceAll(match[0], markupMap.imageRef
      .replace("%1", match[1])
      .replace("%2", match[2])
    );      
  });
  const mdLinkMatch = markdownText.matchAll(/\[([^\]]+?)\]\(([^\s]*?)(\s+".*?")?\)/gm);
  if (mdLinkMatch) [...mdLinkMatch].forEach(match => {
    if (!match[1].match(/mdImage/)) {  // Image markup inside link markup is not supported
      markdownText = markdownText.replaceAll(match[0], markupMap.link
        .replace("%1", match[1])
        .replace("%2", match[2])
        .replace("%3", match[3] || '')
      );  
    }
  });
  const mdLinkReferenceMatch = markdownText.matchAll(/\[([^\]]+?)\]\[([^\]]+?)\]/gm);
  if (mdLinkReferenceMatch) [...mdLinkReferenceMatch].forEach(match => {
    markdownText = markdownText.replaceAll(match[0], markupMap.linkRef
      .replace("%1", match[1])
      .replace("%2", match[2])
    );      
  });

  const mdReferenceMatch = markdownText.matchAll(/\[([^\]]+?)\]:(\s*)([^\s]+)(\s+".*?")?/gm);
  if (mdReferenceMatch) [...mdReferenceMatch].forEach(match => {
    if (!match[1].match(/mdImage/)) {  // Image markup inside link markup is not supported
      markdownText = markdownText.replaceAll(match[0], markupMap.reference
        .replace("%1", match[1])
        .replace("%2", match[2] || '')
        .replace("%3", match[3])
        .replace("%4", match[4] || '')
      );  
    }
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

  comments.forEach((markup, idx) => {
    markdownText = markdownText.replace(`{comment:${idx}}`, markup);
  });

  markdownText = frontMatter + markdownText;

  markdownText = markdownText.replaceAll(/\n/gms, `${markupMap.newline}\n`);
  // Disabled, because it is very very very slow
  // const textMatch = markdownText.matchAll(/>[^<]+</gms);
  // if (textMatch) [...textMatch].forEach(match => {
  //   markdownText = markdownText.replace(match[0], match[0].replaceAll(/ /gms, `${markupMap.space}`));
  // });

  document.getElementById("contentStyle").innerHTML = markdownText;
  document.querySelector(".editor-footer").innerHTML = `
    Ln ${editorInfo.line}, Col ${editorInfo.column} |
    ${editorInfo.wordCount} words | 
    ${editorInfo.readingTime} minute${editorInfo.readingTime > 1 ? "s" : ""}
  `;

  window.clearTimeout(changeThrottle);
  changeThrottle = window.setTimeout(() => { 
    let markdownText = getContent();
    if (document.querySelector("form.editor-container input[name=content]").value !== markdownText) {
      document.querySelector("form.editor-container input[name=content]").value = markdownText;

      const newIframe = document.createElement("iframe");
      newIframe.setAttribute("name", `temp_iframe_${iframeId}`);
      document.querySelector(".preview-container").appendChild(newIframe);
      updateStatus();

      window.iframeLoaded = () => {
        const iframeName = document.querySelector("form.editor-container").getAttribute('target');
        document.querySelector(`iframe[name="${iframeName}"]`).style.opacity = 1;
        document.querySelectorAll("iframe").forEach(iframe => {
          if (iframe.getAttribute("name") < iframeName) {
            iframe.remove();
          }
        });    
        updateStatus();

        textareaContentScrollHandler();
      };

      newIframe.addEventListener("load", window.iframeLoaded);
      newIframe.addEventListener("error", (event) => {
        console.log(event);
      });

      document.querySelector("form.editor-container").setAttribute("target", `temp_iframe_${iframeId}`);
      iframeId = (new Date()).getTime();
      document.querySelector("form.editor-container").submit();
    }

  }, 250);
};

changeHandler();
textareaContentScrollHandler();

const submitHandler = (event) => {
  if (event.submitter.name === "save") {
    console.log("Saving...");
    savedContent = event.target.content.value;
    // changeHandler();
  } else {
    console.log("Previewing...");
  }
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

"focus keyup paste input click".split(" ").forEach(eventType => document.getElementById("contentTextarea").addEventListener(eventType, changeHandler));
document.querySelector("form.editor-container").addEventListener("submit", submitHandler);
document.getElementById("contentTextarea").addEventListener("scroll", textareaContentScrollHandler);
document.querySelector(".separator").addEventListener("mousedown", separatorDragStartHandler);
window.addEventListener("mousemove", separatorDragHandler);
window.addEventListener("mouseup", separatorDragStopHandler);

document.getElementById(contentId).focus();

if (import.meta.webpackHot) {
  import.meta.webpackHot.dispose(() => {
    "focus keyup paste input click".split(" ").forEach(eventType => document.getElementById(contentId).removeEventListener(eventType, changeHandler));
    document.querySelector("form.editor-container").removeEventListener("submit", submitHandler);
    document.getElementById("contentTextarea").removeEventListener("scroll", textareaContentScrollHandler);
    document.querySelector(".separator").removeEventListener("mousedown", separatorDragStartHandler);
    window.removeEventListener("mousemove", separatorDragHandler);
    window.removeEventListener("mouseup", separatorDragStopHandler);
  });
  import.meta.webpackHot.accept();
}