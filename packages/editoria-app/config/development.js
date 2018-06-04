const { deferConfig } = require('config/defer')
const path = require('path')
const winston = require('winston')

const logger = new winston.Logger({
  transports: [
    new winston.transports.Console({
      colorize: true,
    }),
    new winston.transports.File({
      name: 'info-file',
      filename: 'app.log',
      handleExceptions: true,
      humanReadableUnhandledException: true,
      dirname: path.join(__dirname, '../logs/dev'),
      level: 'info',
    }),
  ],
})

module.exports = {
  'pubsweet-server': {
    baseUrl: deferConfig(
      cfg => `http://localhost:${cfg['pubsweet-server'].port}`,
    ),
    logger,
  },
}
