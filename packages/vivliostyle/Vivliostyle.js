const express = require('express')
const path = require('path')

const Vivliostyle = app => {
  app.use(
    '/vivliostyle',
    express.static(path.join(__dirname, 'vivliostyle-viewer')),
  )
}

module.exports = Vivliostyle
