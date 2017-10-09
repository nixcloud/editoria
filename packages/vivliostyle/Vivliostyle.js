const express = require('express')

const Vivliostyle = (app) => {
  app.use('/vivliostyle', express.static(__dirname + '/vivliostyle-viewer'))
}

module.exports = Vivliostyle
