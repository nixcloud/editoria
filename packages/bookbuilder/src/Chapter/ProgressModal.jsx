/* DEPRECATED */

import React from 'react'
import PropTypes from 'prop-types'

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
        show={show}
        successAction={changeProgressState}
        successText="OK"
        title="Change of workflow status"
        toggle={toggle}
        type={type}
      />
    )
  }
}

ProgressModal.propTypes = {
  changeProgressState: PropTypes.func.isRequired,
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
  toggle: PropTypes.func.isRequired,
}

export default ProgressModal
