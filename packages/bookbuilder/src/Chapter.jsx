import { flow } from 'lodash'
import React from 'react'
import PropTypes from 'prop-types'
import { DragSource, DropTarget } from 'react-dnd'
import Authorize from 'pubsweet-client/src/helpers/Authorize'
import FirstRow from './Chapter/FirstRow'
import SecondRow from './Chapter/SecondRow'

import {
  chapterSource,
  chapterTarget,
  collectDrag,
  collectDrop,
  itemTypes,
} from './dnd'

import styles from './styles/bookBuilder.local.scss'

class Chapter extends React.Component {
  constructor(props) {
    super(props)

    this.toggleUpload = this.toggleUpload.bind(this)
    this.update = this.update.bind(this)

    this.state = {
      isUploadInProgress: false,
    }
  }

  update(patch) {
    const { book, update } = this.props
    update(book, patch)
  }

  toggleUpload() {
    this.setState({
      isUploadInProgress: !this.state.isUploadInProgress,
    })

    // if (!this.state.isUploadInProgress) this.removeUploadState()
  }

  renderHasContent() {
    const { chapter } = this.props
    const source = chapter.source || ''
    const hasContent = source.trim().length > 0
    return hasContent
  }

  // getLocalStorageKey () {
  //   const { chapter } = this.props
  //   return 'chapter:upload:' + chapter.id
  // }
  //
  // persistUploadState () {
  //   const key = this.getLocalStorageKey()
  //   window.localStorage.setItem(key, true)
  // }
  //
  // removeUploadState () {
  //   const key = this.getLocalStorageKey()
  //   window.localStorage.removeItem(key)
  // }
  //
  // componentWillMount () {
  //   const key = this.getLocalStorageKey()
  //   var entry = window.localStorage.getItem(key)
  //   if (entry) {
  //     this.setState({
  //       isUploadInProgress: true
  //     })
  //   }
  // }
  //
  // componentWillUnmount () {
  //   if (this.state.isUploadInProgress) {
  //     this.persistUploadState()
  //   }
  // }

  render() {
    const {
      book,
      chapter,
      connectDragSource,
      connectDropTarget,
      ink,
      isDragging,
      outerContainer,
      remove,
      user,
      title,
      type,
      uploading,
    } = this.props

    // console.log('ch upl', this.props.uploading)
    const hasContent = this.renderHasContent()
    const { isUploadInProgress } = this.state

    const listItemStyle = {
      opacity: isDragging ? 0 : 1,
    }
    const indicatorGrabAllowed = allowed => {
      if (!allowed) {
        return (
          <div
            className={`${styles.grabIcon} ${styles.notAllowed} ${
              hasContent === true ? styles.hasContent : ''
            }`}
          />
        )
      }
      return (
        <div
          className={`${styles.grabIcon} ${
            hasContent === true ? styles.hasContent : ''
          }`}
        >
          <div className={styles.tooltip}>grab to sort</div>
        </div>
      )
    }

    // TODO -- refactor these huge class names
    // TODO -- make the dot and line component/s
    return connectDragSource(
      connectDropTarget(
        <li
          className={`${styles.chapterContainer} col-lg-12 bb-chapter ${
            chapter.subCategory === 'chapter' ? styles.isChapter : styles.isPart
          }`}
          style={listItemStyle}
        >
          <div className={`col-lg-1 ${styles.grabContainer}`}>
            <Authorize
              object={book}
              operation="can reoder bookComponents"
              unauthorized={indicatorGrabAllowed(false)}
            >
              {indicatorGrabAllowed(true)}
            </Authorize>
          </div>

          <div className={`col-lg-11 ${styles.chapterMainContent}`}>
            <FirstRow
              book={book}
              chapter={chapter}
              isUploadInProgress={isUploadInProgress || uploading}
              outerContainer={outerContainer}
              remove={remove}
              title={title}
              type={type}
              update={this.update}
              user={user}
            />

            <SecondRow
              chapter={chapter}
              convertFile={ink}
              isUploadInProgress={isUploadInProgress || uploading}
              outerContainer={outerContainer}
              toggleUpload={this.toggleUpload}
              update={this.update}
              user={user}
              viewOrEdit={this._viewOrEdit}
            />
          </div>

          <div
            className={
              chapter.division === 'body'
                ? styles.leftBorderBody
                : styles.leftBorderComponent
            }
          />
        </li>,
      ),
    )
  }
}

Chapter.propTypes = {
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
  connectDragSource: PropTypes.func.isRequired,
  connectDropTarget: PropTypes.func.isRequired,
  ink: PropTypes.func.isRequired,
  isDragging: PropTypes.bool.isRequired,
  outerContainer: PropTypes.any.isRequired,
  remove: PropTypes.func.isRequired,
  user: PropTypes.shape({
    admin: PropTypes.bool,
    email: PropTypes.string,
    id: PropTypes.string,
    rev: PropTypes.string,
    type: PropTypes.string,
    username: PropTypes.string,
  }),
  title: PropTypes.string,
  type: PropTypes.string.isRequired,
  update: PropTypes.func.isRequired,
  uploading: PropTypes.bool,
}

Chapter.defaultProps = {
  uploading: false,
  title: null,
}

export { Chapter as UnwrappedChapter }

// combine them, as each chapter can be both a source and a target
export default flow(
  DragSource(itemTypes.CHAPTER, chapterSource, collectDrag),
  DropTarget(itemTypes.CHAPTER, chapterTarget, collectDrop),
)(Chapter)
