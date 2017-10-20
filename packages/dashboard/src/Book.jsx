import React from 'react'
import { Link, withRouter } from 'react-router-dom'

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
      rev: book.rev,
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

    return ['admin', 'production-editor'].some(role => roles.includes(role))
  }

  goToBookBuilder () {
    const { book, history } = this.props

    history.push(`/manage/books/${book.id}/book-builder`)
  }

  removeBook () {
    this.props.remove(this.props.book)
  }

  render () {
    const { book, container } = this.props
    const { showModal, isRenaming } = this.state

    return (
      <div className={styles.bookContainer}>
        {isRenaming ? (
          <input
            defaultValue={book.title}
            name="renameTitle"
            onKeyPress={this.handleKeyOnInput}
            ref={(el) => { this.renameTitle = el }}
          />
        ) : (
          <div className={styles.bookTitleBorder}>
            <div className={styles.bookTitleWidth}>
              <h3 onDoubleClick={this.goToBookBuilder}>
                {book.title}
              </h3>
            </div>
          </div>
        ) }

        <div className={styles.bookActions}>
          <div className={styles.actionContainer}>
            <Link
              className={styles.editBook}
              to={`/manage/books/${book.id}/book-builder`}>
              Edit
            </Link>
          </div>

          {isRenaming ? (
            <div className={styles.actionContainer}>
              <a
                className={styles.editBook}
                href='#'
                onClick={this.onClickSave}
              >
                Save
              </a>
            </div>
          ) : (
            <div className={styles.actionContainer}>
              <a
                className={styles.editBook}
                href='#'
                onClick={this.onClickRename}
              >
                Rename
              </a>
            </div>
          )}

          {this.canEditBook() && (
            <div className={styles.actionContainer}>
              <a
                className={styles.editBook}
                href="#"
                onClick={this.toggleModal}
              >
                Delete
              </a>
            </div>
          )}
        </div>

        <RemoveBookModal
          book={book}
          container={container}
          remove={this.removeBook}
          show={showModal}
          toggle={this.toggleModal}
        />
      </div>
    )
  }
}

Book.propTypes = {
  book: React.PropTypes.object.isRequired,
  container: React.PropTypes.object.isRequired,
  history: React.PropTypes.object.isRequired,
  edit: React.PropTypes.func.isRequired,
  remove: React.PropTypes.func.isRequired,
  roles: React.PropTypes.array.isRequired
}

export default withRouter(Book)
