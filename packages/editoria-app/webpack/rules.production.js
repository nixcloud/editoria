const ExtractTextPlugin = require('extract-text-webpack-plugin')
const include = require('./babel-includes')
const path = require('path')
const stringReplaceRule = require('./string-replace')

module.exports = [
  stringReplaceRule,
  {
    oneOf: [
      // ES6 JS
      {
        test: /\.jsx?$/,
        include,
        loader: 'babel-loader',
        options: {
          presets: [
            [require('babel-preset-env'), { modules: false }],
            require('babel-preset-react'),
            require('babel-preset-stage-2'),
          ],
        },
      },

      // CSS Modules
      {
        test: /\.css$|\.scss$/,
        include: /\.local\.s?css/, // Local styles
        use: ExtractTextPlugin.extract({
          fallback: 'style-loader',
          use: [
            {
              loader: 'css-loader',
              options: {
                modules: true,
                importLoaders: 1,
                localIdentName: '[name]_[local]-[hash:base64:8]',
              },
            },
            {
              loader: 'sass-loader',
              options: {
                includePaths: [path.join(__dirname, '..', 'node_modules')],
              },
            },
          ],
        }),
      },
      // global CSS
      {
        test: /\.css$|\.scss$/,
        exclude: /\.local\.s?css$/,
        use: ExtractTextPlugin.extract({
          fallback: 'style-loader',
          use: [
            'css-loader',
            {
              loader: 'sass-loader',
              options: {
                includePaths: [path.join(__dirname, '..', 'node_modules')],
              },
            },
          ],
        }),
      },
      // files
      {
        exclude: [/\.jsx?$/, /\.html$/, /\.json$/],
        loader: 'file-loader',
        options: {
          name: 'static/media/[name].[hash:8].[ext]',
        },
      },
    ],
  },
]
