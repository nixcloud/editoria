import { get, includes } from 'lodash'
import React from 'react'
import { LinkContainer } from 'react-router-bootstrap'

import DeleteModal from './DeleteModal'
import EditingNotification from './EditingNotification'
import styles from '../styles/bookBuilder.local.scss'

class ChapterButtons extends React.Component {
  constructor (props) {
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
      showDeleteModal: false
    }
  }

  // TODO -- should maybe check for lock
  isLocked () {
    const { chapter } = this.props
    return get(chapter, 'lock.editor.username')
  }

  canEdit () {
    const { chapter, roles } = this.props

    if (includes(roles, 'admin') || includes(roles, 'production-editor')) {
      return true
    }

    if (includes(roles, 'copy-editor')) {
      const isEditing = (chapter.progress.edit === 1)
      if (isEditing) return true
    }

    if (includes(roles, 'author')) {
      const isReviewing = (chapter.progress.review === 1)
      if (isReviewing) return true
    }

    return false
  }

  toggleDeleteModal () {
    this.setState({
      showDeleteModal: !this.state.showDeleteModal
    })
  }

  renderEditingNotification () {
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

  renderRenameButton () {
    const {
      isRenaming,
      onClickRename,
      onClickSave,
      type
    } = this.props

    if (type === 'chapter' || type === 'part') {
      let renameButtonText = 'Rename'
      let renameButtonFunction = onClickRename

      if (isRenaming) {
        renameButtonText = 'Save'
        renameButtonFunction = onClickSave
      }

      return (
        <div className={styles.actionContainer}>
          <a id='bb-rename'
          onClick={renameButtonFunction}>
          { renameButtonText }
        </a>
      </div>
      )
    }

    return null
  }

  renderEditButton () {
    const { bookId, chapter } = this.props
    const text = this.canEdit() ? 'Edit' : 'View'
    const url = `/books/${bookId}/fragments/${chapter.id}`

    return (
      <LinkContainer id='bb-edit' to={url} >
        <div className={styles.actionContainer}>
          <a> { text }</a>
        </div>
      </LinkContainer>
    )
  }

  renderDeleteButton () {
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
      <a id='bb-delete' onClick={toggle} >
        Delete
        { deleteModal }
      </a>
    )
  }

  renderRightArea () {
    const { isUploadInProgress } = this.props

    if (this.isLocked()) return this.renderEditingNotification()
    // close Rename of Title
    // const renameButton = this.renderRenameButton()
    const editButton = this.renderEditButton()
    const deleteButton = this.renderDeleteButton()

    let buttonsStyle = {}
    if (isUploadInProgress) {
      buttonsStyle = {
        'opacity': '0.3',
        'pointerEvents': 'none'
      }
    }

    return (
      <div style={buttonsStyle}>
        { editButton }
        {/* renameButton */}
        { deleteButton }
      </div>
    )
  }

  render () {
    let rightArea = this.renderRightArea()

    return (
      <div className={styles.chapterActions + ' pull-right'}>
        { rightArea }
      </div>
    )
  }
}

ChapterButtons.propTypes = {
  bookId: React.PropTypes.string.isRequired,
  chapter: React.PropTypes.object.isRequired,
  isRenaming: React.PropTypes.bool.isRequired,
  isUploadInProgress: React.PropTypes.bool,
  modalContainer: React.PropTypes.object.isRequired,
  onClickRename: React.PropTypes.func.isRequired,
  onClickSave: React.PropTypes.func.isRequired,
  remove: React.PropTypes.func.isRequired,
  roles: React.PropTypes.array.isRequired,
  type: React.PropTypes.string.isRequired,
  update: React.PropTypes.func.isRequired
}

export default ChapterButtons
