import React from 'react'
import PropTypes from 'prop-types'

import styles from '../styles/bookBuilder.local.scss'

class RenameEmptyError extends React.Component {
  render() {
    const { isRenameEmpty } = this.props

    if (isRenameEmpty) {
      return (
        <span className={styles.emptyTitle}>New title cannot be empty</span>
      )
    }

    return null
  }
}

RenameEmptyError.propTypes = {
  isRenameEmpty: PropTypes.bool.isRequired,
}

export default RenameEmptyError
