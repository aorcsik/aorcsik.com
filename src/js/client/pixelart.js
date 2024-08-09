import "../../css/pixelart.css";

/**
 * @param {HTMLElement} domElement
 * @param {Function} onPointerDown
 */
function addPointerDownListener(domElement, onPointerDown) {
  domElement.addEventListener("pointerdown", onPointerDown, false);
  domElement.addEventListener("touchstart", onPointerDown, false);
  domElement.addEventListener("mousedown", onPointerDown, false);
}

/**
 * @param {HTMLElement} domElement
 * @param {Function} onPointerUp
 */
function addPointerUpListener(domElement, onPointerUp) {
  domElement.addEventListener("pointerup", onPointerUp, false);
  domElement.addEventListener("touchend", onPointerUp, false);
  domElement.addEventListener("mouseup", onPointerUp, false);
}

document.querySelectorAll(".clickable").forEach(function(el) {
  var downdelay;
  addPointerDownListener(el, function(event) {
    window.clearTimeout(downdelay);
    downdelay = window.setTimeout(function() {
      el.className = el.className.replace(/clickable-down/, "") + " clickable-down";
      el.className = el.className.replace(/\s\s+/, " ");
      // console.log(el.className);
    }, 10);
  });
  var updelay;
  addPointerUpListener(el, function(event) {
    window.clearTimeout(updelay);
    updelay = window.setTimeout(function() {
      el.className = el.className.replace(/clickable-down/, "");
      if (el.className.match(/\bclickable-clicked\b/)) {
        el.className = el.className.replace(/clickable-clicked/, "");
      } else {
        el.className = el.className.replace(/clickable-clicked/, "") + " clickable-clicked";
      }
      el.className = el.className.replace(/\s\s+/, " ");
      // console.log(el.className);
    }, 200);
  });
});

if (import.meta.webpackHot) import.meta.webpackHot.accept();
