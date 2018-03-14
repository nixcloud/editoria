import config from 'config'

import { get, map, slice } from 'lodash'

import React from 'react'
import PropTypes from 'prop-types'
import { DropdownButton, MenuItem } from 'react-bootstrap'
import { findDOMNode } from 'react-dom'

import TextInput from 'editoria-common/src/TextInput'

import styles from '../styles/bookBuilder.local.scss'

class DropdownTitle extends React.Component {
  constructor(props) {
    super(props)

    this.breakIntoColumns = this.breakIntoColumns.bind(this)
    this.close = this.close.bind(this)
    this.getColumnCount = this.getColumnCount.bind(this)
    this.getDropdownOptions = this.getDropdownOptions.bind(this)
    this.getMenuItems = this.getMenuItems.bind(this)
    this.handleClickOutside = this.handleClickOutside.bind(this)
    this.onClickOption = this.onClickOption.bind(this)
    this.setCustomTitle = this.setCustomTitle.bind(this)
    this.toggle = this.toggle.bind(this)
    this.update = this.update.bind(this)

    this.state = {
      open: false,
    }

    this.maxItemsInColumn = 5
    this.width = 180
  }

  breakIntoColumns(items) {
    const max = this.maxItemsInColumn
    const width = this.width

    const columns = []
    let loopIt = 1

    // TODO -- width is 180, why am I looping that?!
    while (loopIt <= width) {
      const start = (loopIt - 1) * max
      const end = start + max

      columns.push(slice(items, start, end))
      loopIt += 1
    }

    return map(columns, (column, i) => (
      <div className={styles.menuItemContainer} key={i}>
        {column}
      </div>
    ))
  }

  getColumnCount() {
    const dropdownOptions = this.getDropdownOptions()
    const len = dropdownOptions.length

    if (len > 9) return Math.ceil(len / 5)
    return 1
  }

  getDropdownOptions() {
    const { chapter } = this.props
    const division = chapter.division

    return config.bookBuilder.chapter.dropdownValues[division]
  }

  getMenuItems() {
    const dropdownOptions = this.getDropdownOptions()
    const onClickOption = this.onClickOption

    const menuItems = map(dropdownOptions, (item, i) => (
      <MenuItem className={styles.menuItem} key={i} onClick={onClickOption}>
        {item}
      </MenuItem>
    ))

    return menuItems
  }

  onClickOption(event) {
    const value = event.target.innerHTML.trim()
    this.update(value)
    this.close()
  }

  setCustomTitle(e) {
    const value = get(this.refs, 'dropDownInput.state.value', null)
    this.update(value)
    // TODO -- why the timeout here?
    setTimeout(() => this.close(), 10)
  }

  toggle() {
    // Give it a delay, cause on double click, the dropdown opens briefly,
    // before being redirected to the editor.
    setTimeout(() => this.setState({ open: !this.state.open }), 200)
  }

  close() {
    this.setState({ open: false })
  }

  update(title) {
    const { chapter, update } = this.props

    chapter.title = title
    update(chapter)
  }

  handleClickOutside(event) {
    const domNode = findDOMNode(this)
    const input = findDOMNode(this.refs.dropDownInput)

    if (input) input.focus()

    if (domNode.classList.contains('open')) {
      if (!domNode.contains(event.target)) {
        this.close()
      }
    }
  }

  componentDidMount() {
    window.addEventListener('click', this.handleClickOutside)
  }

  componentWillUnmount() {
    window.removeEventListener('click', this.handleClickOutside)
  }

  renderInput() {
    return (
      <div className={styles.dropDownInputContairer}>
        <TextInput
          className={`drop-input ${styles.dropDownInput}`}
          onSave={this.setCustomTitle}
          placeholder="Type a custom title"
          ref="dropDownInput"
        />
      </div>
    )
  }

  render() {
    const { goToEditor, title } = this.props

    const columnCount = this.getColumnCount()
    const menuItems = this.getMenuItems()
    const input = this.renderInput()
    const width = this.width

    let columns = menuItems
    if (columnCount > 1) columns = this.breakIntoColumns(menuItems)

    const dropdownStyle = {
      width: width * columnCount,
    }

    return (
      <DropdownButton
        className={styles.dropDown}
        id="dropdown-title-menu"
        onDoubleClick={goToEditor}
        onToggle={this.toggle}
        open={this.state.open}
        ref="dropdown-title"
        title={title || 'Choose Component'}
      >
        <div style={dropdownStyle}>
          {input}
          {columns}
        </div>
      </DropdownButton>
    )
  }
}

DropdownTitle.propTypes = {
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
  goToEditor: PropTypes.func.isRequired,
  title: PropTypes.string.isRequired,
  update: PropTypes.func.isRequired,
}

export default DropdownTitle
