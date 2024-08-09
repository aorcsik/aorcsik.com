import "../../css/editor.css";
import { getReadPercentage, getScrollValue } from "./common";

let changeThrottle = null;
const changeHandler = (event) => {
  window.clearTimeout(changeThrottle);
  changeThrottle = window.setTimeout(() => {
    const iframe = document.querySelector("iframe[name=preview_iframe]");
    /** @type {Window} */
    const iframeWindow = iframe.contentWindow || iframe;
    window.iframeScrollY = iframeWindow.scrollY;
 
    let markdownText = document.getElementById("content").innerText;
    document.querySelector("form.editor-container input[name=content]").value = markdownText;
    document.querySelector("form.editor-container").submit();

    // markdownText = markdownText.replaceAll("<", "&lt;").replaceAll(">", "&gt;");
    // const h2Match = markdownText.matchAll(/^## .*/gm);
    // if (h2Match) [...h2Match].forEach(match => {
    //   markdownText = markdownText.replace(match[0], `<h2>${match[0]}</h2>`);
    // });
    // document.getElementById("content").innerHTML = markdownText;

  }, 250);
};

"keyup paste input".split(" ").forEach(eventType => document.getElementById("content").addEventListener(eventType, changeHandler));
changeHandler();

const contentScrollHandler = () => {
  const iframe = document.querySelector("iframe[name=preview_iframe]");
  /** @type {Window} */
  const iframeWindow = iframe.contentWindow || iframe;

  const editorScrollValue = document.querySelector(".editor-content").scrollTop;
  const editorContentHeight = document.querySelector(".editor-content pre").offsetHeight;
  const editorContainerHeight = document.querySelector(".editor-content").offsetHeight;

  const readPercentage = getReadPercentage(editorScrollValue, editorContentHeight, editorContainerHeight);

  const iframeContainerHeight = iframeWindow.innerHeight;
  const iframeContentHeight = iframeWindow.document.querySelector("body").clientHeight;
  const iframeScrollValue = getScrollValue(readPercentage, iframeContentHeight, iframeContainerHeight);

  iframeWindow.scrollTo(0, iframeScrollValue);
};

window.contentScrollHandler = contentScrollHandler;

document.querySelector(".editor-content").addEventListener("scroll", contentScrollHandler);

if (import.meta.webpackHot) {
  import.meta.webpackHot.dispose(() => {
    "keyup paste input".split(" ").forEach(eventType => document.getElementById("content").removeEventListener(eventType, changeHandler));
    document.querySelector(".editor-content").removeEventListener("scroll", contentScrollHandler);
  });
  import.meta.webpackHot.accept();
}