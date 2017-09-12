import React from 'react'

import ProgressItem from './ProgressItem'
import styles from '../styles/bookBuilder.local.scss'

class ProgressList extends React.Component {
  render () {
    const { chapter, roles, modalContainer, update } = this.props

    return (
      <ul className={styles.proggressListContainer}>
        <ProgressItem
          chapter={chapter}
          hasIcon
          roles={roles}
          type='style'
          update={update}
        />

        <ProgressItem
          chapter={chapter}
          hasIcon
          modalContainer={modalContainer}
          roles={roles}
          type='edit'
          update={update}
        />

        <ProgressItem
          chapter={chapter}
          hasIcon
          modalContainer={modalContainer}
          roles={roles}
          type='review'
          update={update}
        />

        <ProgressItem
          chapter={chapter}
          roles={roles}
          type='clean'
          update={update}
        />
      </ul>
    )
  }
}

ProgressList.propTypes = {
  chapter: React.PropTypes.object.isRequired,
  modalContainer: React.PropTypes.object.isRequired,
  roles: React.PropTypes.array.isRequired,
  update: React.PropTypes.func.isRequired
}

export default ProgressList
