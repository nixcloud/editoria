import React from 'react'
import PropTypes from 'prop-types'

import AbstractModal from 'editoria-common/src/AbstractModal'

class RemoveBookModal extends React.Component {
  renderBody() {
    const { book } = this.props

    return (
      <span>Are you sure you want to permanently delete {book.title}?</span>
    )
  }

  render() {
    const { container, remove, show, toggle } = this.props

    const title = 'Delete Book'
    const successText = 'Delete'

    const body = this.renderBody()

    return (
      <AbstractModal
        body={body}
        container={container}
        show={show}
        successAction={remove}
        successText={successText}
        title={title}
        toggle={toggle}
      />
    )
  }
}

RemoveBookModal.propTypes = {
  book: PropTypes.shape({
    id: PropTypes.string,
    title: PropTypes.string,
  }),
  container: PropTypes.any.isRequired,
  remove: PropTypes.func.isRequired,
  show: PropTypes.bool.isRequired,
  toggle: PropTypes.func.isRequired,
}

RemoveBookModal.defaultProps = {
  book: null,
}

export default RemoveBookModal
