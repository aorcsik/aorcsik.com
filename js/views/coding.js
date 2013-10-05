define([
    'jquery',
    'underscore',
    'backbone',
    'views/nav',
    'views/content',
    'text!templates/coding.html'
], function($, _, Backbone, navView, ContentView, codingTemplate) {
    var CodingView = ContentView.extend({
        template: _.template(codingTemplate),

        render: function() {
            this.$el.html(this.template({}));
            navView.selected_menu_item = "coding";
            navView.render();
            return this;
        }

    });
    return CodingView;
});