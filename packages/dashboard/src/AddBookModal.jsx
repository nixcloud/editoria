import React from 'react'
import PropTypes from 'prop-types'

import AbstractModal from 'editoria-common/src/AbstractModal'
import styles from './dashboard.local.scss'

class AddBookModal extends React.Component {
  constructor(props) {
    super(props)

    this.handleKeyOnInput = this.handleKeyOnInput.bind(this)
    this.onInputChange = this.onInputChange.bind(this)
    this.onCreate = this.onCreate.bind(this)

    this.state = { error: false }
  }

  // focusTextInput() {
  //   if (this.textInput) this.textInput.focus()
  // }

  // componentDidMount() {
  //   const { show } = this.props
  //   console.log('did update', this.textInput)
  //   if (show) this.focusTextInput()
  // }

  // TODO -- figure out how to make input ref auto focus work when we move away from bootstrap modals

  handleKeyOnInput(event) {
    if (event.charCode !== 13) return
    this.onCreate()
  }

  onCreate() {
    const { create, toggle } = this.props

    const input = this.textInput
    const newTitle = input.value.trim()

    if (newTitle.length === 0) {
      return this.setState({
        error: true,
      })
    }

    create(newTitle)
    toggle()
  }

  onInputChange() {
    const { error } = this.state
    if (!error) return
    this.setState({ error: false })
  }

  renderBody() {
    const error = this.renderError()
    const message = (
      <div style={{ paddingBottom: 4 }}>
        Enter the title of the new book <br />
      </div>
    )

    return (
      <div>
        {message}
        {error}

        <input
          autoFocus
          className={styles['add-book-input']}
          name="title"
          onChange={this.onInputChange}
          onKeyPress={this.handleKeyOnInput}
          placeholder="eg. My new title"
          ref={(input) => {
            this.textInput = input
          }}
          type="text"
        />
      </div>
    )
  }

  renderError() {
    const { error } = this.state

    const el = <div className="error">New book title cannot be empty</div>

    const res = error ? el : null
    return res
  }

  render() {
    const { container, show, toggle } = this.props
    const body = this.renderBody()

    return (
      <AbstractModal
        body={body}
        container={container}
        show={show}
        successAction={this.onCreate}
        successText="Add"
        title="Add a new book"
        toggle={toggle}
      />
    )
  }
}

AddBookModal.propTypes = {
  create: PropTypes.func.isRequired,
  container: PropTypes.any.isRequired,
  show: PropTypes.bool.isRequired,
  toggle: PropTypes.func.isRequired,
}

export default AddBookModal
