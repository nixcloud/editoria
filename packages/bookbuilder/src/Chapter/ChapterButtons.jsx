import { get, includes } from 'lodash'
import React from 'react'
import PropTypes from 'prop-types'
import withLink from 'editoria-common/src/withLink'
import Authorize from 'pubsweet-client/src/helpers/Authorize'
import DeleteModal from './DeleteModal'
import EditingNotification from './EditingNotification'
import styles from '../styles/bookBuilder.local.scss'

class ChapterButtons extends React.Component {
  constructor(props) {
    super(props)

    this.canEdit = this.canEdit.bind(this)
    this.isLocked = this.isLocked.bind(this)
    this.renderDeleteButton = this.renderDeleteButton.bind(this)
    this.renderEditButton = this.renderEditButton.bind(this)
    this.renderEditingNotification = this.renderEditingNotification.bind(this)
    this.renderRenameButton = this.renderRenameButton.bind(this)
    this.renderRightArea = this.renderRightArea.bind(this)
    this.toggleDeleteModal = this.toggleDeleteModal.bind(this)

    this.state = {
      showDeleteModal: false,
    }
  }

  // TODO -- should maybe check for lock
  isLocked() {
    const { chapter } = this.props
    return get(chapter, 'lock.editor.username')
  }

  canEdit() {
    const { chapter, roles } = this.props

    if (includes(roles, 'admin') || includes(roles, 'production-editor')) {
      return true
    }

    if (includes(roles, 'copy-editor')) {
      const isEditing = chapter.progress.edit === 1
      if (isEditing) return true
    }

    if (includes(roles, 'author')) {
      const isReviewing = chapter.progress.review === 1
      if (isReviewing) return true
    }

    return false
  }

  toggleDeleteModal() {
    this.setState({
      showDeleteModal: !this.state.showDeleteModal,
    })
  }

  renderEditingNotification() {
    const { chapter, modalContainer, roles, update } = this.props

    return (
      <EditingNotification
        chapter={chapter}
        modalContainer={modalContainer}
        roles={roles}
        update={update}
      />
    )
  }

  renderRenameButton() {
    const { isRenaming, onClickRename, onClickSave, type } = this.props

    if (type === 'chapter' || type === 'part') {
      let renameButtonText = 'Rename'
      let renameButtonFunction = onClickRename

      if (isRenaming) {
        renameButtonText = 'Save'
        renameButtonFunction = onClickSave
      }

      return (
        <div className={styles.actionContainer}>
          <a id="bb-rename" onClick={renameButtonFunction}>
            {renameButtonText}
          </a>
        </div>
      )
    }

    return null
  }

  renderEditButton() {
    const text = this.canEdit() ? 'Edit' : 'View'
    return text
  }

  renderDeleteButton() {
    const { chapter, modalContainer, remove } = this.props
    const { showDeleteModal } = this.state
    const toggle = this.toggleDeleteModal

    let deleteModal = null

    if (showDeleteModal) {
      deleteModal = (
        <DeleteModal
          chapter={chapter}
          container={modalContainer}
          remove={remove}
          show={showDeleteModal}
          toggle={toggle}
        />
      )
    }

    return (
      <a id="bb-delete" onClick={toggle}>
        Delete
        {deleteModal}
      </a>
    )
  }

  renderRightArea() {
    const { isUploadInProgress, chapter } = this.props
    const url = `/books/${chapter.book}/fragments/${chapter.id}`

    if (this.isLocked()) return this.renderEditingNotification()
    // close Rename of Title
    // const renameButton = this.renderRenameButton()
    const editButton = this.renderEditButton()
    const deleteButton = this.renderDeleteButton()

    let buttonsStyle = {}
    if (isUploadInProgress) {
      buttonsStyle = {
        opacity: '0.3',
        pointerEvents: 'none',
      }
    }

    return (
      <div style={buttonsStyle}>
        <div className={styles.actionContainer}>
          {withLink(editButton, url)}
        </div>
        {/* renameButton */}
        <Authorize object={chapter} operation="can view deleteComponent">
          {deleteButton}
        </Authorize>
      </div>
    )
  }

  render() {
    const rightArea = this.renderRightArea()

    return (
      <div className={`${styles.chapterActions} pull-right`}>{rightArea}</div>
    )
  }
}

ChapterButtons.propTypes = {
  bookId: PropTypes.string.isRequired,
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
  isRenaming: PropTypes.bool.isRequired,
  isUploadInProgress: PropTypes.bool,
  modalContainer: PropTypes.any.isRequired,
  // onClickRename: PropTypes.func.isRequired, // should refactor
  // onClickSave: PropTypes.func.isRequired,
  remove: PropTypes.func.isRequired,
  roles: PropTypes.arrayOf(PropTypes.string).isRequired,
  type: PropTypes.string.isRequired,
  update: PropTypes.func.isRequired,
}

ChapterButtons.defaultProps = {
  isUploadInProgress: false,
}

export default ChapterButtons
