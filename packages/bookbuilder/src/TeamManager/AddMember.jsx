import { find, union } from 'lodash'
import React from 'react'
import PropTypes from 'prop-types'

import TextInput from 'editoria-common/src/TextInput'

import styles from '../styles/teamManager.local.scss'

export class AddMember extends React.Component {
  constructor(props) {
    super(props)

    this._onClickAdd = this._onClickAdd.bind(this)

    this._search = this._search.bind(this)
    this._save = this._save.bind(this)
    this._updateMessage = this._updateMessage.bind(this)

    this._hide = this._hide.bind(this)

    this.state = {
      message: {},
    }
  }

  _onClickAdd() {
    this.setState({ message: {} })
    this._search(this.refs.addUser.state.value)
    this.refs.addUser.state.value = ''
  }

  _search(username) {
    const { team, users } = this.props

    const user = find(users, c => c.username === username)

    if (user) {
      team.members = union(team.members, [user.id])
      this._save(team)
      return this._updateMessage(null, username)
    }

    this._updateMessage('error', username)
  }

  _save(team) {
    const { update } = this.props
    update(team)
  }

  _updateMessage(error, username) {
    let msg

    if (error) {
      msg = `user ${username} not found`
      return this.setState({
        message: {
          error: true,
          text: msg,
          classname: 'failureGroup',
        },
      })
    }

    msg = `user ${username} successfully added to group`
    this.setState({
      message: {
        error: false,
        text: msg,
        classname: 'successGroup',
      },
    })
  }

  _hide() {
    this.setState({ message: {} })
    this.props.hideInput()
  }

  render() {
    const { show } = this.props

    const addSingleMember = show ? (
      <div className={styles.userInputContainer}>
        <TextInput
          className={styles.usernameInput}
          onSave={this._onClickAdd}
          placeholder="Please enter the username"
          ref="addUser"
        />

        <a className={styles.addUsernameBtn} onClick={this._onClickAdd}>
          add
        </a>

        <a className={styles.closeUsernameBtn} onClick={this._hide}>
          x
        </a>

        <span className={styles[this.state.message.classname]}>
          {this.state.message.text}
        </span>
      </div>
    ) : null

    return <span> {addSingleMember} </span>
  }
}

AddMember.propTypes = {
  show: PropTypes.bool.isRequired,
  hideInput: PropTypes.func.isRequired,
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
  }),
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

export default AddMember
