// Author: Thomas Davis <thomasalwyndavis@gmail.com>
// Filename: main.js

var __dbv = "dev" + (new Date()).getTime();

if (!window['console']) {
  window['console'] = {
    log: function() { }
  };
}

// Require.js allows us to configure shortcut alias
// Their usage will become more apparent futher along in the tutorial.
require.config({
  paths: {
    jquery: [
        'libs/jquery'],
    underscore: [
        'libs/underscore'],
    backbone: [
        'libs/backbone'],
    bootstrap: [
        'libs/bootstrap.min'],
    facebook: [
        'https://connect.facebook.net/en_US/all'],
    googleplus: [
        'https://apis.google.com/js/client:plusone'],
    youtube: [
        'https://www.youtube.com/player_api?x'],
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
    bootstrap: {
      deps: ["jquery"],
      exports: "jQuery"
    },
    facebook: {
      exports: 'FB'
    },
    googleplus: {
      exports: 'gapi'
    },
    youtube: {
      exports: 'YT'
    }
  }
 ,urlArgs: __dbv 
});

require([
    'app'
], function(App){
    window.App = new App();
});
