import React from 'react'

import Member from './Member'
import styles from '../styles/teamManager.local.scss'

export class MemberList extends React.Component {

  render () {
    const { members, color, team, update } = this.props
    const remove = (team.teamType.name !== 'Production Editor')

    const list = members.map(function (member, i) {
      return (
        <Member
          color={color}
          user={member}
          team={team}
          update={update}
          remove={remove}
          key={i}
        />
      )
    })

    return (
      <ul className={styles.teamMembersContainer}>
        {list}
      </ul>
    )
  }
}

MemberList.propTypes = {
  members: React.PropTypes.array.isRequired,
  team: React.PropTypes.object.isRequired,
  update: React.PropTypes.func.isRequired,
  color: React.PropTypes.string.isRequired
}

export default MemberList
