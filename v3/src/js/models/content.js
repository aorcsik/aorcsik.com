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
                    'summary': "Our family enterprise, which was founded by my father in 1999. The profile of the company was extended with IT services in 2006 and I became co-owner in 2008. Since then my occasional freelance assignments and projects are done under this name."
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
            }]
        },
    });
    return Content;
});
