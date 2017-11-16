const config = require('config')
const path = require('path')
const webpack = require('webpack')

const CompressionPlugin = require('compression-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const ThemePlugin = require('pubsweet-theme-plugin')

const commonRules = require('./common-rules')
const fs = require('fs-extra')
const { pick } = require('lodash')

const outputPath = path.resolve(__dirname, '..', '_build', 'assets')

// can't use node-config in webpack so save whitelisted client config into the build and alias it below
const clientConfig = pick(config, config.publicKeys)
console.log('clientConfig', clientConfig)
fs.ensureDirSync(outputPath)
const clientConfigPath = path.join(outputPath, 'client-config.json')
fs.writeJsonSync(clientConfigPath, clientConfig, { spaces: 2 })

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
      config: clientConfigPath,
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
    contextReplacement: [new webpack.ContextReplacementPlugin(/./, __dirname, {
      [config.authsome.mode]: config.authsome.mode,
      [config.validations]: config.validations
    })],
    symlinks: false
  },
  target: 'web'
}
