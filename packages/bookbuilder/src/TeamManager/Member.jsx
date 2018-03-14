import { without } from 'lodash'
import React from 'react'
import PropTypes from 'prop-types'

import styles from '../styles/teamManager.local.scss'

export class Member extends React.Component {
  constructor(props) {
    super(props)
    this._remove = this._remove.bind(this)
  }

  _remove() {
    const { user, team, update } = this.props

    team.members = without(team.members, user.id)
    update(team)
  }

  render() {
    const { user, color, remove } = this.props

    let removeButton = ''
    let Noline = { backgroundImage: 'none' }
    if (remove === true) {
      Noline = { cursor: 'default' }
      removeButton = <a onClick={this._remove}>Remove</a>
    }

    return (
      <li>
        <div className={styles.personContainer} style={Noline}>
          <div>
            <span>{user.username}</span>
          </div>
        </div>
        <div className={styles.actionsContainer}>
          <div className={styles.actionContainer}>{removeButton}</div>
        </div>
      </li>
    )

    // return (
    //   <li className={styles[color]}>
    //
    //     <span>
    //       {user.username}
    //     </span>
    //
    //     { removeButton }
    //
    //   </li>
    // )
  }
}

Member.propTypes = {
  user: PropTypes.shape({
    admin: PropTypes.bool,
    email: PropTypes.string,
    id: PropTypes.string,
    rev: PropTypes.string,
    type: PropTypes.string,
    username: PropTypes.string,
  }).isRequired,
  color: PropTypes.string.isRequired,
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
  remove: PropTypes.bool.isRequired,
}

export default Member
