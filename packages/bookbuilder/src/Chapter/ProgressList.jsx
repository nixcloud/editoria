/* DEPRECATED */

import React from 'react'
import PropTypes from 'prop-types'

import ProgressItem from './ProgressItem'
import styles from '../styles/bookBuilder.local.scss'

class ProgressList extends React.Component {
  render() {
    const { chapter, roles, modalContainer, update } = this.props

    return (
      <ul className={styles.proggressListContainer}>
        <ProgressItem
          chapter={chapter}
          hasIcon
          roles={roles}
          type="style"
          update={update}
        />

        <ProgressItem
          chapter={chapter}
          hasIcon
          modalContainer={modalContainer}
          roles={roles}
          type="edit"
          update={update}
        />

        <ProgressItem
          chapter={chapter}
          hasIcon
          modalContainer={modalContainer}
          roles={roles}
          type="review"
          update={update}
        />

        <ProgressItem
          chapter={chapter}
          roles={roles}
          type="clean"
          update={update}
        />
      </ul>
    )
  }
}

ProgressList.propTypes = {
  chapter: PropTypes.shape({
    alignment: PropTypes.objectOf(PropTypes.bool),
    author: PropTypes.string,
    book: PropTypes.string,
    division: PropTypes.string,
    id: PropTypes.string,
    index: PropTypes.number,
    kind: PropTypes.string,
    lock: PropTypes.shape({
      editor: PropTypes.shape({
        username: PropTypes.string,
      }),
      timestamp: PropTypes.string,
    }),
    number: PropTypes.number,
    owners: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.string,
        username: PropTypes.string,
      }),
    ),
    progress: PropTypes.objectOf(PropTypes.number),
    rev: PropTypes.string,
    source: PropTypes.string,
    status: PropTypes.string,
    subCategory: PropTypes.string,
    title: PropTypes.string,
    trackChanges: PropTypes.bool,
    type: PropTypes.string,
  }).isRequired,
  modalContainer: PropTypes.any.isRequired,
  roles: PropTypes.arrayOf(PropTypes.string).isRequired,
  update: PropTypes.func.isRequired,
}

export default ProgressList
