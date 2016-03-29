define([
    'jquery',
    'underscore',
    'backbone',
    'text!../../templates/content.html'
], function($, _, Backbone, contentTemplate){
    var ContentView = Backbone.View.extend({
        id: "content",
        tagName: "section",
        className: "container",
        initialize: function() {

        },
        template: _.template(contentTemplate),

        loadContent: function(content_name) {
            var self = this;
            this.$el.html("");
            this.model.get(content_name).forEach(function(content_data) {
                self.$el.append(self.template(content_data));
            });
            this.updateContentSize();
        },

        updateContentSize: function() {
            /* this.$el.find(".content_card").css({
                'width': $(window).width(),
                'min-height': $(window).height()
            }); */
        },

        render: function() {
            var self = this;
            $(window).resize(function() {
                self.updateContentSize();
            });
        }
    });
    return ContentView;
});
