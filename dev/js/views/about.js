define([
    'jquery',
    'underscore',
    'backbone'
], function($, _, Backbone) {
    var AboutView = Backbone.View.extend({
        el: "#main",
        canvas: null,
        context: null,

        nodecount: 0,
        finished: 0,

        pageX: 0,
        pageY: 0,

        window_width: 0,
        startx: 0,
        starty: 0,

        initialize: function() {
            this.canvas = this.$el.find("canvas")[0];
            if (this.canvas.getContext) {
                this.context = this.canvas.getContext('2d');
            } else {
                // Not supported!
            }

            var self = this;
            $(window).resize(function() {
                var ww = $(window).width();
                if (self.window_width > 500 && ww <= 500) self.render();
                if (self.window_width <= 500 && ww > 500) self.render();
            });
        },

        parseNodes: function($nodes) {
            var self = this;
            var nodes = [];
            $nodes.each(function() {
                var $data_node = $(this).children("header");
                var id = $data_node.attr("id");
                var node = {
                    'id': id,
                    'dx': parseFloat($data_node.css("margin-left")),
                    'dy': parseFloat($data_node.css("margin-top")),
                    'r': parseFloat($data_node.css("width")),
                    'href': null,
                    'label': null,
                    'icon': null,
                    'image': null,
                    'nodes': [],
                    'step': 5,
                    'container': null,
                    'label_appended': false,
                    'icon_appended': false,
                    'finished': false
                };
                var $a = $data_node.find(".node_text");
                if (!$a.is("a")) $a = $a.children("a");
                if ($a.size() > 0) {
                    node.href = $a.attr("href").replace(/\[kukac\]/, "@").replace(/\[pont\]/, ".");
                    $a.attr("href", node.href);
                }
                if (node.href) {
                    node.icon = $("<a href='" + node.href + "' class='node' id='node_" + node.id + "'></a>");
                    $icon = $(this).children("i");
                    if ($icon.size() > 0) {
                        node.icon.append($icon.clone());
                    }
                    var $img = $(this).children("img");
                    if ($img.size() > 0) {
                        node.image = $img[0];
                    }
                    var $node_text = $data_node.find(".node_text");
                    if ($node_text.size() > 0) {
                        node.label = $node_text.clone().attr("id", "node_text_" + id);
                    }
                } else {
                    node.icon = $("<span class='node' id='node_" + node.id + "'></span>");
                }       
                var $sub_nodes = $(this).children("ul");
                if ($sub_nodes.size() > 0) {
                    node.nodes = self.parseNodes($sub_nodes.children("li"));
                }
                nodes.push(node);
                self.nodecount++;
            });
            return nodes;
        },

        generateNodes: function(x, y, alpha, depth) {
            if (depth == 0) return [];
            var nodes = [];
            for (var i = 0; i < 1 + Math.ceil(Math.random() * 3); i++) {
                do {
                    var beta = Math.random() * 2 * Math.PI;
                } while (alpha != null && Math.abs(alpha-beta) > Math.PI / 3);

                var xx = x + Math.sin(beta) * (50 + Math.random() * 300);
                var yy = y + Math.cos(beta) * (50 + Math.random() * 300);

                nodes.push({
                    'dx': xx,
                    'yy': yy,
                    'r': 10,
                    'nodes': this.generateNodes(xx, yy, beta, depth - 1) 
                });
            }
            return nodes;
        },

        onClose: function() {

        },

        draw: function(x, y, nodes, depth) {
            var self = this;
            _.each(nodes, function(node) {
                var dx = node.dx * 1.0 + self.pageX / 20;
                var dy = node.dy * 1.0 + self.pageY / 20;
                var d = Math.sqrt(dx * dx + dy * dy);

                if (node['l'] == undefined) node.l = 0.0;
                if (node.l < d) node.l += node.step;
                if (node.l >= d) node.l = d;

                var sx = node.l * (dx / d);
                var sy = node.l * (dy / d);

                var r, g, b;
                r = g = b = 50 + depth * 50;
                var color = "rgb(" + r + "," + g + "," + b + ")";
                var color = "#cccccc";

                self.context.lineWidth = 5;
                self.context.strokeStyle = color;
                self.context.lineCap = 'round';
                self.context.beginPath();
                self.context.moveTo(x, y);
                self.context.lineTo(x + sx, y + sy);
                self.context.stroke();
                
                if (node.l != d) {

                    self.context.beginPath();
                    self.context.arc(x + sx, y + sy, 6, 0, 2 * Math.PI, false);
                    self.context.fillStyle = color;
                    self.context.fill();

                } else {

                    if (node.nodes.length > 0) {
                        self.draw(x + dx, y + dy, node.nodes, depth - 1);
                    }

                    if (node['s'] == undefined) node.s = 0;
                    var circle_step = Math.max(0.1, (node.r - node.s) / 16)
                    if (node.s < node.r) node.s += circle_step;
                    if (node.s >= node.r) node.s = node.r;

                    self.context.beginPath();
                    self.context.arc(x + dx, y + dy, node.s, 0, 2 * Math.PI, false);
                    self.context.fillStyle = color;
                    self.context.fill();

                    if (node.image) {
                        self.context.save();
                        self.context.beginPath();
                        self.context.arc(x + dx, y + dy, Math.max(0, node.s - 6), 0, 2 * Math.PI, false);
                        self.context.clip();

                        self.context.drawImage($(node['image'])[0],
                            x + dx - node.s,
                            y + dy - node.s,
                            node.s * 2,
                            node.s * 2
                        );

                        self.context.restore();
                    }

                    if (!node.container) {
                        node.container = $("<div class='node_container'></div>");
                        self.$el.append(node.container);
                    }

                    if (node.label) {
                        if (!node.label_appended) {
                            node.container.append(node.label);
                            node.label_appended = true;
                        }
                        node.label.css({
                            'left': (x + dx) / 2 + node.s / 2,
                            'top': (y + dy) / 2,
                            'color': color,
                            // 'font-size': (node.r / 40) + "em",
                            'opacity': Math.min(1.0, node.s / node.r)
                        });
                    }

                    if (node.icon) {
                        if (!node.icon_appended) {
                            node.container.append(node.icon);
                            node.icon_appended = true;
                        }
                        node.icon.css({
                            'left': (x + dx) / 2 - node.s / 2,
                            'top': (y + dy) / 2 - node.s / 2,
                            'color': color,
                            'width': node.s,
                            'height': node.s
                        });
                    }

                    if (node.s == node.r && !node.finished) {
                        node.finished = true;
                        self.finished++;
                        node.container.addClass("over");
                        window.setTimeout(function() {
                            node.container.removeClass("over");
                        }, 600);
                    }
                }
            });
        },

        frames: [],
        fps: function() {
            var now = (new Date()).getTime();
            this.frames.push(now);
            this.frames = this.frames.filter(function(frame) { return frame >= now - 1000; });
            return this.frames.length / (now - this.frames[0]) * 1000;
        },

        redraw: function() {
            var self = this;
            if (this.context) {
                window.setTimeout(function() {
                    self.context.clearRect(0, 0, self.canvas.width, self.canvas.height);
                    self.draw(self.startx, self.starty, self.nodes, 5);
                    self.$el.find("#fps").show().text(self.fps().toFixed(2) + " fps");

                    if (self.finished != self.nodecount) {
                        self.redraw();
                    } else {
                        self.$el.find("#fps").hide();
                    }
                }, 1000 / 120);
            }
        },

        render: function() {

            this.nodes = this.parseNodes($("#data"));
            this.window_width = $(window).width();
            this.startx = parseFloat($("#data").css("margin-left"));
            this.starty = parseFloat($("#data").css("margin-top"));

            this.$el.find(".node_text, .node").remove();
            this.redraw();
        }
    });
    return AboutView;
});