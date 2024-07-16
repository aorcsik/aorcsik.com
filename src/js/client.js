import "../images/apple-touch-icon.png";
import "../css/client.css";

const scrollHandler = async (event) => {
  const headerClassName = document.querySelector("header").className;
  if (window.scrollY > 0 && !headerClassName.match("sticky")) {
    document.querySelector("header").className = headerClassName + " sticky";
  }
  if (window.scrollY <= 0 && headerClassName.match("sticky")) {
    document.querySelector("header").className = headerClassName.replace("sticky", "");
  }
};

window.addEventListener("scroll", scrollHandler);

if (import.meta.webpackHot) {
  import.meta.webpackHot.dispose(() => {
    window.removeEventListener("scroll", scrollHandler);
  });
  import.meta.webpackHot.accept();
}
