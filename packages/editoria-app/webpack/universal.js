const path = require('path')

module.exports = {
  context: path.join(__dirname, '..', 'app'),
  name: 'app',
  node: {
    __dirname: true,
    fs: 'empty'
  },
  output: {
    path: path.join(__dirname, '..', '_build', 'assets'),
    publicPath: '/assets/'
  },
  target: 'web'
}
