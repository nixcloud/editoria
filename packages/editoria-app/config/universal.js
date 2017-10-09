const Joi = require('joi')
const path = require('path')

const editoriaMode = require('../app/authsome_editoria')

const inkEndpoint = process.env.INK_ENDPOINT
const inkUsername = process.env.INK_USERNAME
const inkPassword = process.env.INK_PASSWORD

const teams = {
  teamProduction: {
    name: 'Production Editor',
    permissions: 'all'
  },
  teamCopyEditor: {
    name: 'Copy Editor',
    permissions: 'update'
  },
  teamauthors: {
    name: 'Author',
    permissions: 'update'
  }
}

module.exports = {
  authsome: {
    mode: editoriaMode,
    teams
  },
  bookBuilder: {
    chapter: {
      dropdownValues: {
        front: [
          'Table of Contents',
          'Introduction',
          'Preface',
          'Preface 1',
          'Preface 2',
          'Preface 3',
          'Preface 4',
          'Preface 5',
          'Preface 6',
          'Preface 7',
          'Preface 8',
          'Preface 9',
          'Preface 10'
        ],
        back: [
          'Appendix A',
          'Appendix B',
          'Appendix C'
        ]
      }
    },
    teamTypes: teams
  },
  dashboard: {
    teamTypes: teams
  },
  inkBackend: {
    inkEndpoint: inkEndpoint || 'http://ink-api.coko.foundation',
    email: inkUsername,
    password: inkPassword,
    maxRetries: 60
  },
  pubsweet: {
    components: [
      'pubsweet-component-ink-backend',
      'pubsweet-component-ink-frontend',
      'pubsweet-component-login',
      'pubsweet-component-signup',
      'pubsweet-component-wax'
    ]
  },
  pubsweetClient: {
    navigation: 'app/components/Navigation/Navigation.jsx',
    routes: 'app/routes.jsx',
    theme: 'ThemeEditoria'
  },
  pubsweetServer: {
    API_ENDPOINT: '/api',
    dbPath: process.env.PUBSWEET_DB || path.join(__dirname, '..', 'api', 'db'),
    secret: process.env.PUBSWEET_SECRET
  },
  validations: {
    collection: {
      productionEditor: Joi.object().allow(null)
    },
    fragment: {
      alignment: Joi.object(),
      author: Joi.string().allow(''),
      book: Joi.string().guid().required(),
      comments: Joi.object(),
      division: Joi.string(),
      index: Joi.number(),
      kind: Joi.string(),
      lock: Joi.object().allow(null),
      progress: Joi.object(),
      source: Joi.string().allow(''),
      status: Joi.string(),
      subCategory: Joi.string(),
      title: Joi.string(),
      trackChanges: Joi.boolean()
    }
  }
}
