import "../images/apple-touch-icon.png";
import "../css/client.css";

window.addEventListener("scroll", event => {
  const headerClassName = document.querySelector("header").className;
  if (window.scrollY > 0 && !headerClassName.match("sticky")) {
    document.querySelector("header").className = headerClassName + " sticky";
  }
  if (window.scrollY <= 0 && headerClassName.match("sticky")) {
    document.querySelector("header").className = headerClassName.replace("sticky", "");
  }
});