// Author: Thomas Davis <thomasalwyndavis@gmail.com>
// Filename: main.js

// Require.js allows us to configure shortcut alias
// Their usage will become more apparent futher along in the tutorial.
require.config({
  paths: {
    jquery: [
        '//cdnjs.cloudflare.com/ajax/libs/jquery/2.0.3/jquery.min',
        'libs/jquery-min'],
    underscore: [
        '//cdnjs.cloudflare.com/ajax/libs/underscore.js/1.5.1/underscore-min',
        'libs/underscore-min'],
    backbone: [
        '//cdnjs.cloudflare.com/ajax/libs/backbone.js/1.0.0/backbone-min',
        'libs/backbone-min'],
    templates: '../templates'
  },
  shim: {
    underscore: {
      exports: '_'
    },
    backbone: {
      deps: ["underscore", "jquery"],
      exports: "Backbone"
    },
    bootstrap: ["jquery"]
  },
  urlArgs: "_dev=" + (new Date()).getTime()
});

require([
    'app'
], function(App){
    window.App = new App();
});
