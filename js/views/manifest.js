define([
    'jquery',
    'underscore',
    'backbone',
    'views/nav',
    'views/content',
    'text!templates/manifest.html'
], function($, _, Backbone, navView, ContentView, manifestTemplate) {
    var ManifestView = ContentView.extend({
        template: _.template(manifestTemplate),

        render: function() {
            this.$el.html(this.template({}));
            navView.selected_menu_item = "manifest";
            navView.render();
            return this;
        }

    });
    return ManifestView;
});