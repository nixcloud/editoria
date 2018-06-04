module.exports = {
  'pubsweet-server': {
    secret: 'PUBSWEET_SECRET',
    db: {
      user: 'POSTGRES_USER',
      password: 'POSTGRES_PASSWORD',
      host: 'POSTGRES_HOST',
      database: 'POSTGRES_DB',
      port: 'POSTGRES_PORT',
    },
    port: 'SERVER_PORT',
  },
  'pubsweet-component-ink-backend': {
    inkEndpoint: 'INK_ENDPOINT',
    email: 'INK_USERNAME',
    password: 'INK_PASSWORD',
    recipes: {
      'editoria-typescript': '1',
    },
  },
  'password-reset': {
    url: 'PASSWORD_RESET_URL',
    sender: 'PASSWORD_RESET_SENDER',
  },
  mailer: {
    from: 'MAILER_SENDER',
    transport: {
      host: 'MAILER_HOSTNAME',
      auth: {
        user: 'MAILER_USER',
        pass: 'MAILER_PASSWORD',
      },
    },
  },
}
