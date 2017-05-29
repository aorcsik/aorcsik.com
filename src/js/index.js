require('smoothscroll-polyfill').polyfill();

import "../less/index.less";

window.addEventListener("load", function(event) {
    Array.from(document.querySelectorAll("a[href^='#']"), element => {
        element.addEventListener("click", event => {
            var targetId = element.href.split("#")[1];
            if (targetId !== undefined) {
                event.preventDefault();
                if (targetId == "") {
                    window.scroll({ top: 0, left: 0, behavior: 'smooth' });
                } else {
                    document.getElementById(targetId).scrollIntoView({ behavior: 'smooth' });
                }
            }
        });
    });
});
