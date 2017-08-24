import React from 'react'

import styles from './styles/bookBuilder.local.scss'

export default class AddButton extends React.Component {
  constructor (props) {
    super(props)
    this._addGroup = this._addGroup.bind(this)
  }

  _addGroup () {
    const { add, group } = this.props
    add(group)
  }

  render () {
    const { group } = this.props
    const margin = (group === 'part') ? 20 : 0

    return (
      <div className={styles.sectionBtn}
        style={{ 'marginRight': margin }}
        onClick={this._addGroup}>
        <div className={styles.addBtnIcon}> </div>
          <a>
            { 'add ' + group }
          </a>
      </div>
    )
  }
}

AddButton.propTypes = {
  add: React.PropTypes.func.isRequired,
  group: React.PropTypes.string.isRequired
}
