// Author: Thomas Davis <thomasalwyndavis@gmail.com>
// Filename: main.js

var __dbv = "dev" + (new Date()).getTime();

if (window.console === undefined) {
    window.console = {log: function() {}};
}

// Require.js allows us to configure shortcut alias
// Their usage will become more apparent futher along in the tutorial.
require.config({
  paths: {
    text: [
        '../components/requirejs-text/text'],
    jquery: [
        '../components/jquery/dist/jquery'],
    underscore: [
        '../components/underscore/underscore'],
    backbone: [
        '../components/backbone/backbone'],
    bootstrap: [
        '../components/bootstrap/dist/js/bootstrap'],
    templates: '../' + 'templates'
  },
  shim: {
    underscore: {
      exports: '_'
    },
    backbone: {
      deps: ["underscore", "jquery"],
      exports: "Backbone"
    },
    bootstrap: {
      deps: ["jquery"],
      exports: "jQuery"
    }
  },
  urlArgs: __dbv
});

require([
    'app'
], function(App){
    window.App = new App();
});
