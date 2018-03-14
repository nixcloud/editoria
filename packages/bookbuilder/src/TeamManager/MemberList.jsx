import React from 'react'
import PropTypes from 'prop-types'

import Member from './Member'
import styles from '../styles/teamManager.local.scss'

export class MemberList extends React.Component {
  render() {
    const { members, color, team, update } = this.props
    const remove = team.teamType.name !== 'Production Editor'

    const list = members.map((member, i) => (
      <Member
        color={color}
        key={i}
        remove={remove}
        team={team}
        update={update}
        user={member}
      />
    ))

    return <ul className={styles.teamMembersContainer}>{list}</ul>
  }
}

MemberList.propTypes = {
  members: PropTypes.arrayOf(PropTypes.any).isRequired,
  team: PropTypes.shape({
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
  }).isRequired,
  update: PropTypes.func.isRequired,
  color: PropTypes.string.isRequired,
}

export default MemberList
