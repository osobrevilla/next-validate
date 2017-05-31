const webpack = require('webpack');
const path = require('path');


module.exports = {
  entry: {
    NextValidate: './nextvalidate.js'
  },
  output: {
    path: path.join(__dirname, 'demo'),
    filename: '[name].bundle.js'
  },

  module: {
    rules: [{
      test: /\.js$/,
      exclude: /(node_modules|bower_components)/,
      use: {
        loader: 'babel-loader'
      }
    }]
  }
};