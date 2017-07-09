import _ from 'lodash'
import React from 'react'

import GroupHeader from './GroupHeader'
import AddMember from './AddMember'
import MemberList from './MemberList'

export class Group extends React.Component {
  constructor (props) {
    super(props)

    this._showAddMember = this._showAddMember.bind(this)
    this._closeAddMember = this._closeAddMember.bind(this)

    this.state = {
      isAddMemberOpen: false
    }
  }

  _showAddMember () {
    this.setState({ isAddMemberOpen: true })
  }

  _closeAddMember () {
    this.setState({ isAddMemberOpen: false })
  }

  render () {
    const { team, users, options, update } = this.props

    const members = users.filter(function (user) {
      return _.includes(team.members, user.id)
    })

    return (
      <div>
        <GroupHeader
          title={team.name}
          showInput={this._showAddMember}
        />

        <AddMember
          show={this.state.isAddMemberOpen}
          hideInput={this._closeAddMember}
          users={users}
          team={team}
          update={update}
        />

        <MemberList
          color={options.color}
          members={members}
          update={update}
          team={team}
        />
      </div>
    )
  }
}

Group.propTypes = {
  team: React.PropTypes.object.isRequired,
  users: React.PropTypes.array.isRequired,
  options: React.PropTypes.object.isRequired,
  update: React.PropTypes.func.isRequired
}

export default Group
