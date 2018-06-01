import React from 'react'
import PropTypes from 'prop-types'
import { withRouter } from 'react-router-dom'
import { indexOf, find } from 'lodash'
import config from 'config'

// import DropdownTitle from './DropdownTitle'
import withLink from 'editoria-common/src/withLink'
import RenameEmptyError from './RenameEmptyError'
import Title from './Title'

import styles from '../styles/bookBuilder.local.scss'

class ChapterTitle extends React.Component {
  constructor(props) {
    super(props)
    this.goToEditor = this.goToEditor.bind(this)
  }

  save() {
    this.title.save()
  }

  goToEditor() {
    const { chapter, history, isUploadInProgress } = this.props
    if (chapter.lock !== null || isUploadInProgress) return

    history.push(`/books/${chapter.book}/fragments/${chapter.id}`)
  }

  renderTitle() {
    const {
      chapter,
      isRenaming,
      onSaveRename,
      title,
      // type,
      // update,
    } = this.props
    const { divisions } = config.bookBuilder
    const { division, subCategory } = chapter
    const { showNumberBeforeComponents } = find(divisions, ['name', division])
    const showNumber =
      indexOf(showNumberBeforeComponents, subCategory) > -1 || false

    return (
      <Title
        isRenaming={isRenaming}
        isLocked={chapter.lock !== null}
        goToEditor={this.goToEditor}
        onSaveRename={onSaveRename}
        // ref={node => (this.title = node)}
        title={title}
        showNumber={showNumber}
        number={chapter.number || null}
      />
    )

    // Closing for now the dropdown functionality and fix it later,
    // because rewrites the functionality of Chapter title
    // if (type === 'component') {
    //   return (
    //     <DropdownTitle
    //       chapter={chapter}
    //       goToEditor={this.goToEditor}
    //       title={title}
    //       update={update}
    //     />
    //   )
    // }

    // return null
  }

  renderError() {
    const { isRenameEmpty } = this.props

    return <RenameEmptyError isRenameEmpty={isRenameEmpty} />
  }

  render() {
    const { chapter, isUploadInProgress } = this.props
    let title = this.renderTitle()
    const url = `/books/${chapter.book}/fragments/${chapter.id}`
    if (chapter.lock === null && !isUploadInProgress) {
      title = withLink(this.renderTitle(), url)
    }
    const renameEmptyError = this.renderError()

    return (
      <div className={styles.chapterTitle}>
        {title}
        {/* { this.props.chapter.index } */}
        {renameEmptyError}
        {/* <div className={styles.separator} /> */}
      </div>
    )
  }
}

ChapterTitle.propTypes = {
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
  history: PropTypes.any.isRequired,
  isRenaming: PropTypes.bool.isRequired,
  isRenameEmpty: PropTypes.bool.isRequired,
  isUploadInProgress: PropTypes.bool,
  onSaveRename: PropTypes.func.isRequired,
  title: PropTypes.string,
  type: PropTypes.string.isRequired,
  update: PropTypes.func.isRequired,
}

ChapterTitle.defaultProps = {
  isUploadInProgress: false,
  title: null,
}

export default withRouter(ChapterTitle)
