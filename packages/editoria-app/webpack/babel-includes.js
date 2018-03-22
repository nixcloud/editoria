// const path = require('path')

// const babelIncludes = [
//   path.join(__dirname, '../app'), // this app
//   new RegExp(path.join(__dirname, '../../[^/]+/src')), // local packages
//   /pubsweet-component-/, // pubsweet components without `src` directories
//   /pubsweet-[^/]+\/src/,
//   /editoria-[^/]+\/src/,
//   /wax-[^/]+\/src/,
//   /@pubsweet\/[^/]+\/src/,
// ]

// module.exports = babelIncludes

const path = require('path')

// paths that use ES6 scripts and CSS modules
// TODO: compile components to ES5 for distribution

module.exports = [
  // include app folder
  path.join(__dirname, '..', 'app'),
  // include pubsweet and editoria packages which are published untranspiled
  /editoria-[^/]+\/src/,
  /wax-[^/]+\/src/,
  /pubsweet-[^/\\]+\/(?!node_modules)/,
  /@pubsweet\/[^/\\]+\/(?!node_modules)/,
  // include pubsweet packages when npm linked from monorepo
  filepath =>
    // is a child of packages but not node_modules
    filepath.match(/\/packages\//) && !filepath.match(/\/node_modules\//),
]
