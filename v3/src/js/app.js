// Filename: app.js
define([
    'jquery',
    'underscore',
    'backbone',
    'router'
], function($, _, Backbone, Router) {

    Backbone.View.prototype.close = function() {
        // console.log("Close View", this.cid);
        this.$el.remove();
        this.remove();
        this.unbind();
        if (this.onClose){
            this.onClose();
        }
    };

    var App = Backbone.View.extend({
        initialize: function() {
            var router = new Router();
        }
    });

    return App;
});
