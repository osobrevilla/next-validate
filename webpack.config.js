const webpack = require('webpack')
const path = require('path')
const HTMLWebpackPlugin = require('html-webpack-plugin')
const CleanWebpackPlugin = require('clean-webpack-plugin')

const config = {
  entry: {
    NextValidate: path.resolve(__dirname, 'src/js', 'nextvalidate.js')
  },
  output: {
    path: path.join(__dirname, 'dist'),
    filename: 'nextvalidate.js',
    library: 'NextValidate',
    libraryTarget: 'umd2'
  },

  module: {
    rules: [{
      test: /\.js$/,
      exclude: /(node_modules|bower_components)/,
      use: {
        loader: 'babel-loader'
      }
    }, {
      test: /\.css/,
      use: ['style-loader', 'css-loader']
    }]
  },
  plugins: [
    new CleanWebpackPlugin(['dist'])
  ],
  devServer: {
    contentBase: path.resolve(__dirname, 'dist'),
    hot: true,
    open: true,
    openPage: '/demo01.html'
  }
}

if (process.env.NODE_ENV === 'development') {
  config.devtool = 'inline-source-map'
  config.plugins = config.plugins.concat([
    new webpack.NamedModulesPlugin(),
    new webpack.HotModuleReplacementPlugin(),
    new HTMLWebpackPlugin({
      filename: 'demo01.html',
      template: './src/html/demo01.html',
      inject: 'head'
    }),
    new HTMLWebpackPlugin({
      filename: 'demo02.html',
      template: './src/html/demo02.html',
      inject: 'head'
    })
  ])
}

if (process.env.NODE_ENV === 'production') {
  config.devtool = 'source-map'
}

module.exports = config
