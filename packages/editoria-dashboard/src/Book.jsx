import { includes, some } from 'lodash'
import React from 'react'
import { Link } from 'react-router'
import { browserHistory } from 'react-router'

import RemoveBookModal from './RemoveBookModal'
import styles from './dashboard.local.scss'

// TODO -- Book and Chapter should both extend a common component
class Book extends React.Component {
  constructor (props) {
    super(props)

    this.goToBookBuilder = this.goToBookBuilder.bind(this)
    this.handleKeyOnInput = this.handleKeyOnInput.bind(this)
    this.onClickRename = this.onClickRename.bind(this)
    this.onClickSave = this.onClickSave.bind(this)
    this.removeBook = this.removeBook.bind(this)
    this.renameBook = this.renameBook.bind(this)
    this.toggleModal = this.toggleModal.bind(this)

    this.state = {
      isRenaming: false,
      showModal: false
    }
  }

  componentDidUpdate () {
    const { isRenaming } = this.state
    if (isRenaming) this.renameTitle.focus()
  }

  toggleModal () {
    this.setState({
      showModal: !this.state.showModal
    })
  }

  handleKeyOnInput (event) {
    if (event.charCode !== 13) return
    this.renameBook()
  }

  onClickSave () {
    this.renameBook()
  }

  renameBook () {
    const { book, edit } = this.props

    const patch = {
      id: book.id,
      title: this.renameTitle.value
    }

    edit(patch)
    this.setState({
      isRenaming: false
    })
  }

  onClickRename () {
    this.setState({
      isRenaming: true
    })
  }

  // TODO -- refactor all roles based function into a util
  canEditBook () {
    const { roles } = this.props
    const accepted = ['admin', 'production-editor']
    const pass = some(accepted, role => includes(roles, role))
    return pass
  }

  goToBookBuilder () {
    const { book } = this.props
    const url = `/books/${book.id}/book-builder`
    browserHistory.push(url)
  }

  removeBook () {
    const { book, remove } = this.props
    remove(book)
  }

  renderTitle () {
    const { book } = this.props
    const { isRenaming } = this.state

    if (isRenaming) {
      return (
        <input
          defaultValue={book.title}
          name='renameTitle'
          onKeyPress={this.handleKeyOnInput}
          ref={(el) => { this.renameTitle = el }}
        />
      )
    }

    return (
      <div className={styles.bookTitleBorder}>
        <div className={styles.bookTitleWidth}>
          <h3 onDoubleClick={this.onClickRename} >
            { book.title }
          </h3>
        </div>
      </div>
    )
  }

  // TODO -- edit, rename and remove should be reusable components
  renderEdit () {
    const { book } = this.props

    return (
      <Link
        className={styles.editBook}
        to={`/books/${book.id}/book-builder`}
      >
        Edit
      </Link>
    )
  }

  renderRename () {
    const canRename = this.canEditBook()
    if (!canRename) return null

    const { isRenaming } = this.state

    if (isRenaming) {
      return (
        <a
          className={styles.editBook}
          href='#'
          onClick={this.onClickSave}
        >
          Save
        </a>
      )
    }

    return (
      <a
        className={styles.editBook}
        href='#'
        onClick={this.onClickRename}
      >
        Rename
      </a>
    )
  }

  renderRemove () {
    const canRemove = this.canEditBook()
    if (!canRemove) return null

    return (
      <a
        className={styles.editBook}
        href='#'
        onClick={this.toggleModal}
      >
        Remove
      </a>
    )
  }

  renderButtons () {
    const rename = this.renderRename()
    const edit = this.renderEdit()
    const remove = this.renderRemove()

    return (
      <div className={styles.bookActions}>
        { edit }
        { rename }
        { remove }
      </div>
    )
  }

  renderRemoveModal () {
    const { book, container } = this.props
    const { showModal } = this.state
    if (!showModal) return null

    return (
      <RemoveBookModal
        book={book}
        container={container}
        remove={this.removeBook}
        show={showModal}
        toggle={this.toggleModal}
      />
    )
  }

  render () {
    const { book } = this.props

    const title = this.renderTitle(book)
    const buttons = this.renderButtons(book)
    const removeModal = this.renderRemoveModal()

    return (
      <div className={styles.bookContainer}>
        { title }
        { buttons }
        { removeModal }
      </div>
    )
  }
}

Book.propTypes = {
  book: React.PropTypes.object.isRequired,
  container: React.PropTypes.object.isRequired,
  edit: React.PropTypes.func.isRequired,
  remove: React.PropTypes.func.isRequired
}

export default Book
