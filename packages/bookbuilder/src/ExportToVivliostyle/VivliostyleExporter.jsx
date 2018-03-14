import React from 'react'
import PropTypes from 'prop-types'
import classes from './VivliostyleExporter.local.scss'
import ErrorModal from './ErrorModal'

const VivliostyleExporter = ({
  book,
  htmlToEpub,
  showModal,
  showModalToggle,
  outerContainer,
}) => {
  let modal

  const handleHTMLToEpub = () => {
    const queryParams = {
      destination: 'folder',
      converter: 'wax',
      style: 'epub.css',
    }

    htmlToEpub(book.id, queryParams)
      .then(res => {
        const path = res.extractedEpubPath
        const viliostylePath = '/vivliostyle/viewer/vivliostyle-viewer.html'
        const url = `${viliostylePath}#b=/uploads/${path}`
        window.open(url, '_blank')
      })
      .catch(error => {
        showModalToggle()
      })
  }

  const toggleModal = () => {
    showModalToggle()
  }
  if (showModal) {
    modal = (
      <ErrorModal
        container={outerContainer}
        show={showModal}
        toggle={toggleModal}
      />
    )
  }

  return (
    <div
      className={`${classes.exportBookContainer}`}
      onClick={handleHTMLToEpub}
    >
      <span>
        <label className={classes.exportToBookIcon} />
        <span className={classes.vivliostyleExportText}>Export Book</span>
      </span>
      {modal}
    </div>
  )
}

VivliostyleExporter.PropTypes = {
  book: PropTypes.shape({
    id: PropTypes.string,
    rev: PropTypes.string,
    title: PropTypes.string,
  }).isRequired,
  htmlToEpub: PropTypes.func.isRequired,
  showModal: PropTypes.func.isRequired,
  showModalToggle: PropTypes.func.isRequired,
  outerContainer: PropTypes.any.isRequired,
}

export default VivliostyleExporter
