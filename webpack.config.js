const webpack = require('webpack');
const path = require('path');
const ExtractTextPlugin = require('extract-text-webpack-plugin');

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
    path: path.resolve(__dirname, 'dist'),
    library: CONFIG.slug,
    libraryTarget: 'window'
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        use: ExtractTextPlugin.extract({
          fallback: 'style-loader',
          use: ['css-loader','postcss-loader','sass-loader']
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
    extractCSS
  ]
};

if(isProduction){
  options.plugins.push(new webpack.DefinePlugin({
    'process.env': {
      'NODE_ENV': JSON.stringify('production')
    }
  }))
}

module.exports = options;
