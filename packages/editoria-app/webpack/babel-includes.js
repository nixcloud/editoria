const path = require('path')

const babelIncludes = [
  path.join(__dirname, '../app'), // this app
  new RegExp(path.join(__dirname, '../../[^/]+/src')), // local packages
  /pubsweet-component-/, // pubsweet components without `src` directories
  /pubsweet-[^/]+\/src/,
  /editoria-[^/]+\/src/,
  /wax-[^/]+\/src/,
  /@pubsweet\/[^/]+\/src/,
]

module.exports = babelIncludes
