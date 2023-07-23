const path = require('path');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

module.exports = {
  resolve: {
    modules: [
        path.resolve(__dirname, "src"),
        "node_modules"
    ]
  },
  entry: {
    client: "js/client.js",
    pixelart: "js/pixelart.js",
  },
  output: {
    path: path.resolve(__dirname, "docs"),
    filename: '[name].bundle.js',
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: "[name].bundle.css"
    }),
  ],
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