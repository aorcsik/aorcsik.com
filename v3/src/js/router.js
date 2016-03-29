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
            this.navigation = new NavigationView();
            this.navigation.$el.appendTo($("body"));
            this.navigation.render();

            this.content = new ContentView({'model': new Content()});
            this.content.$el.appendTo($("body"));
            this.content.render();

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
            this.content.loadContent("work");
        },
        openEducation: function() {
            this.navigation.selectNavItem("education");
            this.content.loadContent("education");
        },
        openProjects: function() {
            this.navigation.selectNavItem("projects");
            this.content.loadContent("projects");
        },
        defaultAction: function (actions) {
            this.navigation.selectNavItem("aboutme");
            this.content.loadContent("aboutme");
        }
    });

    return Router;
});
