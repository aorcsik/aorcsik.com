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

        render: function(content_name) {
            var self = this,
                content_class = "content-" + content_name;
            this.$el.children("div").hide();
            if (this.$el.find("." + content_class).size() === 0) {
                var $content = $("<div>").addClass(content_class).appendTo(this.$el).hide();
                this.model.get(content_name).forEach(function(content_data) {
                    $content.append(self.template(content_data));
                });
            }
            this.$el.find("." + content_class).show();
            return this;
        }
    });
    return ContentView;
});
