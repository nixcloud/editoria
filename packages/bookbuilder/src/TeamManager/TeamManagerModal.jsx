import React from 'react'

import AbstractModal from 'editoria-common/src/AbstractModal'
import TeamManager from './TeamManager'

class TeamManagerModal extends React.Component {
  renderBody () {
    const { teams, users, updateTeam } = this.props

    return (
      <TeamManager
        teams={teams}
        users={users}
        updateTeam={updateTeam}
      />
    )
  }

  render () {
    const { container, show, toggle } = this.props
    const body = this.renderBody()

    return (
      <AbstractModal
        body={body}
        cancelText='Close'
        container={container}
        show={show}
        size='large'
        title='Editoria Team Manager'
        toggle={toggle}
      />
    )
  }
}

TeamManagerModal.propTypes = {
  container: React.PropTypes.object.isRequired,
  show: React.PropTypes.bool.isRequired,
  teams: React.PropTypes.array.isRequired,
  toggle: React.PropTypes.func.isRequired,
  users: React.PropTypes.array,
  updateTeam: React.PropTypes.func.isRequired
}

export default TeamManagerModal
