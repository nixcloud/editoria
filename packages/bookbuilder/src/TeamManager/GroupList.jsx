import { find, keys } from 'lodash'
import React from 'react'

import Group from './Group'
import styles from '../styles/teamManager.local.scss'

export class GroupList extends React.Component {
  constructor (props) {
    super(props)

    this.options = {
      'Production Editor': {
        color: 'blue',
        title: 'Production Editor'
      },
      'Copy Editors': {
        color: 'purple',
        title: 'Copy Editors',
        addButtonText: 'add copy editor'
      },
      'Authors': {
        color: 'yellow',
        title: 'Authors',
        addButtonText: 'add author'
      }
    }
  }

  render () {
    const { teams, users, update } = this.props
    const options = this.options

    // TODO -- refactor
    // do it like this to guarantee order of groups
    const groups = keys(options).map((key, i) => {
      let name

      // get team of this name
      const team = find(teams, (team) => {
        name = team.name.trim()
        return name === key
      })

      if (!team) return

      return (
        <div key={i}>
          <Group
            team={team}
            users={users}
            update={update}
            options={options[name]}
          />
          <div className={styles.groupSeperator} />
        </div>
      )
    })

    return (
      <div>
        { groups }
      </div>
    )
  }
}

GroupList.propTypes = {
  teams: React.PropTypes.array.isRequired,
  users: React.PropTypes.array,
  update: React.PropTypes.func.isRequired
}

export default GroupList
