require('smoothscroll-polyfill').polyfill();

import 'whatwg-fetch'

import Promise from 'promise-polyfill';

// To add to window
if (!window.Promise) {
  window.Promise = Promise;
}

import "../less/index.less";

window.addEventListener("load", event => {
    Array.from(document.querySelectorAll("a[href^='#']"), element => {
        element.addEventListener("click", event => {
            var targetId = element.href.split("#")[1];
            if (targetId !== undefined) {
                event.preventDefault();

                document.getElementsByTagName("body")[0].className = "";

                if (targetId == "") {
                    window.scroll({ top: 0, left: 0, behavior: 'smooth' });
                } else {
                    document.getElementById(targetId).scrollIntoView({ behavior: 'smooth' });
                }
            }
        });
    });

    Array.from(document.querySelectorAll("article"), article => {
        if (article.querySelector(".toggleArticleContent")) {
            article.querySelector(".toggleArticleContent").addEventListener("click", event => {
                if (article.className.match(/articleOpen/)) {
                    article.className = article.className.replace(/articleOpen/, "");
                } else {
                    article.className += " articleOpen";
                }
            });
        }
    });

    window.addEventListener("scroll", event => {
        if (window.pageYOffset > 0) {
            if (!document.getElementById("header").className.match("header-scrolled")) {
                document.getElementById("header").className += " header-scrolled";
            }
        } else {
            document.getElementById("header").className = document.getElementById("header").className.replace(/header-scrolled/, "");
        }
    });

    document.getElementById("menuButton").addEventListener("click", event => {
        event.preventDefault();

        var body = document.querySelector("body");
        if (body.className.match(/menuOpen/)) {
            body.className = body.className.replace(/menuOpen/, "");
        } else {
            body.className += " menuOpen";
        }
    });

    document.getElementById("submitForm").addEventListener("click", event => {
        event.preventDefault();

        var email = document.querySelector("input[name='yourEmail']").value.trim(),
            message = document.querySelector("textarea[name='yourMessage']").value.trim();

        if (email && message) {
            fetch('https://formspree.io/aorcsik+formspree@gmail.com', {
                method: 'POST',
                headers: {
                    'Accept': "application/json",
                    'Content-Type': "application/json"
                },
                body: JSON.stringify({
                    email: email,
                    message: message
                })
            }).then(response => {
                if (response.status >= 200 && response.status < 300) {
                    return response;
                } else {
                    var error = new Error(response.statusText);
                    error.response = response;
                    throw error;
                }
            }).then(response => {
                return response.json()
            }).then(body => {

                console.log(body);

            }).catch(error => {

                console.error(error);

            });
        }
    });

});
