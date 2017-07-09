import React from 'react'

import styles from '../styles/bookBuilder.local.scss'

class RenameEmptyError extends React.Component {
  render () {
    const { isRenameEmpty } = this.props

    if (isRenameEmpty) {
      return (
        <span className={styles.emptyTitle}>
          New title cannot be empty
        </span>
      )
    }

    return null
  }
}

RenameEmptyError.propTypes = {
  isRenameEmpty: React.PropTypes.bool.isRequired
}

export default RenameEmptyError
