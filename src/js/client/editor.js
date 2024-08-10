import { getReadPercentage, getScrollValue } from "./common";
import { calculateReadingTime, countWords } from "../server/shared";

import "../../css/editor.css";

let iframeId = (new Date()).getTime();
let changeThrottle = null;
const changeHandler = (event) => {

  const savedContent = document.getElementById("savedContent").innerText;

  let markdownText = document.getElementById("content").innerText;
  
  if (savedContent !== markdownText) {
    document.querySelector("form.editor-container button[name=save]").removeAttribute("disabled");
  } else {
    document.querySelector("form.editor-container button[name=save]").setAttribute("disabled", true);
  }

  const markupMap = {
    "*": "<span class='mdAsterisk'></span>",
    "_": "<span class='mdUnderscore'></span>",
    "#": "<span class='mdHashmark'></span>",
    "heading_open": "<span class='mdHeading'>",
    "heading_close": "</span>",
    "em_open": "<span class='mdEm'>",
    "em_close": "</span>",
    "strong_open": "<span class='mdStrong'>",
    "strong_close": "</span>",
  };

  let frontMatter = '';
  markdownText = markdownText.replaceAll("<", "&lt;").replaceAll(">", "&gt;");
  const mdFrontMatterMatch = markdownText.match(/---.*?---/s);
  if (mdFrontMatterMatch) {
    frontMatter = `<span class='mdFrontMatter'>${mdFrontMatterMatch[0]}</span>`;
    markdownText = markdownText.replace(mdFrontMatterMatch[0], '');
  }

  const wordCount = countWords(markdownText);
  const readingTime = calculateReadingTime(markdownText);
  document.querySelector(".editor-footer").innerHTML = `${wordCount} words | ${readingTime} minute${readingTime > 1 ? "s" : ""}`;

  const mdHeadingMatch = markdownText.matchAll(/^(#+)(\s+.*)/gm);
  if (mdHeadingMatch) [...mdHeadingMatch].forEach(match => {
    const markup = match[1].split("").map((m) => markupMap[m]).join("");
    markdownText = markdownText.replace(match[0], `${markupMap.heading_open}${markup}${match[2]}${markupMap.heading_close}`);
  });
  const mdLinkMatch = markdownText.matchAll(/!?\[[^\]]+?\]\([^\s]+?\)/gm);
  if (mdLinkMatch) [...mdLinkMatch].forEach(match => {
    markdownText = markdownText.replaceAll(match[0], `<span class='mdLink'>${match[0]}</span>`);
  });
  const mdStrongMatch = markdownText.matchAll(/(\*\*|__)(.+?)\1/gm);
  if (mdStrongMatch) [...mdStrongMatch].forEach(match => {
    const markup = match[1].split("").map(m => markupMap[m]).join("");
    markdownText = markdownText.replace(match[0], `${markupMap.strong_open}${markup}${match[2]}${markup}${markupMap.strong_close}`);
  });
  const mdEmMatch = markdownText.matchAll(/(\*|_)(.+?)\1/gm);
  if (mdEmMatch) [...mdEmMatch].forEach(match => {
    const markup = match[1].split("").map(m => markupMap[m]).join("");
    markdownText = markdownText.replace(match[0], `${markupMap.em_open}${markup}${match[2]}${markup}${markupMap.em_close}`);
  });
  const mdHtmlMatch = markdownText.matchAll(/&lt;[a-z/].*?&gt;/gm);
  if (mdHtmlMatch) [...mdHtmlMatch].forEach(match => {
    markdownText = markdownText.replace(match[0], `<span class='mdHtml'>${match[0]}</span>`);
  });

  document.getElementById("contentStyle").innerHTML = frontMatter + markdownText;

  window.clearTimeout(changeThrottle);
  changeThrottle = window.setTimeout(() => { 
    let markdownText = document.getElementById("content").innerText;
    if (document.querySelector("form.editor-container input[name=content]").value !== markdownText) {
      document.querySelector("form.editor-container input[name=content]").value = markdownText;

      const newIframe = document.createElement("iframe");
      newIframe.setAttribute("name", `temp_iframe_${iframeId}`);
      document.querySelector(".preview-container").appendChild(newIframe);
      newIframe.addEventListener("load", (event) => {
        event.target.style.opacity = 1;
        document.querySelectorAll("iframe").forEach(iframe => {
          if (iframe.getAttribute("name") < event.target.getAttribute("name")) {
            iframe.remove();
          }
        })
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
    document.getElementById("savedContent").innerHTML = event.target.content.value;
  }
};

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

window.contentScrollHandler = contentScrollHandler;

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

"keyup paste input".split(" ").forEach(eventType => document.getElementById("content").addEventListener(eventType, changeHandler));
document.querySelector("form.editor-container").addEventListener("submit", submitHandler);
document.querySelector(".editor-content").addEventListener("scroll", contentScrollHandler);
document.querySelector(".separator").addEventListener("mousedown", separatorDragStartHandler);
window.addEventListener("mousemove", separatorDragHandler);
window.addEventListener("mouseup", separatorDragStopHandler);

if (import.meta.webpackHot) {
  import.meta.webpackHot.dispose(() => {
    "keyup paste input".split(" ").forEach(eventType => document.getElementById("content").removeEventListener(eventType, changeHandler));
    document.querySelector("form.editor-container").removeEventListener("submit", submitHandler);
    document.querySelector(".editor-content").removeEventListener("scroll", contentScrollHandler);
    document.querySelector(".separator").removeEventListener("mousedown", separatorDragStartHandler);
    window.removeEventListener("mousemove", separatorDragHandler);
    window.removeEventListener("mouseup", separatorDragStopHandler);
  });
  import.meta.webpackHot.accept();
}