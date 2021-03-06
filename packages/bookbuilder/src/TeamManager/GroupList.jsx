import { find, keys } from 'lodash'
import React from 'react'
import PropTypes from 'prop-types'

import Group from './Group'
import styles from '../styles/teamManager.local.scss'

export class GroupList extends React.Component {
  constructor(props) {
    super(props)

    this.options = {
      productionEditor: {
        color: 'blue',
        title: 'Production Editor',
      },
      copyEditor: {
        color: 'purple',
        title: 'Copy Editors',
        addButtonText: 'add copy editor',
      },
      author: {
        color: 'yellow',
        title: 'Authors',
        addButtonText: 'add author',
      },
    }
  }

  render() {
    const { teams, users, update, updateCollection, book } = this.props
    const options  = this.options

    // TODO -- refactor
    // do it like this to guarantee order of groups
    const groups = keys(options).map((key, i) => {

      // get team of this name
      const team = find(teams, team => team.teamType === key)

      if (!team) return null

      return (
        <div key={i}>
          <Group
            options={options[team.teamType]}
            team={team}
            book={book}
            update={update}
            updateCollection={updateCollection}
            users={users}
          />
          <div className={styles.groupSeperator} />
        </div>
      )
    })

    return <div>{groups}</div>
  }
}

GroupList.propTypes = {
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
  update: PropTypes.func.isRequired,
}

GroupList.defaultProps = {
  users: null,
}

export default GroupList
