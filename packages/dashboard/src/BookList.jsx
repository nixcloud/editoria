import { isEmpty, map, sortBy } from 'lodash'
import React from 'react'
import PropTypes from 'prop-types'

import Book from './Book'
import styles from './dashboard.local.scss'

class BookList extends React.Component {
  renderBookList() {
    const { books, container, edit, remove, roles } = this.props

    if (!books) return 'Fetching...'

    if (isEmpty(books)) {
      return (
        <div className={styles['booklist-empty']}>
          There are no books to display.
        </div>
      )
    }

    const items = sortBy(books, [book => book.title.toLowerCase()])

    const bookComponents = map(items, book => (
      <Book
        book={book}
        container={container}
        edit={edit}
        key={book.id}
        remove={remove}
      />
    ))

    return bookComponents
  }

  render() {
    const bookList = this.renderBookList()

    return <div className="col-lg-12">{bookList}</div>
  }
}

BookList.propTypes = {
  books: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string,
      title: PropTypes.string,
    }),
  ).isRequired,
  container: PropTypes.any.isRequired,
  edit: PropTypes.func.isRequired,
  remove: PropTypes.func.isRequired,
  roles: PropTypes.arrayOf(PropTypes.string).isRequired,
}

export default BookList
