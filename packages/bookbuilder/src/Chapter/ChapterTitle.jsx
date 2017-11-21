import React from 'react'
import { withRouter } from 'react-router-dom'

import DropdownTitle from './DropdownTitle'
import RenameEmptyError from './RenameEmptyError'
import Title from './Title'

import styles from '../styles/bookBuilder.local.scss'

class ChapterTitle extends React.Component {
  constructor (props) {
    super(props)
    this.goToEditor = this.goToEditor.bind(this)
  }

  save () {
    this.title.save()
  }

  goToEditor () {
    const { chapter, history, isUploadInProgress } = this.props
    if (chapter.lock !== null || isUploadInProgress) return

    history.push(`/books/${chapter.book}/fragments/${chapter.id}`)
  }

  renderTitle () {
    const {
      chapter,
      isRenaming,
      onSaveRename,
      title,
      type,
      update
    } = this.props

    if (type === 'chapter' || type === 'part') {
      return (
        <Title
          isRenaming={isRenaming}
          goToEditor={this.goToEditor}
          onSaveRename={onSaveRename}
          ref={(node) => { this.title = node }}
          title={title}
        />
      )
    }

    if (type === 'component') {
      return (
        <DropdownTitle
          chapter={chapter}
          goToEditor={this.goToEditor}
          title={title}
          update={update}
        />
      )
    }

    return null
  }

  renderError () {
    const { isRenameEmpty } = this.props

    return (
      <RenameEmptyError
        isRenameEmpty={isRenameEmpty}
      />
    )
  }

  render () {
    const title = this.renderTitle()
    const renameEmptyError = this.renderError()

    return (
      <div className={styles.chapterTitle}>

        { title }
        {/* { this.props.chapter.index } */}
        { renameEmptyError }

        {/* <div className={styles.separator} /> */}

      </div>
    )
  }
}

ChapterTitle.propTypes = {
  chapter: React.PropTypes.object.isRequired,
  history: React.PropTypes.object.isRequired,
  isRenaming: React.PropTypes.bool.isRequired,
  isRenameEmpty: React.PropTypes.bool.isRequired,
  isUploadInProgress: React.PropTypes.bool,
  onSaveRename: React.PropTypes.func.isRequired,
  title: React.PropTypes.string.isRequired,
  type: React.PropTypes.string.isRequired,
  update: React.PropTypes.func.isRequired
}

export default withRouter(ChapterTitle)
