import React from 'react'
import PropTypes from 'prop-types'

import GroupList from './GroupList'
import styles from '../styles/teamManager.local.scss'

export class TeamManager extends React.Component {
  render() {
    const { teams, users, updateTeam, updateCollection, book } = this.props

    return (
      <div className={styles.teamManager}>
        <GroupList
          teams={teams}
          book={book}
          update={updateTeam}
          updateCollection={updateCollection}
          users={users}
        />
      </div>
    )
  }
}

TeamManager.propTypes = {
  teams: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string,
      name: PropTypes.string,
      type: PropTypes.string,
      rev: PropTypes.string,
      teamType: PropTypes.shape({
        name: PropTypes.string,
        permissions: PropTypes.arrayOf(PropTypes.string),
      }),
      members: PropTypes.arrayOf(PropTypes.string),
      object: PropTypes.shape({
        id: PropTypes.string,
        type: PropTypes.string,
      }),
    }),
  ).isRequired,
  users: PropTypes.arrayOf(
    PropTypes.shape({
      admin: PropTypes.bool,
      email: PropTypes.string,
      id: PropTypes.string,
      rev: PropTypes.string,
      type: PropTypes.string,
      username: PropTypes.string,
    }),
  ),
  updateTeam: PropTypes.func.isRequired,
}

TeamManager.defaultProps = {
  users: null,
}

export default TeamManager
