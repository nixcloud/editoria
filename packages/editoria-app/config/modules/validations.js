const Joi = require('joi')

module.exports = {
  collection: {
    created: Joi.date().required(),
    productionEditor: Joi.array().allow(null),
    title: Joi.string().required()
  },
  fragment: {
    alignment: Joi.object(),
    author: Joi.string().allow(''),
    book: Joi.string().guid().required(),
    comments: Joi.object(),
    division: Joi.string(),
    fragmentType: Joi.string(),
    index: Joi.number(),
    kind: Joi.string(),
    lock: Joi.object().allow(null),
    number: Joi.number(),
    progress: Joi.object(),
    source: Joi.string().allow(''),
    status: Joi.string(),
    subCategory: Joi.string(),
    title: Joi.string().allow(null),
    trackChanges: Joi.boolean()
  }
}
