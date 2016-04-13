// Filename: router.js
define([
    'jquery',
    'underscore',
    'backbone',
    'models/content',
    'views/content',
    'views/navigation'
], function($, _, Backbone, Content, ContentView, NavigationView) {

    var Router = Backbone.Router.extend({

        navigation: null,

        initialize: function() {
            $("#noscript").remove();

            this.navigation = new NavigationView();
            this.navigation.$el.appendTo($("body"));
            this.navigation.render();

            this.content = new ContentView({'model': new Content()});
            this.content.$el.appendTo($("body"));

            $("body").append($("<footer>aorcsik.com &copy; 2016</footer>"));

            Backbone.history.start();
        },

        routes: {
            "!work": "openWork",
            "!education": "openEducation",
            "!projects": "openProjects",
            // Default
            '*actions': 'defaultAction'
        },
        openWork: function () {
            this.navigation.selectNavItem("work");
            this.content.render("work");
        },
        openEducation: function() {
            this.navigation.selectNavItem("education");
            this.content.render("education");
        },
        openProjects: function() {
            this.navigation.selectNavItem("projects");
            this.content.render("projects");
        },
        defaultAction: function (actions) {
            this.navigation.selectNavItem("aboutme");
            this.content.render("aboutme");
        }
    });

    return Router;
});
