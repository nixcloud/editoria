const webpack = require('webpack')
const ExtractTextPlugin = require('extract-text-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const ThemePlugin = require('pubsweet-theme-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const CompressionPlugin = require('compression-webpack-plugin')
const UglifyJSPlugin = require('uglifyjs-webpack-plugin')

const universal = require('./universal')

const path = require('path')
const fs = require('fs-extra')
const config = require('config')
const { pick } = require('lodash')

// console.log('conf', config)
// can't use node-config in webpack so save whitelisted client config into the build and alias it below
const clientConfig = pick(config, config.publicKeys)
fs.ensureDirSync(universal.output.path)
const clientConfigPath = path.join(universal.output.path, 'client-config.json')
fs.writeJsonSync(clientConfigPath, clientConfig, { spaces: 2 })

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
    module: {
      rules: require('./common-rules'),
    },
    resolve: {
      alias: {
        config: clientConfigPath,
        joi: 'joi-browser'
      },
      enforceExtension: false,
      extensions: ['.js', '.jsx', '.json', '.scss'],
      modules: [
        path.resolve(__dirname, '..'),
        path.resolve(__dirname, '../node_modules'),
        path.resolve(__dirname, '../../../node_modules'),
        'node_modules'
      ],
      plugins: [new ThemePlugin(config['pubsweet-client'].theme)],
    },
    plugins: [
      new HtmlWebpackPlugin({
        title: 'Editoria',
        template: '../app/index.ejs', // Load a custom template
        inject: 'body' // Inject all scripts into the body
      }),
      new webpack.DefinePlugin({
        'process.env.NODE_ENV': JSON.stringify('production')
      }),
      new ExtractTextPlugin('styles/main.css'),
      new webpack.ContextReplacementPlugin(/./, __dirname, {
        [config.authsome.mode]: config.authsome.mode,
        [config.validations]: config.validations
      }),
      new CopyWebpackPlugin([
        { from: '../static' }
      ]),
      new webpack.optimize.AggressiveMergingPlugin(),
      new webpack.optimize.OccurrenceOrderPlugin(),
      new CompressionPlugin({
        algorithm: 'gzip',
        asset: '[path].gz[query]',
        test: /\.js$|\.css$|\.html$/
      }),
      new UglifyJSPlugin(),
    ],
    node: universal.node
  }
]
