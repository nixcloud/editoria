import React from 'react'

import Modal from 'editoria-common/src/Modal'

class UnlockModal extends React.Component {
  constructor (props) {
    super(props)
    this.onUnlock = this.onUnlock.bind(this)
  }

  onUnlock () {
    const { chapter, toggle, update } = this.props

    chapter.lock = null
    update(chapter)
    toggle()
  }

  render () {
    const { chapter, container, show, toggle } = this.props
    const type = chapter.type

    return (
      <Modal
        title={'Unlock ' + type}
        chapter={chapter}
        action='unlock'
        successText='Unlock'
        type={type}
        successAction={this.onUnlock}
        show={show}
        toggle={toggle}
        container={container}
      />
    )
  }
}

UnlockModal.propTypes = {
  chapter: React.PropTypes.object.isRequired,
  container: React.PropTypes.object.isRequired,
  show: React.PropTypes.bool.isRequired,
  toggle: React.PropTypes.func.isRequired,
  update: React.PropTypes.func.isRequired
}

export default UnlockModal
