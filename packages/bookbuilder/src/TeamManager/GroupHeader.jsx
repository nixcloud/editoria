import React from 'react'
import PropTypes from 'prop-types'

import styles from '../styles/teamManager.local.scss'

export class GroupHeader extends React.Component {
  render() {
    const { title, showInput } = this.props

    const button =
      title !== 'Production Editor' ? (
        <div className={styles.groupBtn} onClick={showInput}>
          <div className={styles.addIcon} />
          <a>{`add ${title}`}</a>
        </div>
      ) : (
        ''
      )

    return (
      <div className={styles.groupHeader}>
        <div className={styles.groupTitle}>
          <h1> {title} </h1>
        </div>

        {button}

        <div className={styles.separator} />
      </div>
    )
  }
}

GroupHeader.propTypes = {
  title: PropTypes.string.isRequired,
  showInput: PropTypes.func.isRequired,
}

export default GroupHeader
