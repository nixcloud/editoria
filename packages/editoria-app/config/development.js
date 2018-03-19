const { deferConfig } = require('config/defer')

module.exports = {
  'pubsweet-server': {
    baseUrl: deferConfig(
      cfg => `http://localhost:${cfg['pubsweet-server'].port}`,
    ),
  },
  dbManager: {
    username: 'admin',
    password: '12345678',
    email: 'admin@example.com',
    admin: true,
  },
}
