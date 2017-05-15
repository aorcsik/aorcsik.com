var path = require('path');
var webpack = require('webpack');

var HtmlWebpackPlugin = require('html-webpack-plugin');
var ExtractTextPlugin = require("extract-text-webpack-plugin");
var UglifyJSPlugin = require('uglifyjs-webpack-plugin');

var PROD = process.env.NODE_ENV == "production";


module.exports = {
    resolve: {
        modules: [
            path.resolve(__dirname, "src"),
            "node_modules"
        ]
    },
    entry: {
        app: "js/index.js",
        vendor: [
            "jquery"
        ],
    },
    output: {
        path: path.resolve(__dirname, "dist"),
        filename: "[name].bundle.js"
    },
    plugins: [
        new webpack.ProvidePlugin({
            $: 'jquery',
            jQuery: 'jquery'
        }),
        new ExtractTextPlugin("[name].bundle.css"),
        new webpack.optimize.CommonsChunkPlugin({
            name: "vendor",
            filename: "vendor.bundle.js"
        }),
        new HtmlWebpackPlugin({
          title: 'Antal Orcsik',
          template: path.resolve(__dirname, 'src/ejs/index.ejs'),
          minify: {removeComments: true},
          hash: true,
        })
    ].concat(PROD ? [
        new UglifyJSPlugin()
    ] : []),
    module: {
        rules: [
            {
                test: /\.css$/,
                use: ExtractTextPlugin.extract([{
                    loader: "css-loader",
                    options: {minimize: PROD}
                }])
            },
            {
                test: /\.less$/,
                use: ExtractTextPlugin.extract([{
                    loader: "css-loader",
                    options: {minimize: PROD}
                },{
                    loader: "less-loader"
                }]),
                include: path.resolve(__dirname, "src/less")
            },
            {
                test: /\.jsx?/,
                use: ["babel-loader"],
                include: path.resolve(__dirname, "src/js")
            },
            {
                test: /\.html$/,
                use: ["raw-loader"]
            },
            {
                test: /\.json$/,
                use: ["raw-loader"]
            },
            {
                test: /\.(png|jpg|gif)/,
                use: [{
                    loader: "file-loader",
                    options: {name: "images/[hash].[ext]"}
                }]
            },
            {
                test: /\.(eot|svg|ttf|woff|woff2|otf)(\?v=.*)?$/,
                use: [{
                    loader: "file-loader",
                    options: {name: "fonts/[hash].[ext]"}
                }]
            }
        ]
    }
};
