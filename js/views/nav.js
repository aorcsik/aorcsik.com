define([
  'jquery',
  'underscore',
  'backbone',
  'text!templates/nav.html'
], function($, _, Backbone, navTemplate){

  var NavView = Backbone.View.extend({
    el: $("nav.nav"),

    template: _.template(navTemplate),

    initialize: function() {
        var self = this;
        self.render();
    },

    menu_items: {
      about: "About me",
      coding: "Coding",
      writing: "Writing",
      drawing: "Drawing",
      manifest: "Manifest"
    },
    selected_menu_item: null,

    render: function() {
      this.$el.html(this.template({
        menu_items: this.menu_items,
        selected: this.selected_menu_item
      }));
      return this;
    }

  });

  return new NavView();
});