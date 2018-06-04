const { deferConfig } = require('config/defer')
const path = require('path')
const winston = require('winston')
require('winston-daily-rotate-file')

const logger = new winston.Logger({
  transports: [
    new winston.transports.Console({
      colorize: true,
    }),
    new winston.transports.DailyRotateFile({
      filename: 'app-%DATE%.log',
      dirname: path.join(__dirname, '../logs/production'),
      datePattern: 'DD-MM-YYYY',
      zippedArchive: true,
      maxFiles: '30d',
      json: true,
      handleExceptions: true,
      humanReadableUnhandledException: true,
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
