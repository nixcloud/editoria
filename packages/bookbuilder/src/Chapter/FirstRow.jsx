import React from 'react'
import PropTypes from 'prop-types'

import ChapterButtons from './ChapterButtons'
import ChapterTitle from './ChapterTitle'
import styles from '../styles/bookBuilder.local.scss'

class ChapterFirstRow extends React.Component {
  constructor (props) {
    super(props)

    this.onClickRename = this.onClickRename.bind(this)
    // this.onClickSave = this.onClickSave.bind(this)
    this.onSaveRename = this.onSaveRename.bind(this)

    this.state = {
      isRenameEmpty: false,
      isRenamingTitle: false
    }
  }

  onClickRename () {
    this.setState({
      isRenamingTitle: true
    })
  }

  onSaveRename (title) {
    const { chapter, update } = this.props
    title = title.trim()

    if (title.length === 0) {
      return this.setState({
        isRenameEmpty: true
      })
    }

    this.setState({ isRenameEmpty: false })

    const patch = {
      id: chapter.id,
      rev: chapter.rev,
      title: title
    }
    update(patch)

    this.setState({ isRenamingTitle: false })
  }

  // follow a chain of refs to call the save function of the input
  // this is done to facilitate sibling-sibling component communication
  // without having to setup an event-based system for a single use case
  // onClickSave () {
  //   this.chapterTitle.save()
  // }

  render () {
    const { book, chapter, isUploadInProgress, outerContainer, remove, roles, title, type, update } = this.props
    const { isRenameEmpty, isRenamingTitle } = this.state

    return (
      <div className={styles.FirstRow}>
        <ChapterTitle
          chapter={chapter}
          isRenaming={isRenamingTitle}
          isRenameEmpty={isRenameEmpty}
          isUploadInProgress={isUploadInProgress}
          onSaveRename={this.onSaveRename}
          // ref={node => { this.chapterTitle = node}}
          title={title}
          type={type}
          update={update}
        />

        <ChapterButtons
          bookId={book.id}
          chapter={chapter}
          isRenaming={isRenamingTitle}
          isUploadInProgress={isUploadInProgress}
          modalContainer={outerContainer}
          onClickRename={this.onClickRename}
          // onClickSave={this.onClickSave}
          remove={remove}
          roles={roles}
          type={type}
          update={update}
        />
      </div>

    )
  }
}

ChapterFirstRow.propTypes = {
  book: PropTypes.shape({
    id: PropTypes.string,
    rev: PropTypes.string,
    title: PropTypes.string,
  }).isRequired,
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
  isUploadInProgress: PropTypes.bool,
  outerContainer: PropTypes.any.isRequired,
  remove: PropTypes.func.isRequired,
  roles: PropTypes.arrayOf(PropTypes.string).isRequired,
  title: PropTypes.string,
  type: PropTypes.string.isRequired,
  update: PropTypes.func.isRequired,
}

ChapterFirstRow.defaultProps = {
  isUploadInProgress: false,
  title: null,
}

export default ChapterFirstRow
