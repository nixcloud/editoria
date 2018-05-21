import { without, find } from 'lodash'
import React from 'react'
import PropTypes from 'prop-types'
import Authorize from 'pubsweet-client/src/helpers/Authorize'

import styles from '../styles/teamManager.local.scss'

export class Member extends React.Component {
  constructor(props) {
    super(props)
    this._remove = this._remove.bind(this)
    this.renderRemove = this.renderRemove.bind(this)
  }

  _remove() {
    const { user, team, update, book, updateCollection, users } = this.props

    team.members = without(team.members, user.id)
    update(team).then(res => {
      if (res.team.teamType === 'productionEditor') {
        let productionEditors = []
        for (let i = 0; i < res.team.members.length; i += 1) {
          productionEditors.push(find(users, c => c.id === res.team.members[i]))
        }
        if (productionEditors.length < 1) {
          productionEditors = null
        }
        updateCollection({
          id: book.id,
          productionEditor: productionEditors,
        })
      }
    })
  }
  renderRemove(authorized) {
    const { user } = this.props
    if (authorized) {
      return (
        <li>
          <div className={styles.personContainer} style={{ cursor: 'default' }}>
            <div>
              <span>{user.username}</span>
            </div>
          </div>
          <div className={styles.actionsContainer}>
            <div className={styles.actionContainer}>
              <a onClick={this._remove}>Remove</a>
            </div>
          </div>
        </li>
      )
    }
    return (
      <li>
        <div
          className={styles.personContainer}
          style={{ backgroundImage: 'none' }}
        >
          <div>
            <span>{user.username}</span>
          </div>
        </div>
      </li>
    )
  }
  render() {
    const { book, team } = this.props

    const authorizationObject = {
      id: book.id,
      teamType: team.teamType,
    }
    return (
      <Authorize
        object={authorizationObject}
        operation="can remove team member"
        unauthorized={this.renderRemove(false)}
      >
        {this.renderRemove(true)}
      </Authorize>
    )
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
