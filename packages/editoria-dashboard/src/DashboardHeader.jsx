import { includes, some } from 'lodash'
import React from 'react'

import styles from './dashboard.local.scss'

class DashboardHeader extends React.Component {
  renderButton () {
    const { roles, toggle } = this.props

    const accepted = ['admin', 'production-editor']
    const canAddBook = some(accepted, role => includes(roles, role))

    if (!canAddBook) return null

    return (
      <div
        className={styles.addBookBtn}
        onClick={toggle}
      >
        <a>add book</a>
      </div>
    )
  }

  render () {
    const addButton = this.renderButton()

    return (
      <div className='col-lg-12'>
        <h1 className={styles.bookTitle}>
          Books
          { addButton }
        </h1>
      </div>
    )
  }
}

DashboardHeader.propTypes = {
  roles: React.PropTypes.array.isRequired,
  toggle: React.PropTypes.func.isRequired
}

export default DashboardHeader
