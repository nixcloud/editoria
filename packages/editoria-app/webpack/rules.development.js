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
          plugins: [require('react-hot-loader/babel')],
        },
      },

      // CSS Modules
      {
        test: /\.css$|\.scss$/,
        include: /\.local\.s?css/, // Local styles
        use: [
          'style-loader',
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
      },

      // global CSS
      {
        test: /\.css$|\.scss$/,
        exclude: /\.local\.s?css$/,
        use: [
          'style-loader',
          'css-loader',
          {
            loader: 'sass-loader',
            options: {
              includePaths: [path.join(__dirname, '..', 'node_modules')],
            },
          },
        ],
      },
      // files
      {
        exclude: [/\.jsx?$/, /\.html$/, /\.json$/],
        loader: 'file-loader',
        options: {
          name: 'static/media/[name].[hash:8].[ext]',
        },
      },
      { test: /\.png$/, loader: 'url-loader' },
      {
        test: /\.woff|\.woff2|\.svg|.eot|\.ttf/,
        loader: [
          {
            loader: 'url-loader',
            options: {
              prefix: 'font',
              limit: 1000,
            },
          },
        ],
      },
    ],
  },
]
