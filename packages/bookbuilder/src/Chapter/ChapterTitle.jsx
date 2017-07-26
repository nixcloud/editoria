import React from 'react'
import { browserHistory } from 'react-router'

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
    this.refs.title.save()
  }

  goToEditor () {
    const { chapter } = this.props
    if (chapter.lock !== null) return

    const url = `/books/${chapter.book}/fragments/${chapter.id}`
    browserHistory.push(url)
  }

  renderHasContent () {
    const { chapter, type } = this.props
    const source = chapter.source || ''
    const hasContent = source.trim().length > 0

    if (!hasContent) return null

    // TODO -- move styles to classes (after css refactor)
    let marginTop
    switch (type) {
      case 'part':
        marginTop = '4px'
        break
      case 'chapter':
        marginTop = '2px'
        break
      default:
        marginTop = '5px'
        break
    }

    const elementStyles = {
      color: '#3e644b',
      float: 'left',
      fontSize: '14px',
      marginRight: '7px',
      marginTop
    }

    const hoverTitle = `This ${type} has content`

    return (
      <i
        className='fa fa-check-circle'
        style={elementStyles}
        title={hoverTitle}
      />
    )
  }

  renderUploadIndicator () {
    const { isUploadInProgress } = this.props
    // console.log('is uploading', isUploadInProgress)

    if (!isUploadInProgress) return null

    return (
      <i className={`${styles['animate-flicker']} fa fa-upload`} />
    )
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
          ref='title'
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
    const hasContent = this.renderHasContent()
    const title = this.renderTitle()
    const uploadIndicator = this.renderUploadIndicator()
    const renameEmptyError = this.renderError()

    return (
      <div className={styles.chapterTitle}>

        { hasContent }
        { title }
        { uploadIndicator }
        { renameEmptyError }

        <div className={styles.separator} />

      </div>
    )
  }
}

ChapterTitle.propTypes = {
  chapter: React.PropTypes.object.isRequired,
  isRenaming: React.PropTypes.bool.isRequired,
  isRenameEmpty: React.PropTypes.bool.isRequired,
  isUploadInProgress: React.PropTypes.bool.isRequired,
  onSaveRename: React.PropTypes.func.isRequired,
  title: React.PropTypes.string.isRequired,
  type: React.PropTypes.string.isRequired,
  update: React.PropTypes.func.isRequired
}

export default ChapterTitle
