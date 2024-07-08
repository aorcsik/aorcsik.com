const path = require('path');
const webpack = require('webpack');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

module.exports = (mode) => {
  const plugins = [
    new MiniCssExtractPlugin({
      filename: "[name].bundle.css"
    }),
  ];
  if (mode === 'development') {
    plugins.push(new webpack.HotModuleReplacementPlugin());
  }

  return {
    mode,
    resolve: {
      modules: [
          path.resolve(__dirname, "src"),
          "node_modules"
      ]
    },
    entry: {
      blog: "js/blog.js",
      client: "js/client.js",
      pixelart: "js/pixelart.js",
    },
    output: {
      path: path.resolve(__dirname, "docs"),
      filename: '[name].bundle.js',
    },
    plugins,
    module: {
      rules: [
        {
          test: /\.css$/,
          use: [{
            loader: MiniCssExtractPlugin.loader
          },{
            loader: "css-loader"
          }],
          include: path.resolve(__dirname, "src/css")
        },
        {
          test: /\.(png|jpg|gif|webp|svg)/,
          type: "asset/resource",
          generator: {
            filename: "images/[name][ext]"
          }
        },
      ],
    }
  };
};