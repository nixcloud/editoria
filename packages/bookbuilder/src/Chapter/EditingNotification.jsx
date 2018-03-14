import { includes } from 'lodash'
import React from 'react'
import PropTypes from 'prop-types'

import styles from '../styles/bookBuilder.local.scss'
import UnlockModal from './UnlockModal'

class EditingNotification extends React.Component {
  constructor(props) {
    super(props)

    this.formatDate = this.formatDate.bind(this)
    this.isAdmin = this.isAdmin.bind(this)
    this.toggleModal = this.toggleModal.bind(this)

    this.state = {
      showModal: false,
    }
  }

  toggleModal() {
    this.setState({
      showModal: !this.state.showModal,
    })
  }

  isAdmin() {
    const { roles } = this.props
    return includes(roles, 'admin')
  }

  formatDate(timestamp) {
    const date = new Date(timestamp)

    const day = date.getDate()
    const month = date.getMonth() + 1
    const year = date.getFullYear()

    let hours = date.getHours().toString()
    if (hours.length === 1) {
      hours = `0${hours}`
    }

    let minutes = date.getMinutes().toString()
    if (minutes.length === 1) {
      minutes = `0${minutes}`
    }

    const theDate = `${month}/${day}/${year}`
    const theTime = `${hours}:${minutes}`
    const formatted = `${theDate} ${theTime}`

    return formatted
  }

  render() {
    const { chapter, modalContainer, update } = this.props
    const { showModal } = this.state
    const username = chapter.lock.editor.username
    const isAdmin = this.isAdmin()

    const message = `${username} is editing`
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
        hoverTitle = `${username} has been editing since ${date}`
      }
    }

    const inlineStyle = {
      cursor: isAdmin ? 'pointer' : 'default',
    }

    return (
      <a
        className={styles.lEditing}
        id="bb-unlock"
        onClick={toggle}
        style={inlineStyle}
        title={hoverTitle}
      >
        <i
          alt="unlock"
          aria-hidden="true"
          className={`${styles.lockIcon} fa fa-lock`}
        />

        <span className={styles.lockMessage}>{message}</span>

        {unlockModal}
      </a>
    )
  }
}

EditingNotification.propTypes = {
  chapter: PropTypes.shape({
    alignment: PropTypes.objectOf(PropTypes.bool),
    author: PropTypes.string,
    book: PropTypes.string,
    division: PropTypes.string,
    id: PropTypes.string,
    index: PropTypes.number,
    kind: PropTypes.string,
    lock: PropTypes.shape({
      editor: PropTypes.shape({
        username: PropTypes.string,
      }),
      timestamp: PropTypes.string,
    }),
    number: PropTypes.number,
    owners: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.string,
        username: PropTypes.string,
      }),
    ),
    progress: PropTypes.objectOf(PropTypes.number),
    rev: PropTypes.string,
    source: PropTypes.string,
    status: PropTypes.string,
    subCategory: PropTypes.string,
    title: PropTypes.string,
    trackChanges: PropTypes.bool,
    type: PropTypes.string,
  }).isRequired,
  modalContainer: PropTypes.any.isRequired,
  roles: PropTypes.arrayOf(PropTypes.string).isRequired,
  update: PropTypes.func.isRequired,
}

const noop = () => {}

export default EditingNotification
