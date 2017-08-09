import React from 'react'

import ChapterButtons from './ChapterButtons'
import ChapterTitle from './ChapterTitle'
import styles from '../styles/bookBuilder.local.scss'

class ChapterFirstRow extends React.Component {
  constructor (props) {
    super(props)

    this.onClickRename = this.onClickRename.bind(this)
    this.onClickSave = this.onClickSave.bind(this)
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
      title: title
    }
    update(patch)

    this.setState({ isRenamingTitle: false })
  }

  // follow a chain of refs to call the save function of the input
  // this is done to facilitate sibling-sibling component communication
  // without having to setup an event-based system for a single use case
  onClickSave () {
    this.refs.chapterTitle.save()
  }

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
          ref='chapterTitle'
          title={title}
          type={type}
          update={update}
        />

        <div className={styles.dashedLine}>
          <ChapterButtons
            bookId={book.id}
            chapter={chapter}
            isRenaming={isRenamingTitle}
            isUploadInProgress={isUploadInProgress}
            modalContainer={outerContainer}
            onClickRename={this.onClickRename}
            onClickSave={this.onClickSave}
            remove={remove}
            roles={roles}
            type={type}
            update={update}
          />
        </div>
      </div>

    )
  }
}

ChapterFirstRow.propTypes = {
  book: React.PropTypes.object.isRequired,
  chapter: React.PropTypes.object.isRequired,
  isUploadInProgress: React.PropTypes.bool.isRequired,
  outerContainer: React.PropTypes.object.isRequired,
  remove: React.PropTypes.func.isRequired,
  roles: React.PropTypes.array,
  title: React.PropTypes.string.isRequired,
  type: React.PropTypes.string.isRequired,
  update: React.PropTypes.func.isRequired
}

export default ChapterFirstRow
