define([
    'jquery',
    'underscore',
    'backbone',
    'text!../../templates/navigation.html'
], function($, _, Backbone, navigationTemplate){
    var NavigationView = Backbone.View.extend({
        id: "navigation",
        tagName: "nav",
        initialize: function() {

        },
        template: _.template(navigationTemplate),

        selectNavItem: function(navItem) {
            var self = this;
            this.$el.find(".nav-item").removeClass("selected");
            this.$el.find("#nav_" + navItem).addClass("selected");
            window.setTimeout(function() {
                self.updateSelectionIndicator();
            }, 100);
        },

        updateSelectionIndicator: function() {
            var $selected = this.$el.find(".selected");
            this.$el.find(".selection-indicator").css({
                'left': $selected.offset().left,
                'width': $selected.outerWidth(),
                'background-color': $selected.css("color")
            });
        },

        render: function() {
            var self = this;
            this.$el.html(this.template({

            }));
            $(window).resize(function() {
                self.updateSelectionIndicator();
            });
        }
    });
    return NavigationView;
});
