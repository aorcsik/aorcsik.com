// Filename: app.js
define([
    'jquery',
    'underscore',
    'backbone',
    'router'
], function($, _, Backbone, Router){

    if (String.prototype.trim === undefined) {
        String.prototype.trim = function() { return this.replace(/^\s+|\s+$/g, ''); };
    }

    Backbone.View.prototype.close = function() {
        console.log("Close View", this.cid);
        this.$el.remove();
        this.remove();
        this.unbind();
        if (this.onClose){
            this.onClose();
        }
    };

    var App = Backbone.View.extend({
        initialize: function() {
            $.ajaxSetup({
                statusCode: {
                    401: function() {  // Redirect the to the login page.
                        window.location.replace('/#login');
                    },
                    403: function() {  // 403 -- Access denied
                        window.location.replace('/#denied');
                    }
                }
            });
            var router = new Router();
        }
    });

    return App;
});
