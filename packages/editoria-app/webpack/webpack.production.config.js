const webpack = require('webpack')
const path = require('path')
const ExtractTextPlugin = require('extract-text-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')

const universal = require('./universal')

module.exports = [
  {
    // The configuration for the client
    name: universal.name,
    target: universal.target,
    context: universal.context,
    entry: {
      app: [
        './app'
      ]
    },
    output: {
      path: universal.output.path,
      filename: '[name]-[hash].js',
      publicPath: universal.output.publicPath
    },
    module: universal.module,
    resolve: universal.resolve,
    plugins: [
      new HtmlWebpackPlugin({
        title: 'Editoria',
        template: '../app/index.ejs', // Load a custom template
        inject: 'body' // Inject all scripts into the body
      }),
      new webpack.DefinePlugin({
        'process.env.NODE_ENV': JSON.stringify('production')
      }),
      // new webpack.ProvidePlugin({
      //   CONFIG: path.resolve(__dirname, '..', 'config', 'production.js')
      // }),
      new ExtractTextPlugin('styles/main.css'),
      universal.plugins.copy,
      universal.plugins.aggressiveMerging,
      universal.plugins.occurrenceOrder,
      universal.plugins.compression
    ],
    node: universal.node
  }
]
