import _ from 'lodash'
import React from 'react'
import { DragDropContext } from 'react-dnd'
import HTML5Backend from 'react-dnd-html5-backend'

import AddButton from './AddButton'
import Chapter from './Chapter'
import styles from './styles/bookBuilder.local.scss'

export class Division extends React.Component {
  constructor (props) {
    super(props)

    this._onAddClick = this._onAddClick.bind(this)
    this._onRemove = this._onRemove.bind(this)
    this._onMove = this._onMove.bind(this)
  }

  _onAddClick (group) {
    const { type, chapters, add, book } = this.props

    let newChapter = {
      book: book.id,

      subCategory: (type === 'body') ? group : 'component',
      division: type,
      alignment: {
        left: false,
        right: false
      },
      progress: {
        style: 0,
        edit: 0,
        review: 0,
        clean: 0
      },
      lock: null,

      index: chapters.length || 0,
      kind: 'chapter',
      title: (type === 'body') ? 'Untitled' : 'Choose Component',

      status: 'unpublished',
      author: '',
      source: '',
      comments: {},
      trackChanges: false
    }

    add(book, newChapter)
  }

  _onRemove (chapter) {
    const { chapters, remove, update, book } = this.props
    const deletedIndex = chapter.index

    remove(book, chapter)

    const chaptersToModify = _.filter(chapters, function (c) {
      return c.index > deletedIndex
    })

    _.forEach(chaptersToModify, function (c) {
      const patch = {
        id: c.id,
        index: (c.index - 1)
      }

      update(book, patch)
    })
  }

  // Reorder chapters
  _onMove (dragIndex, hoverIndex) {
    // hovering over current position
    if (dragIndex === hoverIndex) { return }

    const { book, chapters, update } = this.props
    const dragChapter = chapters[dragIndex]

    let toUpdate = []

    // dragging upwards
    if (dragIndex > hoverIndex) {
      // find the chapters that changed place
      const toModify = _.filter(chapters, c => {
        return c.index >= hoverIndex && c.index < dragIndex
      })

      // build the patches for the chapters' updates
      const patches = _.map(toModify, chapter => {
        return {
          id: chapter.id,
          index: (chapter.index + 1)
        }
      })

      toUpdate = _.union(toUpdate, patches)
    }

    // dragging downwards
    if (dragIndex < hoverIndex) {
      // TODO -- refactor?
      // do the same as above
      const toModify = _.filter(chapters, function (c) {
        return c.index <= hoverIndex && c.index > dragIndex
      })

      const patches = _.map(toModify, chapter => {
        return {
          id: chapter.id,
          index: (chapter.index - 1)
        }
      })

      toUpdate = _.union(toUpdate, patches)
    }

    // add the dragged chapter to the list of patches that are needed
    const draggedPatch = {
      id: dragChapter.id,
      index: hoverIndex
    }
    toUpdate.push(draggedPatch)

    // perform all the updates
    _.forEach(toUpdate, patch => {
      update(book, patch)
    })
  }

  render () {
    const { book, chapters, ink, outerContainer, roles, title, type, update, uploadStatus } = this.props
    const { _onAddClick, _onRemove, _onMove } = this

    // console.log('div upl', uploadStatus)

    const chapterType = (type === 'body') ? 'chapter' : 'component'

    const chapterInstances = _.map(chapters, function (c, i) {
      // console.log('c id', c.id)
      // console.log(uploadStatus[c.id])
      // console.log('')
      return (
        <Chapter
          book={book}
          chapter={c}
          id={c.id}
          ink={ink}
          key={c.id}
          move={_onMove}
          no={i}
          outerContainer={outerContainer}
          remove={_onRemove}
          roles={roles}
          title={c.title}
          type={c.subCategory}
          update={update}
          uploading={uploadStatus[c.id]}
        />
      )
    })

    let addButtons
    if (type === 'body') {
      addButtons = (
        <span>
          <AddButton
            group='chapter'
            add={_onAddClick}
          />
          <AddButton
            group='part'
            add={_onAddClick}
          />
        </span>
      )
    } else {
      addButtons = (
        <AddButton
          group='component'
          add={_onAddClick}
        />
      )
    }

    const list = (
      <ul className={styles.sectionChapters}>
        { chapterInstances }
      </ul>
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
            <h1> { title } </h1>
          </div>

          { addButtons }

          <div className={styles.separator} />
        </div>

        <div id='displayed'>
          { displayed }
        </div>
      </div>
    )
  }
}

Division.propTypes = {
  add: React.PropTypes.func.isRequired,
  book: React.PropTypes.object.isRequired,
  chapters: React.PropTypes.array.isRequired,
  ink: React.PropTypes.func.isRequired,
  outerContainer: React.PropTypes.object.isRequired,
  remove: React.PropTypes.func.isRequired,
  roles: React.PropTypes.array,
  title: React.PropTypes.string.isRequired,
  type: React.PropTypes.string.isRequired,
  update: React.PropTypes.func.isRequired,
  uploadStatus: React.PropTypes.object
}

export default DragDropContext(HTML5Backend)(Division)
