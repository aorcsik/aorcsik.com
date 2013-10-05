define([
    'jquery',
    'underscore',
    'backbone',
    'views/nav',
    'views/content',
    'text!templates/drawing.html'
], function($, _, Backbone, navView, ContentView, drawingTemplate) {
    var DrawingView = ContentView.extend({
        template: _.template(drawingTemplate),

        render: function() {
            this.$el.html(this.template({}));
            navView.selected_menu_item = "drawing";
            navView.render();
            return this;
        }

    });
    return DrawingView;
});