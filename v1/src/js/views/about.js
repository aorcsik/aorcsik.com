define([
    'jquery',
    'underscore',
    'backbone',
    'views/nav',
    'views/content',
    'text!templates/about.html'
], function($, _, Backbone, navView, ContentView, aboutTemplate) {
    var AboutView = ContentView.extend({
        template: _.template(aboutTemplate),

        birthday: "1984-09-04",
        age: function() {
            var d = new Date(this.birthday),
                now = new Date();
            return Math.floor((now.getTime() - d.getTime()) / (60 * 60 * 24 * 365 * 1000));
        },

        render: function() {
            this.$el.html(this.template({
                age: this.age()
            }));
            navView.selected_menu_item = "about";
            navView.render();
            return this;
        }

    });
    return AboutView;
});