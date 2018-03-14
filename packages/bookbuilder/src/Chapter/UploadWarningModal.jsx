import React from 'react'
import PropTypes from 'prop-types'

import AbstractModal from 'editoria-common/src/AbstractModal'

class UploadWarningModal extends React.Component {
  renderBody() {
    const { type } = this.props

    return (
      <div>
        You are not allowed to import contents while a {type} is being edited.
      </div>
    )
  }

  render() {
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
  container: PropTypes.any.isRequired,
  show: PropTypes.bool.isRequired,
  toggle: PropTypes.func.isRequired,
  type: PropTypes.string.isRequired,
}

export default UploadWarningModal
