define([
	'jquery',
	'underscore',
	'backbone',
	'text!templates/sidebar.html'
], function($, _, Backbone, sidebarTemplate){
    var SidebarView = Backbone.View.extend({
        el: $("header"),

        template: _.template(sidebarTemplate),

        initialize: function() {
            var self = this;
            self.render();
        },

        render: function() {
            this.$el.html(this.template({
                'title': "aorcsik.com",
                'url': "http://aorcsik.com/",
                'avatar': "http://www.gravatar.com/avatar/42be615fb210779dbb3752714e14c3ec.png?s=360",
                'social': {
                    medium: {
                        img: "images/medium-icon.png",
                        title: "Medium",
                        user: "@aorcsik",
                        url: "http://medium.com/@aorcsik"
                    },
                    twitter: {
                        url: "http://twitter.com/@aorcsik",
                        title: "Twitter",
                        user: "@aorcsik"
                    },
                    linkedin: {
                        url: "http://hu.linkedin.com/in/aorcsik/",
                        title: "LinkedIn",
                        user: "aorcsik"
                    },
                    github: {
                        url: "http://github.com/aorcsik",
                        title: "GitHub",
                        user: "aorcsik"
                    },
                    stackoverflow: {
                        url: "http://stackoverflow.com/users/601224/aorcsik",
                        title: "Stack Overflow",
                        user: "aorcsik"
                    },
                    deviantart: {
                        url: "http://aorcsik.deviantart.com/",
                        title: "deviantART",
                        user: "aorcsik"
                    }
                }
            }));
            return this;
        }
    });
    return new SidebarView();
});