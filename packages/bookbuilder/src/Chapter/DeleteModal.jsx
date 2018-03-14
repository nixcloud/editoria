import React from 'react'
import PropTypes from 'prop-types'

import Modal from 'editoria-common/src/Modal'

class DeleteModal extends React.Component {
  constructor(props) {
    super(props)
    this.onDelete = this.onDelete.bind(this)
  }

  onDelete() {
    const { chapter, remove, toggle } = this.props

    remove(chapter)
    toggle()
  }

  render() {
    const { chapter, container, show, toggle } = this.props
    const type = chapter.type

    return (
      <Modal
        action="delete"
        chapter={chapter}
        container={container}
        show={show}
        successAction={this.onDelete}
        successText="Delete"
        title={`Delete ${type}`}
        toggle={toggle}
        type={type}
      />
    )
  }
}

DeleteModal.propTypes = {
  chapter: PropTypes.shape({
    alignment: PropTypes.objectOf(PropTypes.bool),
    author: PropTypes.string,
    book: PropTypes.string,
    division: PropTypes.string,
    id: PropTypes.string,
    index: PropTypes.number,
    kind: PropTypes.string,
    lock: PropTypes.shape({
      editor: PropTypes.shape({
        username: PropTypes.string,
      }),
      timestamp: PropTypes.string,
    }),
    number: PropTypes.number,
    owners: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.string,
        username: PropTypes.string,
      }),
    ),
    progress: PropTypes.objectOf(PropTypes.number),
    rev: PropTypes.string,
    source: PropTypes.string,
    status: PropTypes.string,
    subCategory: PropTypes.string,
    title: PropTypes.string,
    trackChanges: PropTypes.bool,
    type: PropTypes.string,
  }).isRequired,
  container: PropTypes.any.isRequired,
  show: PropTypes.bool.isRequired,
  remove: PropTypes.func.isRequired,
  toggle: PropTypes.func.isRequired,
}

export default DeleteModal
