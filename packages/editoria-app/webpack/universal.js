const config = require('config')
const path = require('path')
const webpack = require('webpack')

const CompressionPlugin = require('compression-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const ThemePlugin = require('pubsweet-theme-plugin')

const commonRules = require('./common-rules')

module.exports = {
  context: path.join(__dirname, '..', 'app'),
  module: {
    rules: commonRules
  },
  name: 'app',
  node: {
    __dirname: true,
    dns: 'empty',
    fs: 'empty',
    net: 'empty'
  },
  output: {
    path: path.join(__dirname, '..', '_build', 'assets'),
    publicPath: '/assets/'
  },
  plugins: {
    aggressiveMerging: new webpack.optimize.AggressiveMergingPlugin(),
    compression: new CompressionPlugin({
      algorithm: 'gzip',
      asset: '[path].gz[query]',
      test: /\.js$|\.css$|\.html$/
    }),
    copy: new CopyWebpackPlugin([
      { from: '../static' }
    ]),
    occurrenceOrder: new webpack.optimize.OccurrenceOrderPlugin()
  },
  resolve: {
    alias: {
      config: path.resolve(__dirname, '..', 'config', 'client'),
      joi: 'joi-browser'
    },
    extensions: ['.js', '.jsx', '.json', '.scss'],
    modules: [
      path.resolve(__dirname, '..'),
      path.resolve(__dirname, '../node_modules'),
      path.resolve(__dirname, '../../../node_modules'),
      'node_modules'
    ],
    plugins: [new ThemePlugin(config['pubsweet-client'].theme)],
    symlinks: false
  },
  target: 'web'
}
