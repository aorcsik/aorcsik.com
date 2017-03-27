import markdown from 'markdown/lib/markdown';

var App = Backbone.View.extend({
    el: "#content",

    initialize: function() {

        this.render();
    },

    render: function() {
        this.$el.html(markdown.toHTML(require("../md/test.md")));

        return this;
    }
});


var app = new App();
