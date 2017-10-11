import React from 'react'
import classes from './VivliostyleExporter.local.scss'

const VivliostyleExporter = ({ book, htmlToEpub }) => {
  const handleHTMLToEpub = () => {
    htmlToEpub(book.id).then((res) => {
      const path = res.extractedEpubPath
      const url = `
          /vivliostyle/viewer/vivliostyle-viewer.html#b=/uploads/${path}
        `
      window.open(url, '_blank')
    })
  }
  return (
    <div
      onClick={handleHTMLToEpub}
      className={`${classes.exportBookContainer} col-lg-2 col-md-6 col-sm-5 col-xs-5`}
    >
      <label className={classes.exportToBookIcon} />
      <span className={classes.vivliostyleExportText}>Export Book</span>
    </div>
  )
}

export default VivliostyleExporter
