const path = require('path')

module.exports = {
  authsome: {
    mode: path.join(__dirname, 'modules', 'mode'),
    teams: path.join(__dirname, 'modules', 'teams')
  },
  bookBuilder: path.join(__dirname, 'modules', 'book-builder'),
  'pubsweet-client': {
    API_ENDPOINT: 'http://localhost:3000/api',
    'login-redirect': '/'
  },
  validations: path.join(__dirname, 'modules', 'validations')
}
