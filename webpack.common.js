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
      blog: getEntryPoint(mode, "js/client/blog.js"),
      client: getEntryPoint(mode, "js/client/client.js"),
      pixelart: getEntryPoint(mode, "js/client/pixelart.js"),
      editor: getEntryPoint(mode, "js/client/editor.js"),
      preview: getEntryPoint(mode, "js/client/preview.js"),
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