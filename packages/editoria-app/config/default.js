const path = require('path')
const components = require('./components')
const teams = require('./modules/teams')
const mode = require('./modules/mode')
const validations = require('./modules/validations')

const environment = process.env.NODE_ENV || 'development'

module.exports = {
  authsome: {
    mode,
    teams
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
  'pubsweet-client': {
    navigation: 'app/components/Navigation/Navigation.jsx',
    routes: 'app/routes.jsx',
    theme: 'ThemeEditoria'
  },
  'pubsweet-server': {
    dbPath: process.env.PUBSWEET_DB || path.join(__dirname, '..', 'api', 'db', environment),
    sse: true
  },
  validations,
  publicKeys: ['pubsweet-client', 'authsome', 'pubsweet', 'validations']
}
