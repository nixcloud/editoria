import {
  clone,
  each,
  filter,
  findIndex,
  forEach,
  groupBy,
  has,
  isEmpty,
  map,
} from 'lodash'

import React from 'react'
import PropTypes from 'prop-types'
import { DragDropContext } from 'react-dnd'
import HTML5Backend from 'react-dnd-html5-backend'
import Authorize from 'pubsweet-client/src/helpers/Authorize'

import AddButton from './AddButton'
import Chapter from './Chapter'
import styles from './styles/bookBuilder.local.scss'

class Division extends React.Component {
  constructor(props) {
    super(props)

    this.onAddClick = this.onAddClick.bind(this)
    this.onEndDrag = this.onEndDrag.bind(this)
    this.onMove = this.onMove.bind(this)
    this.onRemove = this.onRemove.bind(this)

    this.state = {
      chapters: props.chapters,
    }
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      chapters: nextProps.chapters,
    })
  }

  onAddClick(group) {
    const { add, book, chapters, type } = this.props

    const newChapter = {
      alignment: {
        left: false,
        right: false,
      },
      author: '',
      book: book.id,
      division: type,
      index: chapters.length || 0,
      kind: 'chapter',
      lock: null,
      number: undefined,
      progress: {
        clean: 0,
        edit: 0,
        review: 0,
        style: 0,
      },
      source: '',
      status: 'unpublished',
      subCategory: type === 'body' ? group : 'component',
      title: 'Untitled',
      trackChanges: false,
    }

    const groupFragmentsByDivision = groupBy(chapters, 'division')
    const groupedFragmentsBySubcategory = groupBy(
      groupFragmentsByDivision[type],
      'subCategory',
    )
    const hasPartsOrChapters = has(groupedFragmentsBySubcategory, group)

    if (!isEmpty(groupedFragmentsBySubcategory)) {
      newChapter.number = hasPartsOrChapters
        ? groupedFragmentsBySubcategory[group].length + 1
        : 1
    } else {
      newChapter.number = 1
    }

    add(book, newChapter)
  }

  // When drag is released, send all updates necessary
  onEndDrag() {
    const { chapters } = this.state
    const { book, update, type } = this.props
    const groupFragmentsByDivision = groupBy(chapters, 'division')
    const groupedFragmentsBySubcategory = groupBy(
      groupFragmentsByDivision[type],
      'subCategory',
    )

    each(chapters, (c, i) => {
      // position has changed
      if (c.index !== i) {
        const patch = {
          id: c.id,
          index: i,
        }

        if (c.number) {
          const { subCategory } = c
          const index = findIndex(
            groupedFragmentsBySubcategory[subCategory],
            f => f.id === c.id,
          )
          patch.number = index + 1
        }

        update(book, patch)
      }
    })
  }

  // When moving chapters, keep their order in the state
  onMove(dragIndex, hoverIndex) {
    const { chapters } = this.state
    const chs = clone(chapters)

    // Change dragged fragment position in the array
    const dragged = chs.splice(dragIndex, 1)[0] // remove
    chs.splice(hoverIndex, 0, dragged) // reinsert at new position

    this.setState({ chapters: chs })
  }

  onRemove(chapter) {
    const { chapters, remove, update, book } = this.props
    const deletedIndex = chapter.index

    remove(book, chapter)

    const chaptersToModify = filter(chapters, c => c.index > deletedIndex)

    forEach(chaptersToModify, c => {
      const patch = {
        id: c.id,
        index: c.index - 1,
      }

      if (
        chapter.subCategory === c.subCategory &&
        (chapter.number && c.number)
      ) {
        patch.number = c.number - 1
      }

      update(book, patch)
    })
  }

  render() {
    const {
      book,
      // chapters,
      ink,
      outerContainer,
      user,
      title,
      type,
      update,
      uploadStatus,
    } = this.props

    const { chapters } = this.state

    const { onAddClick, onEndDrag, onRemove, onMove } = this

    const chapterType = type === 'body' ? 'chapter' : 'component'

    const chapterInstances = map(chapters, (c, i) => (
      <Chapter
        book={book}
        chapter={c}
        id={c.id}
        ink={ink}
        key={c.id}
        no={i}
        onEndDrag={onEndDrag}
        onMove={onMove}
        outerContainer={outerContainer}
        remove={onRemove}
        user={user}
        title={c.title}
        type={c.subCategory}
        update={update}
        uploading={uploadStatus[c.id]}
      />
    ))

    let addButtons
    if (type === 'body') {
      addButtons = (
        <Authorize object={book} operation="can view addComponent">
          <span>
            <AddButton add={onAddClick} group="chapter" />
            <AddButton add={onAddClick} group="part" />
          </span>
        </Authorize>
      )
    } else {
      addButtons = (
        <Authorize object={book} operation="can view addComponent">
          <AddButton add={onAddClick} group="component" />
        </Authorize>
      )
    }

    const list = (
      <ul className={styles.sectionChapters}> {chapterInstances} </ul>
    )

    const emptyList = (
      <div className={styles.noChapters}>
        There are no {chapterType}s in this division.
      </div>
    )

    const displayed = chapters.length > 0 ? list : emptyList

    return (
      <div>
        <div className={styles.sectionHeader}>
          <div className={styles.sectionTitle}>
            <h1> {title} </h1>
          </div>

          {addButtons}

          <div className={styles.separator} />
        </div>

        <div id="displayed"> {displayed} </div>
      </div>
    )
  }
}

Division.propTypes = {
  add: PropTypes.func.isRequired,
  book: PropTypes.shape({
    id: PropTypes.string,
    rev: PropTypes.string,
    title: PropTypes.string,
  }).isRequired,
  chapters: PropTypes.arrayOf(
    PropTypes.shape({
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
    }),
  ).isRequired,
  ink: PropTypes.func.isRequired,
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
  title: PropTypes.string.isRequired,
  type: PropTypes.string.isRequired,
  update: PropTypes.func.isRequired,
  uploadStatus: PropTypes.objectOf(PropTypes.bool),
}

export { Division as UnWrappedDivision }

export default DragDropContext(HTML5Backend)(Division)
