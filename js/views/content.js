define([
    'jquery',
    'underscore',
    'backbone'
], function($, _, Backbone) {
    var ContentView = Backbone.View.extend({
        scrollTo: function(sub) {
            sub = sub || "top";
            console.log(sub);
            var to = this.$el.find("a[name=" + sub + "]").offset().top;
            $("html,body").animate({ 'scrollTop': to - 60 }, 1000);
            return this;
        }
    });
    return ContentView;
});