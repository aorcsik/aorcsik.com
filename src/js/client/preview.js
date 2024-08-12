window.parent.iframeLoaded();

if (import.meta.webpackHot) {
  import.meta.webpackHot.dispose(() => {});
  import.meta.webpackHot.accept();
}