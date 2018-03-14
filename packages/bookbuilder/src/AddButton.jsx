import React from 'react'
import PropTypes from 'prop-types'

import styles from './styles/bookBuilder.local.scss'

export default class AddButton extends React.Component {
  constructor(props) {
    super(props)
    this._addGroup = this._addGroup.bind(this)
  }

  _addGroup() {
    const { add, group } = this.props
    add(group)
  }

  render() {
    const { group } = this.props
    const margin = group === 'part' ? 20 : 0

    return (
      <div
        className={styles.sectionBtn}
        onClick={this._addGroup}
        style={{ marginRight: margin }}
      >
        <div className={styles.addBtnIcon} />
        <a>{`add ${group}`}</a>
      </div>
    )
  }
}

AddButton.propTypes = {
  add: PropTypes.func.isRequired,
  group: PropTypes.string.isRequired,
}
