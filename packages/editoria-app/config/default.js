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
      process.env.PASSWORD_RESET_URL || 'http://localhost:3000/password-reset',
    sender: process.env.PASSWORD_RESET_SENDER || 'dev@example.com',
  },
  mailer: {
    from: process.env.MAILER_SENDER || 'dev@example.com',
    transport: {
      host: process.env.MAILER_HOSTNAME || 'smtp.mailgun.org',
      auth: {
        user: process.env.MAILER_USER || 'dev@example.com',
        pass: process.env.MAILER_PASSWORD || 'password',
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
    port: process.env.SERVER_PORT || 3000,
    uploads: 'uploads',
  },
  validations: path.join(__dirname, 'modules', 'validations'),
}
