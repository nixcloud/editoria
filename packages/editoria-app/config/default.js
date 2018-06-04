const path = require('path')

const components = require('./components')
const bookBuilder = require('./modules/book-builder')
const winston = require('winston')

const logger = new winston.Logger({
  transports: [
    new winston.transports.Console({
      colorize: true,
    }),
  ],
})

module.exports = {
  authsome: {
    mode: require.resolve('pubsweet-editoria-authsome'),
    teams: {
      productionEditor: {
        name: 'Production Editor',
      },
      copyEditor: {
        name: 'Copy Editor',
      },
      author: {
        name: 'Author',
      },
    },
  },
  bookBuilder,
  epub: {
    fontsPath: '/uploads/fonts',
  },
  'password-reset': {
    url:
      process.env.PUBSWEET_PASSWORD_RESET_URL ||
      'http://localhost:3000/password-reset',
    sender: process.env.PUBSWEET_PASSWORD_RESET_SENDER || 'dev@example.com',
  },
  mailer: {
    from: process.env.PUBSWEET_MAILER_SENDER || 'dev@example.com',
    transport: {
      host: process.env.PUBSWEET_MAILER_HOSTNAME || 'smtp.mailgun.org',
      auth: {
        user: process.env.PUBSWEET_MAILER_USERNAME,
        pass: process.env.PUBSWEET_MAILER_PASSWORD,
      },
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
    db: {},
    sse: true,
    logger,
    port: 3000,
    uploads: 'uploads',
  },
  validations: path.join(__dirname, 'modules', 'validations'),
}
