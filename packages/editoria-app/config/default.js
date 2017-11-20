const path = require('path')
const components = require('./components')

const bookBuilder = require('./modules/book-builder')
const teams = require('./modules/teams')

const environment = process.env.NODE_ENV || 'development'

module.exports = {
  authsome: {
    mode: path.join(__dirname, 'modules', 'mode'),
    teams,
  },
  // 'ink-backend': {
  //   email: 'editoria@coko.foundation',
  //   inkEndpoint: 'http://ink-api.coko.foundation',
  //   maxRetries: 60,
  //   password: 'editoria'
  // },
  bookBuilder,
  publicKeys: [
    'authsome',
    'bookBuilder',
    'pubsweet',
    'pubsweet-client',
    'validations',
  ],
  pubsweet: {
    components,
  },
  'pubsweet-client': {
    API_ENDPOINT: 'http://localhost:3000/api',
    'login-redirect': '/',
    navigation: 'app/components/Navigation/Navigation.jsx',
    routes: 'app/routes.jsx',
    theme: 'ThemeEditoria',
  },
  'pubsweet-server': {
    dbPath:
      process.env.PUBSWEET_DB ||
      path.join(__dirname, '..', 'api', 'db', environment),
    sse: true,
  },
  validations: path.join(__dirname, 'modules', 'validations'),
}
