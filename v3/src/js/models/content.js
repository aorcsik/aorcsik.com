define([
    'jquery',
    'underscore',
    'backbone'
], function($, _, Backbone) {
    var Content = Backbone.Model.extend({
        defaults: {
            'education': [{
                'content_class': "elte",
                'content_title': "Computer Science BSc",
                'content_subtitle': "2013 – Present",
                'content_logo': null,
                'content_company': "ELTE",
                'content_sections': []
            },{
                'content_class': "bme",
                'content_title': "Software Engineer BSc",
                'content_subtitle': "2003 – 2010",
                'content_logo': null,
                'content_company': "BME",
                'content_sections': []
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
