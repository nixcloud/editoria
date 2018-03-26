const { deferConfig } = require('config/defer')

module.exports = {
  'pubsweet-server': {
    baseUrl: deferConfig(
      cfg => `http://localhost:${cfg['pubsweet-server'].port}`,
    ),
  },
}
