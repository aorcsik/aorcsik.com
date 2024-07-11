const path = require('path');
const webpack = require('webpack');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

const getEntryPoint = (mode, entryPoint) => {
  return mode === "development" ? ['webpack-hot-middleware/client', entryPoint] : entryPoint;
};

const getPlugins = (mode, plugins) => {
  plugins = plugins || [];
  if (mode === 'development') {
    plugins.push(new webpack.HotModuleReplacementPlugin());
  }
  return plugins;
};

module.exports = (mode) => {
  return {
    mode,
    resolve: {
      modules: [
          path.resolve(__dirname, "src"),
          "node_modules"
      ]
    },
    optimization: {
      runtimeChunk: 'single'
    },
    entry: {
      blog: getEntryPoint(mode, "js/blog.js"),
      client: getEntryPoint(mode, "js/client.js"),
      pixelart: getEntryPoint(mode, "js/pixelart.js"),
    },
    output: {
      path: path.resolve(__dirname, "docs"),
      filename: '[name].bundle.js',
    },
    plugins: getPlugins(mode, [
      new MiniCssExtractPlugin({
        filename: "[name].bundle.css"
      }),
    ]),
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