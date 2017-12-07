const path = require('path')
const babelIncludes = require('./babel-includes')
const config = require('config')

const clientComponents = config.pubsweet.components.filter((name) => {
  let component = require(name)
  // Backwards compatibility - old name was 'frontend', new name is 'client'
  return component.client || component.frontend
})

module.exports = [
  {
    test: /\.js$|\.jsx$/,
    loader: 'babel-loader',
    query: {
      presets: [
        require('babel-preset-env'),
        require('babel-preset-react'),
        require('babel-preset-stage-2'),
      ],
      plugins: [
        require('react-hot-loader/babel'),
        require('babel-plugin-transform-decorators-legacy').default
      ],
    },
    include: babelIncludes
  },
  { test: /\.png$/, loader: 'url-loader' },
  {
    test: /\.woff|\.woff2|\.svg|.eot|\.ttf/,
    loader: [
      {
        loader: 'url-loader',
        options: {
          prefix: 'font',
          limit: 1000
        }
      }
    ]
  },
  { test: /\.html$/, loader: 'html-loader' },
  { test: /\.json$/, loader: 'json-loader' },
  { test: /\.css$|\.scss$/,
    exclude: /\.local\.s?css$/, // Exclude local styles from global
    loader: [
      {
        loader: 'style-loader'
      },
      {
        loader: 'css-loader'
      },
      {
        loader: 'sass-loader',
        options: {
          includePaths: [path.join(__dirname, '..', 'node_modules')]
        }
      }
    ]
  },
  { test: /\.css$|\.scss$/,
    include: /\.local\.s?css/, // Local styles
    loader: [
      {
        loader: 'style-loader'
      },
      {
        loader: 'css-loader',
        options: {
          modules: true,
          importLoaders: 1,
          localIdentName: '[name]_[local]-[hash:base64:8]'
        }
      },
      {
        loader: 'sass-loader',
        options: {
          includePaths: [path.join(__dirname, '..', 'node_modules')]
        }
      }
    ]
  },
  {
    test: /\.js$|\.jsx$/,
    loader: 'string-replace-loader',
    query: {
      search: 'PUBSWEET_COMPONENTS',
      replace: '[' + clientComponents.map(component => `require('${component}')`).join(', ') + ']'
    },
    include: babelIncludes
  }
]
