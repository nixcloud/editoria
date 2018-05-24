import React from 'react'
import PropTypes from 'prop-types'
import Authorize from 'pubsweet-client/src/helpers/Authorize'

import styles from '../styles/teamManager.local.scss'

export class GroupHeader extends React.Component {
  render() {
    const { title, showInput, allowed } = this.props

    return (
      <div className={styles.groupHeader}>
        <div className={styles.groupTitle}>
          <h1> {title} </h1>
        </div>
        {allowed ? (
          <Authorize object={title} operation="can view add team memeber">
            <div className={styles.groupBtn} onClick={showInput}>
              <div className={styles.addIcon} />
              <a>{`add ${title}`}</a>
            </div>
          </Authorize>
        ) : null}

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
