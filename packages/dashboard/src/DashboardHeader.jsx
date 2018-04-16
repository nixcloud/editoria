// import { includes, some } from 'lodash'
import React from 'react'
import PropTypes from 'prop-types'
import withAuthsome from 'pubsweet-client/src/helpers/withAuthsome'
import { compose } from 'redux'

import styles from './dashboard.local.scss'

class DashboardHeader extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      canAddBooks: false,
    }
  }
  componentWillMount() {
    this.checkAuth(this.props.user, 'POST', { path: '/collections' })
  }

  async checkAuth(currentUser, operation, object) {
    const { authsome } = this.props
    try {
      const canAddBooks = await authsome.can(currentUser.id, operation, object)
      this.setState({
        canAddBooks,
      })
    } catch (err) {
      console.error(err)
    }
  }

  renderButton() {
    const { toggle } = this.props
    const { canAddBooks } = this.state

    // const accepted = ['admin', 'production-editor']
    // const canAddBook = some(accepted, role => includes(roles, role))
    // let canAddBook = false
    // console.log('statessss', this.state)
    // authsome.can(user, 'create', object).then(val => {
    //   console.log('val', val)
    //   canAddBook = val
    // })
    // console.log('can', canAddBook)

    if (!canAddBooks) return null

    return (
      <div className={styles.addBookBtn} onClick={toggle}>
        <div className={styles.addBookIcon} />
        <a>add book</a>
      </div>
    )
  }

  render() {
    const addButton = this.renderButton()

    return (
      <div className="col-lg-12">
        <h1 className={styles.bookTitle}>Books</h1>
        {addButton}
      </div>
    )
  }
}

DashboardHeader.propTypes = {
  roles: PropTypes.arrayOf(PropTypes.string).isRequired,
  toggle: PropTypes.func.isRequired,
}

// export default DashboardHeader
export default compose(withAuthsome())(DashboardHeader)
