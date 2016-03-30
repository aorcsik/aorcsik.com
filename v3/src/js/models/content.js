define([
    'jquery',
    'underscore',
    'backbone'
], function($, _, Backbone) {
    var Content = Backbone.Model.extend({
        defaults: {
            'aboutme': [{
                'content_class': "aboutme",
                'content_title': "Antal Orcsik",
                'content_subtitle': "Application Developer",
                'content_logo': "https://s.gravatar.com/avatar/42be615fb210779dbb3752714e14c3ec?s=256",
                'content_company': "Antal Orcsik",
                'content_sections': [{
                    'team': "Summary",
                    'interval': "",
                    'summary': "I'm Orcsik Antal, I work as an Application Developer at IBM Hungary. I live in the beautiful city of Budapest.\n" +
                               "Before IBM I was working as a Software Engineer in Infrastructure and Payments teams at Prezi, the company behind the zoomin online presentations. I started web development at ingatlan.com and worked on köpönyeg.hu, a popular local weather portal for more than 5 years.\n" +
                               "In my free time I own, design and develop Mozipremierek.hu, a Hungarian movie premiere calendar page, along some other pet projects.\n" +
                               "Right now I'm doing my last semester at Eötvös Lóránt University in Computer Science."
                },/* {
                    'team': "Skills",
                    'interval': "",
                    'summary': "<u>JavaScript</u>, jQuery, Backbone.js, Underscore.js, require.js\n" +
                               "<u>CSS3</u>, LESS, Bootstrap\n" +
                               "<u>HTML5</u>, XHTML, XML, JSON\n" +
                               "<u>PHP</u>, Python, Ruby, Scala, Java\n" +
                               "<u>MySQL</u>, SQLite, NoSQL, Oracle"
                },*/{
                    'team': "Contact me",
                    'interval': "",
                    'summary': "",
                    'links': [
                        {'url': "mailto:aorcsik@gmail.com", 'title': "Email – aorcsik@gmail.com", 'icon': "envelope"},
                        {'url': "http://twitter.com/aorcsik", 'title': "Twitter – @aorcsik ", 'icon': "twitter"},
                        {'url': "http://linkedin.com/in/aorcsik", 'title': "LinkedIn – Antal Orcsik", 'icon': "linkedin"},
                        {'url': "http://github.com/aorcsik", 'title': "GitHub – @aorcsik", 'icon': "github-alt"},
                        {'url': "https://dribbble.com/aorcsik", 'title': "Dribbble – aorcsik", 'icon': "dribbble"}
                    ]
                }]
            }],
            'education': [{
                'content_class': "elte",
                'content_title': "Eötvös Lóránd University",
                'content_subtitle': "September 2013 – Present",
                'content_logo': "images/elte.png",
                'content_company': "ELTE",
                'content_sections': [{
                    'team': "Computer Science",
                    'interval': "Bachelor of Science (in progress)",
                    'summary': "Three years after I quit university I decided to resume my academic studies. I started over in a more science oriented institute, which was a great fit so far, I progressed well and I expect to finish in July 2016."
                }]
            },{
                'content_class': "bme",
                'content_title': "Budapest University of Technology and Economics",
                'content_subtitle': "September 2003 – February 2010",
                'content_logo': "images/bme.png",
                'content_company': "BME",
                'content_sections': [{
                    'team': "Software Engineer",
                    'interval': "Bachelor of Science (unfinished)",
                    'summary': "I started learning computer science right after high school. During this time I learned the basics of programming, and wrote my first real applications in C and Java. After learning PHP for a community projects I applied for summer work, whihc proved to be more interesting and rewarding back then, which in the end was the reason I quit this institute."
                }]
            }],
            'work': [{
                'content_class': "ibm",
                'content_title': "Application Developer",
                'content_subtitle': "March 2016 – Present",
                'content_logo': "images/ibm.svg",
                'content_company': "IBM",
                'content_sections': [{
                    'team': "Global CIO Services – HR Web & HRIT BPM",
                    'interval': "March 2015 – February 2016",
                    'summary': "In the mid-90s, when I started to show interest about computers, the name IBM was among the first I learned. It was everywhere, it was important, it was a <i>legend</i>. Today I'm part of this legend. My job is to create and manage HR websites and business processes, used by 400 thousand IBMers around the world."
                }]
            },{
                'content_class': "prezi",
                'content_title': "Software Engineer",
                'content_subtitle': "May 2013 – February 2016",
                'content_logo': "images/prezi.png",
                'content_company': "Prezi",
                'content_sections': [{
                    'team': "Payments",
                    'interval': "March 2015 – February 2016",
                    'summary': "I transferred internally to the Payments team, where we worked on integrating third party payment processors to our actual payment flow, managed subscriptions and renewals and sales A/B testing in a Python based backend and backbone frontend architecture."
                },{
                    'team': "Infrastructure",
                    'interval': "May 2013 – March 2015",
                    'summary': "As an infrastructure engineer I was developing backend solutions using Python and Scala and managing Amazon IaaS Cloud architecture. Our goal was to transition Prezi backend from monolithic hosted application to a microservice architecture in the cloud. The largest project I worked on here was separating the presentation backend/database and moving it to Amazon EC2/RDS instances. I was also part of the authentication service separation and several smaller projects."
                }]
            },{
                'content_class': "ingatlan",
                'content_title': "Web Developer",
                'content_subtitle': "July 2005 – April 2013",
                'content_logo': "images/ingatlan.png",
                'content_company': "ingatlan.com",
                'content_sections': [{
                    'team': "koponyeg.hu",
                    'interval': "January 2008 – April 2013",
                    'summary': "Year after year I became a recognized senior developer in the company and in 2007 I was assigned to the köpönyeg project, which became one of the largest weather portals in Hungary since then. Developing this weather portal required such skills as creating web crawlers and various visualizations, and continously maintaining the code to handle the increasing traffic. The extensive use of caching and optimized database usage took key roles in the achievement of reaching 400k+ unique visitors in early 2012."
                },{
                    'team': "utcakereso.hu",
                    'interval': "January 2007 – January 2008",
                    'summary': "For one year I was the lead developer of Utcakereső.hu a PHP powered city map web application."
                },{
                    'team': "ingatlan.com",
                    'interval': "July 2005 – January 2007",
                    'summary': "I was hired as an intern and stayed as a full time sitebuilder working on the redesign of ingatlan.com real estate portal using client side technologies, JavaScript, CSS and HTML. Later I was involved in some backend development with PHP."
                }]
            }],
            'projects': [{
                'content_class': "mozipremierek",
                'content_title': "mozipremierek.hu",
                'content_subtitle': "April 2014 – Present",
                'content_logo': "http://mozipremierek.hu/images/website_icon.svg",
                'content_company': "mozipremierek.hu",
                'content_sections': [{
                    'team': "mozipremierek.hu",
                    'url': "http://mozipremierek.hu",
                    'interval': "",
                    'summary': "<img src='images/mozipremierek1.png' alt='mozipremierek.hu timeline'>" +
                               "It started with an idea to write a simple automated web crawler, that finds Hungarian movie premiere dates and generates a calendar link. Once the robot was working, it was just a step further to get some poster images, plot summary and genres.\n" +
                               "Today it's a standalone web application with a couple hundred visitors every day. I'm in contact with almost every local distributor, who provide me press materials, and I do weekly social media updates on the actual releases.",
                    'links': [
                        {'url': "https://www.behance.net/gallery/23460787/Mozipremierekhu-21", 'title': "Behance – Mozipremierek.hu 2.1 ", 'icon': "behance"},
                        {'url': "https://www.behance.net/gallery/16950807/Mozipremierekhu", 'title': "Behance – Mozipremierek.hu", 'icon': "behance"},
                        {'url': "https://dribbble.com/aorcsik/projects/252712-Mozipremierek-hu", 'title': "Dribbble – Mozipremierek.hu", 'icon': "dribbble"},
                        {'separator': true},
                        {'url': "http://facebook.com/Mozipremierek", 'title': "Facebook – Mozipremierek", 'icon': "facebook"},
                        {'url': "http://twitter.com/Mozipremierek", 'title': "Twitter – @Mozipremierek ", 'icon': "twitter"}

                    ]
                }]
            },{
                'content_class': "include",
                'content_title': "#include",
                'content_subtitle': "April 2014 – Present",
                'content_logo': null,
                'content_company': null,
                'content_sections': [{
                    'team': "include.aorcsik.com",
                    'url': "http://include.aorcsik.com",
                    'interval': "",
                    'summary': "#include is my English blog about coding, design or anything that I want to share and is longer than a tweet.\n" +
                               "Some popular posts:",
                    'links': [
                        {'url': "http://include.aorcsik.com/2015/09/02/safari-tips-and-tricks/", 'title': "Safari Tips and Tricks", 'subtitle': "September 2, 2015"},
                        {'url': "http://include.aorcsik.com/2014/12/04/add-favicons-to-safari-8-tabs/", 'title': "Add favicons to Safari 8 (and 9) tabs", 'subtitle': "December 4, 2014"},
                        {'url': "http://include.aorcsik.com/2014/09/19/installing-java-on-mac-os-10-10-yosemite-beta/", 'title': "Installing Java on Mac OS X 10.10 Yosemite and 10.11 El Capitan", 'subtitle': "September 19, 2014"}
                    ]
                }]
            }]
        },
    });
    return Content;
});
