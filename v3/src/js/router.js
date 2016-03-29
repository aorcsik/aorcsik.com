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

            Backbone.history.start();
        },

        routes: {
            "!work": "openWork",
            "!education": "openEducation",
            // Default
            '*actions': 'defaultAction'
        },
        openWork: function () {
            console.log("work");
            this.navigation.selectNavItem("work");
            this.content.loadContent("work");
        },
        openEducation: function() {
            console.log("education");
            this.navigation.selectNavItem("education");
            this.content.loadContent("education");
        },
        defaultAction: function (actions) {
            this.navigate("#!work", {trigger: true});
        }
    });

    return Router;
});
