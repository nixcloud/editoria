import { includes } from 'lodash'
import React from 'react'

// TODO -- maybe remove dependency when a better implementation of the
// warning is ready
import { Alert } from 'react-bootstrap'

import ProgressModal from './ProgressModal'
import styles from '../styles/bookBuilder.local.scss'

export class ProgressItem extends React.Component {
  constructor (props) {
    super(props)

    this.canChange = this.canChange.bind(this)
    this.changeProgressState = this.changeProgressState.bind(this)
    this.onClick = this.onClick.bind(this)
    this.renderErrorMessage = this.renderErrorMessage.bind(this)
    this.renderIcon = this.renderIcon.bind(this)
    this.renderModal = this.renderModal.bind(this)
    this.toggleModal = this.toggleModal.bind(this)

    // TODO -- move to config
    this.progressValues = {
      style: ['To Style', 'Styling', 'Styled'],
      edit: ['To Edit', 'Editing', 'Edited'],
      review: ['To Review', 'Reviewing', 'Reviewed'],
      clean: ['To Clean', 'Cleaning', 'Cleaned']
    }

    this.state = {
      showModal: false,
      showError: false
    }
  }

  toggleModal () {
    this.setState({
      showModal: !this.state.showModal
    })
  }

  changeProgressState () {
    const { chapter, update, type } = this.props
    const { progressValues } = this

    const list = progressValues[type]
    const len = list.length

    let position = chapter.progress[type]
    position += 1                      // move up a level
    if (position >= len) position = 0  // or cycle back to the beginning

    const patch = {
      id: chapter.id,
      rev: chapter.rev,
      progress: chapter.progress
    }

    patch.progress[type] = position
    update(patch)

    this.setState({ showModal: false })
  }

  canChange () {
    const { type, roles, chapter } = this.props

    if (includes(roles, 'admin') || includes(roles, 'production-editor')) return true

    const isActive = (chapter.progress[type] === 1)

    if (isActive) {
      if (type === 'edit') {
        if (includes(roles, 'copy-editor')) return true
      }
      if (type === 'review') {
        if (includes(roles, 'author')) return true
      }
    }

    return false
  }

  onClick () {
    const { roles } = this.props

    if (!this.canChange()) {
      this.setState({ showError: true })

      return setTimeout(() => {
        this.setState({ showError: false })
      }, 3000)
    }

    // TODO -- refactor
    if (
      includes(roles, 'production-editor') ||
      includes(roles, 'admin')
    ) {
      return this.changeProgressState()
    }

    this.toggleModal()
  }

  renderModal () {
    const { chapter, modalContainer, type } = this.props
    const { showModal } = this.state

    const typesWithModal = ['edit', 'review']
    if (!includes(typesWithModal, type)) return null

    return (
      <ProgressModal
        changeProgressState={this.changeProgressState}
        chapter={chapter}
        container={modalContainer}
        show={showModal}
        toggle={this.toggleModal}
      />
    )
  }

  renderIcon () {
    const { hasIcon } = this.props
    if (!hasIcon) return null

    return (<i className='fa fa-angle-right' />)
  }

  renderErrorMessage () {
    const { showError } = this.state
    if (!showError) return null

    return (
      <Alert
        bsStyle='warning'
        className={styles.noWritesError}
      >
        You don't have access to perfom this action.
        Please contact your Production Editor.
      </Alert>
    )
  }

  render () {
    const { type, chapter } = this.props
    const { progressValues } = this

    const currentStateValue = chapter.progress[type]
    const currentStateText = progressValues[type][currentStateValue]

    const errorMessage = this.renderErrorMessage()
    const icon = this.renderIcon()
    const warningModal = this.renderModal()

    // TODO -- find a nicer way to display the error message

    return (
      <span>
        { errorMessage }

        <li
          className={'progress' + currentStateValue}
          onClick={this.onClick}
        >

          { currentStateText } &nbsp;
          { icon }
          { warningModal }

        </li>
      </span>
    )
  }
}

ProgressItem.propTypes = {
  chapter: React.PropTypes.object.isRequired,
  hasIcon: React.PropTypes.bool,
  modalContainer: React.PropTypes.object,
  roles: React.PropTypes.array.isRequired,
  type: React.PropTypes.string.isRequired,
  update: React.PropTypes.func.isRequired
}

export default ProgressItem
