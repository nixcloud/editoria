const path = require('path')

const components = require('./components')
const bookBuilder = require('./modules/book-builder')
const teams = require('./modules/teams')
const logger = require('winston')

const {
  NODE_ENV: nodeEnv,
  PUBSWEET_DB: dbPath,
  PUBSWEET_PASSWORD_RESET_SENDER: resetSender,
  PUBSWEET_PASSWORD_RESET_URL: resetUrl,
} = process.env

const environment = nodeEnv || 'development'

module.exports = {
  authsome: {
    mode: path.join(__dirname, 'modules', 'mode'),
    teams,
  },
  bookBuilder,
  epub: {
    fontsPath: '/uploads/fonts',
  },
  'password-reset': {
    url: 'http://localhost:3000/password-reset',
    sender: 'noreply@pubsweet.org',
  },
  mailer: {
    from: 'nobody@example.com',
    transport: {
      sendmail: true,
    },
  },
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
    API_ENDPOINT: '/api',
    'login-redirect': '/',
    navigation: 'app/components/Navigation/Navigation.jsx',
    routes: 'app/routes.jsx',
    theme: 'ThemeEditoria',
  },
  'pubsweet-server': {
    dbPath: dbPath || path.join(__dirname, '..', 'api', 'db', environment),
    sse: true,
    logger,
    port: 3000,
    uploads: 'uploads',
  },
  validations: path.join(__dirname, 'modules', 'validations'),
}
