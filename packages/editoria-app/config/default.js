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
    url: 'http://localhost:3000/password-reset',
    sender: 'dev@example.com',
  },
  mailer: {
    from: 'dev@example.com',
    transport: {
      host: 'smtp.mailgun.org',
      auth: {
        user: 'dev@example.com',
        pass: 'password',
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
