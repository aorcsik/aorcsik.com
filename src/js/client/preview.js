// import { getReadPercentage, getScrollValue } from "./common";

// window.scrollTo(0, window.parent.iframeScrollY);
window.parent.contentScrollHandler();

// const scrollHandler = async (event) => {
//   const scrollValue = window.scrollY;
//   const contentHeight = document.querySelector('body').clientHeight;
//   const containerHeight = window.innerHeight;

//   const readPercentage = getReadPercentage(scrollValue, contentHeight, containerHeight);

//   const parentContainerHeight = window.parent.document.querySelector(".editor-content").offsetHeight;
//   const parentContentHeight = window.parent.document.querySelector(".editor-content pre").offsetHeight;
//   const parentScrollValue = getScrollValue(readPercentage, parentContentHeight, parentContainerHeight);

//   console.log(parentScrollValue);

//   window.parent.document.querySelector(".editor-content").scrollTop = parentScrollValue;
// };

// window.addEventListener("scroll", scrollHandler);

if (import.meta.webpackHot) {
  import.meta.webpackHot.dispose(() => {
    // scrollHandler();
    // window.removeEventListener("scroll", scrollHandler);
  });
  import.meta.webpackHot.accept();
}