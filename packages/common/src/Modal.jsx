// TODO -- deprecate this in favor of abstract modal

import React from 'react'
import PropTypes from 'prop-types'
import { Modal } from 'react-bootstrap'
// import TeamManager from '../BookBuilder/TeamManager/TeamManager'

export class BookBuilderModal extends React.Component {
  render() {
    const {
      action,
      chapter,
      container,
      size,
      show,
      successAction,
      successText,
      teams,
      title,
      toggle,
      type,
      users,
      updateTeam,
    } = this.props

    const modalSize = size || null
    let modalBodyText = ''

    const success = successAction ? (
      <a className="modal-button bb-modal-act" onClick={successAction}>
        {successText}
      </a>
    ) : null

    // TODO -- move to individual modal components
    if (action === 'delete') {
      modalBodyText = (
        <div>
          Are you sure you want to delete {type} "{chapter.title}"?
        </div>
      )
    } else if (action === 'unlock') {
      modalBodyText = (
        <div>
          This action will unlock the chapter that is currently being edited.{' '}
          <br />
          Use with caution.
        </div>
      )
      // } else if (action === 'EditoriaTeamManager') {
      //   // TODO -- ESPECIALLY THIS ONE
      //   modalBodyText = (
      //     <div>
      //       <TeamManager
      //         teams={teams}
      //         users={users}
      //         updateTeam={updateTeam}
      //      />
      //     </div>
      //   )
    } else if (action === 'workflow-warning') {
      modalBodyText = (
        <div>
          You won’t be able to edit this chapter after updating this workflow
          status.
          <br />
          Are you sure you wish to continue?
        </div>
      )
    }

    return (
      <Modal
        bsSize={modalSize}
        className="modal"
        container={container}
        onHide={toggle}
        show={show}
      >
        <Modal.Header>
          <Modal.Title>{title}</Modal.Title>
        </Modal.Header>

        <Modal.Body>{modalBodyText}</Modal.Body>

        <Modal.Footer>
          <div className="modal-buttons-container">
            <a
              className="modal-button modal-discard bb-modal-cancel"
              onClick={toggle}
            >
              Cancel
            </a>

            {success}
          </div>
        </Modal.Footer>
      </Modal>
    )
  }
}

BookBuilderModal.propTypes = {
  action: PropTypes.string.isRequired,
  chapter: PropTypes.shape({
    title: PropTypes.string,
  }),
  container: PropTypes.any.isRequired,
  show: PropTypes.bool.isRequired,
  size: PropTypes.string,
  successAction: PropTypes.func,
  successText: PropTypes.string,
  // teams: PropTypes.array,
  title: PropTypes.string.isRequired,
  toggle: PropTypes.func.isRequired,
  type: PropTypes.string,
  // updateTeam: PropTypes.func,
  // users: PropTypes.array,
}

BookBuilderModal.defaultProps = {
  chapter: {
    title: null,
  },
  size: null,
  successAction: null,
  successText: null,
  type: null,
}

export default BookBuilderModal
