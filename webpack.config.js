const webpack = require('webpack');
const path = require('path');


module.exports = {
  entry: {
    NextValidate: './nextvalidate.js'
  },
  output: {
    path: path.join(__dirname, 'demo'),
    filename: 'nextvalidate.js',
    library: 'NextValidate',
    libraryTarget: 'umd'
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