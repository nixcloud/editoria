import _ from 'lodash'
import React from 'react'
import PropTypes from 'prop-types'

import GroupHeader from './GroupHeader'
import AddMember from './AddMember'
import MemberList from './MemberList'

export class Group extends React.Component {
  constructor(props) {
    super(props)

    this._showAddMember = this._showAddMember.bind(this)
    this._closeAddMember = this._closeAddMember.bind(this)

    this.state = {
      isAddMemberOpen: false,
    }
  }

  _showAddMember() {
    this.setState({ isAddMemberOpen: true })
  }

  _closeAddMember() {
    this.setState({ isAddMemberOpen: false })
  }

  render() {
    const { team, users, options, update } = this.props
    const members = users.filter(user => _.includes(team.members, user.id))
    console.log('members', members)

    return (
      <div>
        <GroupHeader showInput={this._showAddMember} title={options.title} />

        <AddMember
          hideInput={this._closeAddMember}
          show={this.state.isAddMemberOpen}
          team={team}
          update={update}
          users={users}
        />

        <MemberList
          color={options.color}
          members={members}
          team={team}
          update={update}
        />
      </div>
    )
  }
}

Group.propTypes = {
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
  users: PropTypes.arrayOf(
    PropTypes.shape({
      admin: PropTypes.bool,
      email: PropTypes.string,
      id: PropTypes.string,
      rev: PropTypes.string,
      type: PropTypes.string,
      username: PropTypes.string,
    }),
  ).isRequired,
  options: PropTypes.shape({
    addButtonText: PropTypes.string,
    color: PropTypes.string,
    title: PropTypes.string,
  }).isRequired,
  update: PropTypes.func.isRequired,
}

export default Group
