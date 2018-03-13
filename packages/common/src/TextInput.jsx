/*
  Courtesy of Jure and Blahah
  @
  https://gitlab.coko.foundation/pubsweet/pubsweet-components/blob/master/PostsManager/TextInput.js
*/

import React from 'react'
import PropTypes from 'prop-types'

const ENTER_KEY_CODE = 13

export default class TextInput extends React.Component {
  constructor(props) {
    super(props)

    this._onChange = this._onChange.bind(this)
    this._onKeyDown = this._onKeyDown.bind(this)
    this._save = this._save.bind(this)

    this.state = {
      value: this.props.value || '',
    }
  }

  render() {
    const { className, id, placeholder } = this.props
    const { value } = this.state

    return (
      <input
        autoFocus
        className={className}
        id={id}
        onChange={this._onChange}
        onKeyDown={this._onKeyDown}
        placeholder={placeholder}
        value={value}
      />
    )
  }

  _save() {
    this.props.onSave(this.state.value)
    this.setState({
      value: '',
    })
  }

  _onChange(event) {
    this.setState({
      value: event.target.value,
    })
  }

  _onKeyDown(event) {
    if (event.keyCode === ENTER_KEY_CODE) {
      this._save()
    }
  }
}

TextInput.propTypes = {
  className: PropTypes.oneOfType([
    PropTypes.node,
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.string,
    PropTypes.arrayOf(PropTypes.string),
  ]),
  id: PropTypes.string,
  placeholder: PropTypes.string,
  onSave: PropTypes.func.isRequired,
  value: PropTypes.string,
}

TextInput.defaultProps = {
  className: null,
  id: null,
  placeholder: null,
  value: null,
}
