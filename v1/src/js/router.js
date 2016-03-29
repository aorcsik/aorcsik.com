// Filename: router.js
define([
    'jquery',
    'underscore',
    'backbone',
    'views/sidebar',
    'views/about',
    'views/coding',
    'views/drawing',
    'views/writing',
    'views/manifest'
], function($, _, Backbone, sidebarView, AboutView,
    CodingView, DrawingView, WritingView, ManifestView) {

    var Router = Backbone.Router.extend({

        initialize: function() {
            Backbone.history.start();
        },

        routes: {
            '!about': "showAbout",
            '!about/:sub': "showAbout",
            '!coding': "showCoding",
            '!coding/:sub': "showCoding",
            '!drawing': "showDrawing",
            '!drawing/:sub': "showDrawing",
            '!writing': "showWriting",
            '!writing/:sub': "showWriting",
            '!manifest': "showManifest",

            // Default
            '*actions': 'defaultAction'
        },

        view: null,
        showView: function(View) {
            if (this.view) this.view.close();
            this.view = new View();
            $(".container").append(this.view.$el);
            this.view.render();
            return this.view;
        },

        showAbout: function(sub) {
            this.showView(AboutView).scrollTo(sub);
        },

        showCoding: function(sub) {
            this.showView(CodingView).scrollTo(sub);
        },

        showDrawing: function(sub) {
            this.showView(DrawingView).scrollTo(sub);
        },

        showWriting: function(sub) {
            this.showView(WritingView).scrollTo(sub);
        },

        showManifest: function() {
            this.showView(ManifestView);
        },

        defaultAction: function (actions) {
            console.log("Actions: ", actions);
            window.location.replace("/#!about");
        }
    });

    return Router;
});
