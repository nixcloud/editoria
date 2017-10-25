const path = require('path')

module.exports = {
  components: 'src/**/*.js',
  require: [path.join(__dirname, 'node_modules/font-awesome/css/font-awesome.css')]
}
