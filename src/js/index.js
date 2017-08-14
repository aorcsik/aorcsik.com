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

    var mobileUpdates = false;
    Array.from(document.querySelectorAll(".main-section"), mainSection => {
        var sectionId = mainSection.id,
            updates = {count: 0, latest: null, color: null};

        Array.from(mainSection.querySelectorAll("article"), article => {
            if (article.querySelector(".toggleArticleContent")) {
                article.querySelector(".toggleArticleContent").addEventListener("click", event => {
                    if (article.className.match(/articleOpen/)) {
                        article.className = article.className.replace(/articleOpen/, "");
                    } else {
                        article.className += " articleOpen";
                    }
                });
            }


            Array.from(article.querySelectorAll(".updated"), label => {
                var date = label.innerHTML,
                    diff = Math.floor(((new Date()) - (new Date(date))) / (1000 * 60 * 60 * 24));
                if (diff == 0) label.innerHTML = "Today";
                else if (diff == 1) label.innerHTML = "Yesterday";
                else label.innerHTML = diff + " days ago";
                label.style.display = "block";

                var r = 220,
                    g = Math.min(Math.floor(255 * diff / 30), 255),
                    b = g,
                    a = Math.max(0.3, 0.3 + (1 - diff / 30) * 0.7),
                    backgroundColor = "rgba(" + r + "," + g + "," + b + "," + a + ")";
                label.style.background = backgroundColor;

                if (diff < 30) {
                    mobileUpdates = true;
                    updates.count += 1;
                    if (updates.latest == null || updates.latest > diff) {
                        updates.latest = diff;
                        updates.backgroundColor = backgroundColor;
                    }
                }
            });
        });

        Array.from(document.querySelectorAll("#header a[href='#" + sectionId + "']"), element => {
            if (updates.count > 0) {
                var label = document.createElement("span");
                label.className = "header-menu-label";
                label.style.background = updates.backgroundColor;
                label.innerHTML = updates.count;
                element.insertBefore(label, element.firstChild.nextSibling);
            }
        });
    });

    if (mobileUpdates) {
        document.getElementById("menuButton").className = "updates";
    }


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
            document.getElementById("submitForm").disabled = "disabled";
            document.getElementById("submitError").style.display = "none";
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
                document.getElementById("submitForm").disabled = "";
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
                document.getElementById("contactFormArticle").className += " emailSent";
            }).catch(error => {
                document.getElementById("submitError").style.display = "block";
                console.error(error);
            });
        }
    });

});
