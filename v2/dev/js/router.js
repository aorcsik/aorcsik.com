// Filename: router.js
define([
    'jquery',
    'underscore',
    'backbone',
    'views/about'
], function($, _, Backbone, AboutView) {

    var Router = Backbone.Router.extend({

        about: null,

        initialize: function() {
            Backbone.history.start();
            this.about = new AboutView();
            this.about.render();
        },

        routes: {
            // '!movie/:movie_id': "showMovieModal",

            // Default
            '*actions': 'defaultAction'
        },

        defaultAction: function (actions) {
            console.log(actions);
        }
    });

    return Router;
});
