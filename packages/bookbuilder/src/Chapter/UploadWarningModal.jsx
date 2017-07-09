import React from 'react'

import AbstractModal from '../../common/AbstractModal'

class UploadWarningModal extends React.Component {
  renderBody () {
    const { type } = this.props

    return (
      <div>
        You are not allowed to import contents while a { type } is being edited.
      </div>
    )
  }

  render () {
    const { container, show, toggle } = this.props
    const body = this.renderBody()
    const title = 'Import not allowed'

    return (
      <AbstractModal
        body={body}
        container={container}
        show={show}
        title={title}
        toggle={toggle}
      />
    )
  }
}

UploadWarningModal.propTypes = {
  container: React.PropTypes.object.isRequired,
  show: React.PropTypes.bool.isRequired,
  toggle: React.PropTypes.func.isRequired,
  type: React.PropTypes.string.isRequired
}

export default UploadWarningModal
