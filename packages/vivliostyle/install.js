const request = require('request')
const fs = require('fs')
const Promise = require('bluebird')
const execP = Promise.promisify(require('child_process').exec)

const vivliostyleVersion = 'vivliostyle-js-2017.6'
const vivliostyleZip = 'vivliostyle.zip'
const vivliostylePath = 'vivliostyle-viewer'
const viliostyleHost = 'https://vivliostyle.github.io/vivliostyle.js'
const downloadLink = `${viliostyleHost}/downloads/${vivliostyleVersion}.zip`

const commands = [
  `unzip ${vivliostyleZip}`,
  `mv ${vivliostyleVersion} ${vivliostylePath}`,
  `rm ${vivliostyleZip}`
]

if (!fs.existsSync(vivliostyleZip) && !fs.existsSync(vivliostylePath)) {
  request(downloadLink)
    .pipe(fs.createWriteStream('vivliostyle.zip'))
    .on('finish', () => {
      Promise.mapSeries(commands, command => execP(command))
        .then(done => done,
        (err) => { console.error(err) })
    })
}
