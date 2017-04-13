const webpack = require('webpack');
const path = require('path');
const {
  CheckerPlugin
} = require('awesome-typescript-loader')


module.exports = {
  entry: {
    nextvalidate: './nextvalidate.ts'
  },
  output: {
    path: path.join(__dirname, 'demo'),
    filename: '[name].bundle.js'
  },
  module: {
    loaders: [{
      test: /\.tsx?$/,
      loader: 'awesome-typescript-loader?useBabel=true'
    }]
  },
  resolve: {
    extensions: [".tsx", ".ts", ".js"]
  }
};
