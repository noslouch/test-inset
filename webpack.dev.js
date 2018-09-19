const merge = require('webpack-merge');
const common = require('./webpack.common.js');
const WebpackShellPlugin = require('webpack-shell-plugin');

const MiniCssExtractPlugin = require("mini-css-extract-plugin");

module.exports = merge(common, {
  mode: 'development',
  devtool: 'inline-source-map',
  output: {
    filename: 'local/[name].js'
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: 'local/[name].css'
    }),
    new WebpackShellPlugin({
      onBuildExit: ['node index.js --buildFallback']
    })
  ]
});