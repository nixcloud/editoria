const path = require('path')

const babelIncludes = [
  new RegExp(path.join(__dirname, '../../../node_modules/pubsweet-client/src')),
  new RegExp(path.join(__dirname, '../app')),
  new RegExp(path.join(__dirname, '../../../node_modules/pubsweet-.*')),
  new RegExp(path.join(__dirname, '../../../node_modules/editoria-.*')),
  new RegExp(path.join(__dirname, '../../../node_modules/wax-editor-.*'))

]

module.exports = babelIncludes
