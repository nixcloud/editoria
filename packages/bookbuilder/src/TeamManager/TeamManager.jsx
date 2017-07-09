import React from 'react'

import GroupList from './GroupList'
import styles from '../styles/teamManager.local.scss'

export class TeamManager extends React.Component {

  render () {
    const { teams, users, updateTeam } = this.props

    return (
      <div className={styles.teamManager}>
        <GroupList
          teams={teams}
          users={users}
          update={updateTeam}
        />
      </div>
    )
  }

}

TeamManager.propTypes = {
  teams: React.PropTypes.array.isRequired,
  users: React.PropTypes.array,
  updateTeam: React.PropTypes.func.isRequired
}

export default TeamManager
