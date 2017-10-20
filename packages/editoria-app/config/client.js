const mode = require('./modules/mode')
const teams = require('./modules/teams')
const bookBuilder = require('./modules/book-builder')
const validations = require('./modules/validations')

module.exports = {
  authsome: {
    mode,
    teams
  },
  bookBuilder,
  'pubsweet-client': {
    API_ENDPOINT: 'http://localhost:3000/api',
    'login-redirect': '/'
  },
  validations
}
