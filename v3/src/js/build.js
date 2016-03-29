({
    appDir: "../",
    baseUrl: "js",
    dir: "../../build",
    modules: [{
        name: "main"
    }],
    skipDirOptimize: true,
    optimizeAllPluginResources: true,
    paths: {
        text: "../components/requirejs-text/text",
        jquery: "../components/jquery/dist/jquery",
        underscore: "../components/underscore/underscore",
        backbone: "../components/backbone/backbone",
        bootstrap: "../components/bootstrap/dist/js/bootstrap"
    },
    exclude: []
})
