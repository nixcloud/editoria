const request = require('request')
const fs = require('fs')
const Promise = require('bluebird')
const execP = Promise.promisify(require('child_process').exec)

const vivliostyleVersion = 'vivliostyle-js-2017.6'
const vivliostyleZip = 'vivliostyle.zip'
const vivliostylePath = 'vivliostyle-viewer'

const commands = [`unzip ${vivliostyleZip}`, `mv ${vivliostyleVersion} ${vivliostylePath}`, `rm ${vivliostyleZip}`]
if (!fs.existsSync(vivliostyleZip) && !fs.existsSync(vivliostylePath)) {
  request(
    `https://vivliostyle.github.io/vivliostyle.js/downloads/${vivliostyleVersion}.zip`
  )
    .pipe(fs.createWriteStream('vivliostyle.zip'))
    .on('finish', () => {
      Promise.mapSeries(commands, (command) => {
        return execP(command)
      }).then((done) => {
        return done
      }, (err) => {
        console.err(err)
      })
    })
}
