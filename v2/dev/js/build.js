({
    appDir: "../",
    baseUrl: "js",
    dir: "../../web",
    modules: [{
        name: "main"
    }],
    optimizeAllPluginResources: true,
    paths: {
        jquery: "libs/jquery",
        underscore: "libs/underscore",
        backbone: "libs/backbone",
        bootstrap: "libs/bootstrap.min",
        facebook: "empty:",
        googleplus: "empty:",
        youtube: "empty:"
    },
    exclude: ["facebook","googleplus","youtube"]
})