const path = require('path')

const babelIncludes = [
  new RegExp('/pubsweet-client/src'),
  new RegExp(path.join(__dirname, '../app')),
  new RegExp('/pubsweet-.*'),
  new RegExp('/editoria-.*'),
  new RegExp('/wax-editor-.*')
]

module.exports = babelIncludes
