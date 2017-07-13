import React from 'react'

import AbstractModal from 'editoria-common/src/AbstractModal'

class RemoveBookModal extends React.Component {
  renderBody () {
    const { book } = this.props

    return (
      <span>
        Are you sure you want to permanently delete { book.title }?
      </span>
    )
  }

  render () {
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
  book: React.PropTypes.object.isRequired,
  container: React.PropTypes.object.isRequired,
  remove: React.PropTypes.func.isRequired,
  show: React.PropTypes.bool.isRequired,
  toggle: React.PropTypes.func.isRequired
}

export default RemoveBookModal
