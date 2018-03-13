import React from 'react'
import PropTypes from 'prop-types'
import { Modal } from 'react-bootstrap'

export class AbstractModal extends React.Component {
  constructor(props) {
    super(props)
    this.performAction = this.performAction.bind(this)
  }

  performAction() {
    const { successAction } = this.props
    successAction()
  }

  renderHeader() {
    const { title } = this.props

    return (
      <Modal.Header>
        <Modal.Title>{title}</Modal.Title>
      </Modal.Header>
    )
  }

  renderBody() {
    const { body } = this.props

    return <Modal.Body>{body}</Modal.Body>
  }

  renderFooter() {
    const { cancelText, successAction, successText, toggle } = this.props

    const successButton = (
      <a className="modal-button bb-modal-act" onClick={this.performAction}>
        {successText}
      </a>
    )

    const success = successAction ? successButton : null

    return (
      <Modal.Footer>
        <div className="modal-buttons-container">
          <a
            className="modal-button modal-discard bb-modal-cancel"
            onClick={toggle}
          >
            {cancelText || 'Cancel'}
          </a>

          {success}
        </div>
      </Modal.Footer>
    )
  }

  render() {
    const { container, size, show, toggle } = this.props

    const header = this.renderHeader()
    const body = this.renderBody()
    const footer = this.renderFooter()

    return (
      <Modal
        bsSize={size || null}
        className="modal"
        container={container}
        onHide={toggle}
        show={show}
      >
        {header}
        {body}
        {footer}
      </Modal>
    )
  }
}

AbstractModal.propTypes = {
  body: PropTypes.oneOfType([
    PropTypes.node,
    PropTypes.string,
    PropTypes.arrayOf(PropTypes.node),
  ]).isRequired,
  cancelText: PropTypes.string,
  container: PropTypes.any.isRequired,
  show: PropTypes.bool.isRequired,
  size: PropTypes.string,
  successAction: PropTypes.func,
  successText: PropTypes.string,
  title: PropTypes.string.isRequired,
  toggle: PropTypes.func.isRequired,
}

AbstractModal.defaultProps = {
  cancelText: null,
  size: null,
  successAction: null,
  successText: null,
}

export default AbstractModal
