const webpack = require('webpack');
const path = require('path');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const WebpackShellPlugin = require('webpack-shell-plugin');

const isProduction = process.env.NODE_ENV === 'production';

const cssName = isProduction ? 'remote/[name].min.css' : 'local/[name].css';
const extractCSS = new ExtractTextPlugin(cssName);
const CONFIG = require('./inset/data.json');

const options = {
  devtool: 'source-map',
  entry: {
    app: './src/index.js'
  },
  output: {
    filename: isProduction ? 'remote/[name].min.js' : 'local/[name].js',
    path: path.resolve(__dirname, 'dist')
  },
  module: {
    rules: [
      {
        test: /\.s?css$/,
        use: ExtractTextPlugin.extract({
          fallback: 'style-loader',
          use: [{
            loader: 'css-loader',
            options: {
              url: false
            }
          },'postcss-loader','sass-loader']
        })
      },
      {
        test: /\.js$/,
        exclude: /(node_modules)/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['babel-preset-env']
          }
        }
      },
      {
        test: /\.[ct]sv$/,
        use: [{
          loader: "dsv-loader"
        }]
      }
    ]
  },
  plugins: [
    extractCSS,
    new webpack.ProvidePlugin({
      $: 'jquery',
      jQuery: 'jquery',
      'window.jQuery': 'jquery'
    })
  ]
};

if(isProduction){
  options.plugins.push(new webpack.DefinePlugin({
    'process.env': {
      'NODE_ENV': JSON.stringify('production')
    }
  }))
} else {
  //if not production, assume watch mode and try building fallback
  options.plugins.push(new WebpackShellPlugin({
      onBuildExit: ['node index.js --buildFallback']
  }))
}

module.exports = options;
