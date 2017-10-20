const webpack = require('webpack')
const universal = require('./universal')

module.exports = [
  {
    // The configuration for the client
    name: universal.name,
    target: universal.target,
    context: universal.context,
    entry: {
      app: [
        'react-hot-loader/patch',
        'webpack-hot-middleware/client?reload=true',
        './app'
      ]
    },
    output: {
      path: universal.output.path,
      filename: '[name].js',
      publicPath: universal.output.publicPath
    },
    devtool: 'cheap-module-source-map',
    module: universal.module,
    resolve: universal.resolve,
    plugins: [
      new webpack.HotModuleReplacementPlugin(),
      new webpack.NoEmitOnErrorsPlugin(),
      new webpack.DefinePlugin({
        'process.env': {
          NODE_ENV: JSON.stringify('dev')
        }
      }),
      universal.plugins.copy,
      universal.plugins.aggressiveMerging,
      universal.plugins.occurrenceOrder,
      universal.plugins.compression
    ],
    node: universal.node
  }
]
