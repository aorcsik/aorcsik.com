import "../css/blog.css";

const scrollHandler = async (event) => {
  const body = document.querySelector('body');
  const scrollPercentage = window.scrollY / (body.clientHeight - window.innerHeight);
  const readPercentage = (window.innerHeight * scrollPercentage + window.scrollY) / body.clientHeight * 100;
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
