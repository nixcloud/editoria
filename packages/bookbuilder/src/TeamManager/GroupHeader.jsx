import React from 'react'

import styles from '../styles/teamManager.local.scss'

export class GroupHeader extends React.Component {

  render () {
    const { title, showInput } = this.props

    const button = title !== 'Production Editor'
    ? (
      <div className={styles.groupBtn} onClick={showInput}>
        <a>{ 'add ' + title.toLowerCase() }</a>
      </div>
    )
    : ''

    return (
      <div className={styles.groupHeader}>

        <div className={styles.groupTitle}>
          <h1> { title } </h1>
        </div>

        { button }

        <div className={styles.separator} />

      </div>
    )
  }

}

GroupHeader.propTypes = {
  title: React.PropTypes.string.isRequired,
  showInput: React.PropTypes.func.isRequired
}

export default GroupHeader
