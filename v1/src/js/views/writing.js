define([
    'jquery',
    'underscore',
    'backbone',
    'views/nav',
    'views/content',
    'text!templates/writing.html'
], function($, _, Backbone, navView, ContentView, writingTemplate) {
    var WritingView = ContentView.extend({
        template: _.template(writingTemplate),

        render: function() {
            this.$el.html(this.template({}));
            navView.selected_menu_item = "writing";
            navView.render();
            return this;
        }

    });
    return WritingView;
});