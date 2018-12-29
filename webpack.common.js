/* eslint-env amd,node,browser:false */

const path = require("path");
const webpack = require("webpack");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

module.exports = {
  resolve: {
    modules: [
      path.resolve(__dirname, "src"),
      "node_modules"
    ]
  },
  entry: {
    app:   "js/index.jsx"
  },
  output: {
    path: path.resolve(__dirname, "docs"),
    filename: "[name].bundle.js"
  },
  plugins: [
    new webpack.ProvidePlugin({
      "$": "jquery",
      "jQuery": "jquery",
      "window.jQuery": "jquery",
      "React": "react",
      "window.React": "react"
    }),
    new MiniCssExtractPlugin({
      filename: "[name].bundle.css"
    }),
  ],
  optimization: {
    splitChunks: {
      cacheGroups: {
        commons: {
          test: /[\\/]node_modules[\\/]/,
          name: "vendor",
          chunks: "all"
        }
      }
    }
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [MiniCssExtractPlugin.loader, "css-loader"]
      },
      {
        test: /\.scss$/,
        use: [MiniCssExtractPlugin.loader, "css-loader", "sass-loader"],
        include: path.resolve(__dirname, "src/scss")
      },
      {
        test: /\.jsx?/,
        use: ["babel-loader"],
        include: path.resolve(__dirname, "src/js")
      },
      {
        test: /\.(png|jpg|gif)/,
        use: [{
          loader: "file-loader",
          options: {name: "/images/[hash].[ext]"}
        }]
      },
      {
        test: /\.(eot|svg|ttf|woff|woff2|otf)(\?v=.*)?$/,
        use: [{
          loader: "file-loader",
          options: {name: "/fonts/[hash].[ext]"}
        }]
      }
    ]
  }
};
