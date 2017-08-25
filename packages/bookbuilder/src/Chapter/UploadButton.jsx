import React from 'react'

import UploadWarningModal from './UploadWarningModal'
import styles from '../styles/bookBuilder.local.scss'

export class UploadButton extends React.Component {
  constructor (props) {
    super(props)

    this.handleFileUpload = this.handleFileUpload.bind(this)
    this.onClick = this.onClick.bind(this)
    this.toggleModal = this.toggleModal.bind(this)

    this.state = {
      showModal: false
    }
  }

  handleFileUpload (event) {
    event.preventDefault()

    const file = event.target.files[0]
    const { chapter, convertFile, toggleUpload, update } = this.props

    toggleUpload()
    convertFile(file).then((response) => {
      const patch = {
        id: chapter.id,
        source: response.converted
      }

      update(patch)
      toggleUpload()
    }).catch((error) => {
      console.error('INK error', error)
      toggleUpload()
    })
  }

  toggleModal () {
    this.setState({
      showModal: !this.state.showModal
    })
  }

  onClick () {
    if (!this.isLocked()) return
    this.toggleModal()
  }

  isLocked () {
    const { chapter } = this.props

    if (chapter.lock === null) return false
    return true
  }

  renderInput () {
    if (this.isLocked()) return null

    const { accept, title, type, chapter } = this.props

    return (
      <span>
        <label
          htmlFor={'single-file-uploader' + chapter.id}
          className={styles.uploadIcon}
        />
        <label
          htmlFor={'single-file-uploader' + chapter.id}
          className={styles.uploadText}
        >
          UPLOAD WORD
        </label>
        <input
          id={'single-file-uploader' + chapter.id}
          accept={accept}
          onChange={this.handleFileUpload}
          title={title}
          name='single-file-uploader'
          type={type}
        />
      </span>
    )
  }

  renderModal () {
    if (!this.isLocked()) return null

    const { showModal } = this.state
    const { chapter, modalContainer } = this.props
    const type = chapter.subCategory

    return (
      <UploadWarningModal
        container={modalContainer}
        show={showModal}
        toggle={this.toggleModal}
        type={type}
      />
    )
  }

  render () {
    const input = this.renderInput()
    const modal = this.renderModal()

    // TODO -- refactor with chapter buttons lock
    let buttonStyle = {}
    if (this.isLocked()) {
      buttonStyle = {
        'opacity': '0.3'
      }
    }

    return (
      <div
        className={styles.btnFile}
        id='bb-upload'
        onClick={this.onClick}
        style={buttonStyle}
      >
        { input }
        { modal }
      </div>
    )
  }
}

UploadButton.propTypes = {
  accept: React.PropTypes.string.isRequired,
  chapter: React.PropTypes.object.isRequired,
  convertFile: React.PropTypes.func.isRequired,
  modalContainer: React.PropTypes.object.isRequired,
  title: React.PropTypes.string.isRequired,
  toggleUpload: React.PropTypes.func.isRequired,
  type: React.PropTypes.string.isRequired,
  update: React.PropTypes.func.isRequired
}

export default UploadButton
