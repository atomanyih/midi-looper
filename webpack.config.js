const HtmlWebPackPlugin = require("html-webpack-plugin");
const path = require('path');

const RENDERER_SRC_DIR = path.resolve(__dirname, './renderer');

module.exports = {
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        use: [{ loader: 'babel-loader' }],
        include: RENDERER_SRC_DIR
      },
      {
        test: /\.html$/,
        use: [
          {
            loader: "html-loader",
            options: { minimize: true },
          }
        ],
        include: RENDERER_SRC_DIR
      }
    ],
  },
  target: 'electron-renderer',
  plugins: [
    new HtmlWebPackPlugin({
      template: "./renderer/index.html",
      filename: "./index.html"
    })
  ],
  entry: './renderer/index.js'
};