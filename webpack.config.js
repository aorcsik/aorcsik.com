var path = require('path');
var webpack = require('webpack');

var HtmlWebpackPlugin = require('html-webpack-plugin');
var ExtractTextPlugin = require("extract-text-webpack-plugin");

var APP_DIR = path.resolve(__dirname + "/src");
var BUILD_DIR = path.resolve(__dirname + "/dist");

module.exports = {
    entry: {
        'app':   APP_DIR + "/js/app.js",
    },
    output: {
        path: BUILD_DIR,
        filename: "[name].bundle.js"
    },
    plugins: [
        new webpack.ProvidePlugin({
            $: 'jquery',
            jQuery: 'jquery',
            _: 'underscore',
            Backbone: 'backbone'
        }),
        new ExtractTextPlugin("[name].bundle.css"),
        new HtmlWebpackPlugin({
          title: 'Antal Orcsik',
          template: APP_DIR + '/ejs/index.ejs',
          minify: {removeComments: true},
          hash: true,
        })
    ],
    module: {
        loaders: [
            { test: /\.css$/, loader: ExtractTextPlugin.extract(["css-loader?minimize"]) },
            { test: /\.less$/, loader: ExtractTextPlugin.extract(["css-loader?minimize", "less-loader"]), include: APP_DIR + "/less" },
            { test: /\.jsx?/, loader : "babel", include: APP_DIR + "/js" },
            { test: /\.html$/, loader: "raw" },
            { test: /\.md$/, loader: "raw"},
            { test: /\.json$/, loader: "raw"},
            { test: /\.(png|jpg|gif)/, loader: "file-loader?name=images/[hash].[ext]" },
            { test: /\.(eot|svg|ttf|woff|woff2|otf)(\?v=.*)?$/, loader: "file-loader?name=fonts/[hash].[ext]" },
        ]
    }
};
