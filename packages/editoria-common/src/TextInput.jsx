/*
  Courtesy of Jure and Blahah
  @
  https://gitlab.coko.foundation/pubsweet/pubsweet-components/blob/master/PostsManager/TextInput.js
*/

import React from 'react'

const ENTER_KEY_CODE = 13

export default class TextInput extends React.Component {
  constructor (props) {
    super(props)

    this._onChange = this._onChange.bind(this)
    this._onKeyDown = this._onKeyDown.bind(this)
    this._save = this._save.bind(this)

    this.state = {
      value: this.props.value || ''
    }
  }

  render () {
    const { className, id, placeholder } = this.props
    const { value } = this.state

    return (
      <input
        className={className}
        id={id}
        placeholder={placeholder}
        onChange={this._onChange}
        onKeyDown={this._onKeyDown}
        value={value}
        autoFocus
      />
    )
  }

  _save () {
    this.props.onSave(this.state.value)
    this.setState({
      value: ''
    })
  }

  _onChange (event) {
    this.setState({
      value: event.target.value
    })
  }

  _onKeyDown (event) {
    if (event.keyCode === ENTER_KEY_CODE) {
      this._save()
    }
  }
}

TextInput.propTypes = {
  className: React.PropTypes.string,
  id: React.PropTypes.string,
  placeholder: React.PropTypes.string,
  onSave: React.PropTypes.func.isRequired,
  value: React.PropTypes.string
}
