import "../../css/blog.css";
import { getReadPercentage } from "./common";

const scrollHandler = async (event) => {
  const scrollValue = window.scrollY;
  const contentHeight = document.querySelector('body').clientHeight;
  const containerHeight = window.innerHeight;

  const readPercentage = getReadPercentage(scrollValue, contentHeight, containerHeight);

  document.getElementById("read-progress").style.width = `${readPercentage}%`;
};

window.addEventListener("scroll", scrollHandler);

if (import.meta.webpackHot) {
  import.meta.webpackHot.dispose(() => {
    scrollHandler();
    window.removeEventListener("scroll", scrollHandler);
  });
  import.meta.webpackHot.accept();
}
