/* DEPRECATED */

import React from 'react'

import Modal from 'editoria-common/src/Modal'

class ProgressModal extends React.Component {
  render() {
    const { changeProgressState, chapter, container, show, toggle } = this.props
    const type = chapter.type

    return (
      <Modal
        action="workflow-warning"
        chapter={chapter}
        container={container}
        type={type}
        show={show}
        successAction={changeProgressState}
        successText="OK"
        title="Change of workflow status"
        toggle={toggle}
      />
    )
  }
}

ProgressModal.propTypes = {
  changeProgressState: React.PropTypes.func.isRequired,
  chapter: React.PropTypes.object.isRequired,
  container: React.PropTypes.object.isRequired,
  show: React.PropTypes.bool.isRequired,
  toggle: React.PropTypes.func.isRequired,
}

export default ProgressModal
