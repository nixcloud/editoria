import { includes } from 'lodash'
import React from 'react'

import noop from '../../utils/noop'
import styles from '../styles/bookBuilder.local.scss'
import UnlockModal from './UnlockModal'

class EditingNotification extends React.Component {
  constructor (props) {
    super(props)

    this.formatDate = this.formatDate.bind(this)
    this.isAdmin = this.isAdmin.bind(this)
    this.toggleModal = this.toggleModal.bind(this)

    this.state = {
      showModal: false
    }
  }

  toggleModal () {
    this.setState({
      showModal: !this.state.showModal
    })
  }

  isAdmin () {
    const { roles } = this.props
    return includes(roles, 'admin')
  }

  formatDate (timestamp) {
    const date = new Date(timestamp)

    const day = date.getDate()
    const month = date.getMonth() + 1
    const year = date.getFullYear()

    let hours = date.getHours().toString()
    if (hours.length === 1) {
      hours = '0' + hours
    }

    let minutes = date.getMinutes().toString()
    if (minutes.length === 1) {
      minutes = '0' + minutes
    }

    const theDate = month + '/' + day + '/' + year
    const theTime = hours + ':' + minutes
    const formatted = theDate + ' ' + theTime

    return formatted
  }

  render () {
    const { chapter, modalContainer, update } = this.props
    const { showModal } = this.state
    const username = chapter.lock.editor.username
    const isAdmin = this.isAdmin()

    let message = username + ' is editing'
    let hoverTitle, unlockModal
    let toggle = noop

    if (isAdmin) {
      toggle = this.toggleModal

      unlockModal = (
        <UnlockModal
          chapter={chapter}
          container={modalContainer}
          show={showModal}
          toggle={toggle}
          update={update}
        />
      )

      if (chapter.lock.timestamp) {
        const date = this.formatDate(chapter.lock.timestamp)
        hoverTitle = username + ' has been editing since ' + date
      }
    }

    const inlineStyle = {
      'cursor': isAdmin ? 'pointer' : 'default'
    }

    return (
      <a id='bb-unlock'
        className={styles.lEditing}
        onClick={toggle}
        style={inlineStyle}
        title={hoverTitle}
      >
        <i
          className={styles.lockIcon + ' fa fa-lock'}
          aria-hidden='true'
          alt='unlock'
        />

        <span className={styles.lockMessage}>
          { message }
        </span>

        { unlockModal }
      </a>
    )
  }
}

EditingNotification.propTypes = {
  chapter: React.PropTypes.object.isRequired,
  modalContainer: React.PropTypes.object.isRequired,
  roles: React.PropTypes.array.isRequired,
  update: React.PropTypes.func.isRequired
}

export default EditingNotification
