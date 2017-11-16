const path = require('path')
const components = require('./components')

const environment = process.env.NODE_ENV || 'development'

module.exports = {
  authsome: {
    mode: path.join(__dirname, 'modules', 'mode'),
    teams: path.join(__dirname, 'modules', 'teams')
  },
  'ink-backend': {
    email: 'editoria@coko.foundation',
    inkEndpoint: 'http://ink-api.coko.foundation',
    maxRetries: 60,
    password: 'editoria'
  },
  pubsweet: {
    components
  },
  bookBuilder: path.join(__dirname, 'modules', 'book-builder'),
  'pubsweet-client': {
    navigation: 'app/components/Navigation/Navigation.jsx',
    routes: 'app/routes.jsx',
    theme: 'ThemeEditoria',
    API_ENDPOINT: 'http://localhost:3000/api',
    'login-redirect': '/'
  },
  'pubsweet-server': {
    dbPath: process.env.PUBSWEET_DB || path.join(__dirname, '..', 'api', 'db', environment),
    sse: true
  },
  validations: path.join(__dirname, 'modules', 'validations'),
  publicKeys: ['pubsweet-client', 'authsome', 'pubsweet', 'validations']
}
