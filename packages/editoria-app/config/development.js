const logger = require('winston')
const path = require('path')
const universal = require('./universal')

if (!process.env.NODE_ENV) process.env.NODE_ENV = 'development'
// console.log('env', process.env.NODE_ENV)

module.exports = {
  authsome: universal.authsome,
  bookBuilder: universal.bookBuilder,
  dashboard: universal.dashboard,
  pubsweet: universal.pubsweet,
  'pubsweet-client': universal.pubsweetClient,
  'pubsweet-component-ink-backend': universal.inkBackend,
  'pubsweet-server': {
    dbPath: path.join(__dirname, '..', 'api', 'db', 'development'),
    logger,
    API_ENDPOINT: '/api'
  },
  validations: universal.validations
}
