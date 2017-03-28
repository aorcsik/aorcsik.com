import MarkdownIt from 'markdown-it';

require("../less/app.less");

var App = Backbone.View.extend({
    el: "#content",

    initialize: function() {

        this.render();
    },

    render: function() {
        var md = new MarkdownIt({
            html: true
        });
        this.$el.html($("<div id='main'>").html(md.render(require("../md/main.md"))));

        return this;
    }
});


var app = new App();
