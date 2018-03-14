import React from 'react'
import PropTypes from 'prop-types'

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
  container: PropTypes.any.isRequired,
  show: PropTypes.bool.isRequired,
  toggle: PropTypes.func.isRequired,
  update: PropTypes.func.isRequired,
}

export default UnlockModal
