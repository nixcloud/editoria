import React from 'react'

import Modal from '../../utils/Modal'

class DeleteModal extends React.Component {
  constructor (props) {
    super(props)
    this.onDelete = this.onDelete.bind(this)
  }

  onDelete () {
    const { chapter, remove, toggle } = this.props

    remove(chapter)
    toggle()
  }

  render () {
    const { chapter, container, show, toggle } = this.props
    const type = chapter.type

    return (
      <Modal
        title={'Delete ' + type}
        chapter={chapter}
        action='delete'
        successText='Delete'
        type={type}
        successAction={this.onDelete}
        show={show}
        toggle={toggle}
        container={container}
      />
    )
  }
}

DeleteModal.propTypes = {
  chapter: React.PropTypes.object.isRequired,
  container: React.PropTypes.object.isRequired,
  show: React.PropTypes.bool.isRequired,
  remove: React.PropTypes.func.isRequired,
  toggle: React.PropTypes.func.isRequired
}

export default DeleteModal
