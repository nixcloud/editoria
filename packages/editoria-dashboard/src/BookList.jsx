import { isEmpty, map, reverse, sortBy } from 'lodash'
import React from 'react'

import Book from './Book'
import styles from './dashboard.local.scss'

class BookList extends React.Component {
  renderBookList () {
    const { books, container, edit, remove, roles } = this.props
    if (!books) return 'Fetching...'

    if (isEmpty(books)) {
      return (
        <div className={styles['booklist-empty']}>
          There are no books to display.
        </div>
      )
    }

    const items = sortBy(books, 'title')

    const bookComponents = map(items, (book) => {
      return (
        <Book
          book={book}
          container={container}
          edit={edit}
          key={book.id}
          remove={remove}
          roles={roles}
        />
      )
    })

    return bookComponents
  }

  render () {
    const bookList = this.renderBookList()

    return (
      <div className='col-lg-12'>
        { bookList }
      </div>
    )
  }
}

BookList.propTypes = {
  books: React.PropTypes.array.isRequired,
  container: React.PropTypes.object.isRequired,
  edit: React.PropTypes.func.isRequired,
  remove: React.PropTypes.func.isRequired,
  roles: React.PropTypes.array.isRequired
}

export default BookList
