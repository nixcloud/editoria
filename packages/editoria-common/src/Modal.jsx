// TODO -- deprecate this in favor of abstract modal

import React from 'react'
import { Modal } from 'react-bootstrap'
// import TeamManager from '../BookBuilder/TeamManager/TeamManager'

export class BookBuilderModal extends React.Component {
  render () {
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
      updateTeam
    } = this.props

    const modalSize = size || null
    let modalBodyText = ''

    const success = successAction ? <a className='modal-button bb-modal-act'
      onClick={successAction}>
      { successText }
    </a> : null

    // TODO -- move to individual modal components
    if (action === 'delete') {
      modalBodyText = (
        <div>
          Are you sure you want to delete { type } "{ chapter.title }"?
        </div>
      )
    } else if (action === 'unlock') {
      modalBodyText = (
        <div>
          This action will unlock the chapter that
          is currently being edited. <br />
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
          You won’t be able to edit this chapter after updating this workflow status.
          <br />
          Are you sure you wish to continue?
        </div>
      )
    }

    return (
      <Modal
        show={show}
        onHide={toggle}
        container={container}
        className='modal'
        bsSize={modalSize}
      >

        <Modal.Header>
          <Modal.Title>
            { title }
          </Modal.Title>
        </Modal.Header>

        <Modal.Body>
          { modalBodyText }
        </Modal.Body>

        <Modal.Footer>
          <div className='modal-buttons-container'>

            <a className='modal-button modal-discard bb-modal-cancel'
              onClick={toggle}>
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
  action: React.PropTypes.string.isRequired,
  chapter: React.PropTypes.object,
  container: React.PropTypes.object.isRequired,
  show: React.PropTypes.bool.isRequired,
  size: React.PropTypes.string,
  successAction: React.PropTypes.func,
  successText: React.PropTypes.string,
  teams: React.PropTypes.array,
  title: React.PropTypes.string.isRequired,
  toggle: React.PropTypes.func.isRequired,
  type: React.PropTypes.string,
  updateTeam: React.PropTypes.func,
  users: React.PropTypes.array
}

export default BookBuilderModal
