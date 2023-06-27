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
    home: "js/home.js",
  },
  output: {
    path: path.resolve(__dirname, "docs"),
    filename: '[name].js',
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: "[name].css"
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
          filename: "images/[contenthash][ext]"
        }
      },
    ],
  }
};