// import { includes, some } from 'lodash'
import React from 'react'
import PropTypes from 'prop-types'
import { Link, withRouter } from 'react-router-dom'
import Authorize from 'pubsweet-client/src/helpers/Authorize'

import RemoveBookModal from './RemoveBookModal'
import styles from './dashboard.local.scss'

// TODO -- Book and Chapter should both extend a common component
class Book extends React.Component {
  constructor(props) {
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
      showModal: false,
    }
  }

  componentDidUpdate() {
    const { isRenaming } = this.state
    if (isRenaming) this.renameTitle.focus()
  }

  toggleModal() {
    this.setState({
      showModal: !this.state.showModal,
    })
  }

  handleKeyOnInput(event) {
    if (event.charCode !== 13) return
    this.renameBook()
  }

  onClickSave() {
    this.renameBook()
  }

  renameBook() {
    const { book, edit } = this.props

    const patch = {
      id: book.id,
      title: this.renameTitle.value,
    }

    edit(patch)

    this.setState({
      isRenaming: false,
    })
  }

  onClickRename() {
    this.setState({
      isRenaming: true,
    })
  }

  // TODO -- refactor all roles based function into a util
  // canEditBook() {
  //   const { roles } = this.props
  //   const accepted = ['admin', 'production-editor']
  //   const pass = some(accepted, role => includes(roles, role))
  //   return pass
  // }

  goToBookBuilder() {
    const { book, history } = this.props
    const url = `/books/${book.id}/book-builder`
    history.push(url)
  }

  removeBook() {
    const { book, remove } = this.props
    remove(book)
  }

  renderTitle() {
    const { book } = this.props
    const { isRenaming } = this.state

    if (isRenaming) {
      return (
        <input
          defaultValue={book.title}
          name="renameTitle"
          onKeyPress={this.handleKeyOnInput}
          ref={el => {
            this.renameTitle = el
          }}
        />
      )
    }

    return (
      <div className={styles.bookTitleBorder}>
        <div className={styles.bookTitleWidth}>
          <h3 onDoubleClick={this.goToBookBuilder}>{book.title}</h3>
        </div>
      </div>
    )
  }

  // TODO -- edit, rename and remove should be reusable components
  renderEdit() {
    const { book } = this.props

    return (
      <div className={styles.actionContainer}>
        <Link className={styles.editBook} to={`/books/${book.id}/book-builder`}>
          Edit
        </Link>
      </div>
    )
  }

  renderRename() {
    const { isRenaming } = this.state
    const { book } = this.props

    if (isRenaming) {
      return (
        <Authorize operation="can rename books" object={book}>
          <div className={styles.actionContainer}>
            <a className={styles.editBook} href="#" onClick={this.onClickSave}>
              Save
            </a>
          </div>
        </Authorize>
      )
    }

    return (
      <Authorize operation="can rename books" object={book}>
        <div className={styles.actionContainer}>
          <a className={styles.editBook} href="#" onClick={this.onClickRename}>
            Rename
          </a>
        </div>
      </Authorize>
    )
  }

  renderRemove() {
    const { book } = this.props
    return (
      <Authorize operation="can delete books" object={book}>
        <div className={styles.actionContainer}>
          <a className={styles.editBook} href="#" onClick={this.toggleModal}>
            Delete
          </a>
        </div>
      </Authorize>
    )
  }

  renderButtons() {
    const edit = this.renderEdit()
    const rename = this.renderRename()
    const remove = this.renderRemove()

    return (
      <div className={styles.bookActions}>
        {edit}
        {rename}
        {remove}
      </div>
    )
  }

  renderRemoveModal() {
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

  render() {
    const { book } = this.props
    // console.log('book', book)

    const title = this.renderTitle(book)
    const buttons = this.renderButtons(book)
    const removeModal = this.renderRemoveModal()

    return (
      <div className={styles.bookContainer}>
        {title}
        {buttons}
        {removeModal}
      </div>
    )
  }
}

Book.propTypes = {
  book: PropTypes.shape({
    id: PropTypes.string,
    rev: PropTypes.string,
    title: PropTypes.string,
  }).isRequired,
  container: PropTypes.any.isRequired,
  history: PropTypes.any.isRequired,
  edit: PropTypes.func.isRequired,
  remove: PropTypes.func.isRequired,
  roles: PropTypes.arrayOf(PropTypes.string).isRequired,
}

export default withRouter(Book)
