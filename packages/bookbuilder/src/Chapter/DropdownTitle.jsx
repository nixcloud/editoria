import {
  get,
  map,
  slice
} from 'lodash'

import React from 'react'
import { DropdownButton, MenuItem } from 'react-bootstrap'
import { findDOMNode } from 'react-dom'

import TextInput from '../../utils/TextInput'
import { chapter as config } from '../../utils/config'

import styles from '../styles/bookBuilder.local.scss'

class DropdownTitle extends React.Component {
  constructor (props) {
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
      open: false
    }

    this.maxItemsInColumn = 5
    this.width = 180
  }

  breakIntoColumns (items) {
    const max = this.maxItemsInColumn
    const width = this.width

    const columns = []
    let loopIt = 1

    // TODO -- width is 180, why am I looping that?!
    while (loopIt <= width) {
      let start = (loopIt - 1) * max
      let end = start + max

      columns.push(slice(items, start, end))
      loopIt += 1
    }

    return map(columns, (column, i) => {
      return (
        <div
          className={styles.menuItemContainer}
          key={i}
        >
          { column }
        </div>
      )
    })
  }

  getColumnCount () {
    const dropdownOptions = this.getDropdownOptions()
    const len = dropdownOptions.length

    if (len > 9) return Math.ceil(len / 5)
    return 1
  }

  getDropdownOptions () {
    const { chapter } = this.props
    const division = chapter.division

    return config.dropdownValues[division]
  }

  getMenuItems () {
    const dropdownOptions = this.getDropdownOptions()
    const onClickOption = this.onClickOption

    const menuItems = map(dropdownOptions, function (item, i) {
      return (
        <MenuItem
          className={styles.menuItem}
          onClick={onClickOption}
          key={i}
        >
          { item }
        </MenuItem>
      )
    })

    return menuItems
  }

  onClickOption (event) {
    const value = event.target.innerHTML.trim()
    this.update(value)
    this.close()
  }

  setCustomTitle (e) {
    let value = get(this.refs, 'dropDownInput.state.value', null)
    this.update(value)
    // TODO -- why the timeout here?
    setTimeout(() => this.close(), 10)
  }

  toggle () {
    // Give it a delay, cause on double click, the dropdown opens briefly,
    // before being redirected to the editor.
    setTimeout(() =>
      this.setState({ open: !this.state.open })
    , 200)
  }

  close () {
    this.setState({ open: false })
  }

  update (title) {
    const { chapter, update } = this.props

    chapter.title = title
    update(chapter)
  }

  handleClickOutside (event) {
    const domNode = findDOMNode(this)
    const input = findDOMNode(this.refs.dropDownInput)

    if (input) input.focus()

    if (domNode.classList.contains('open')) {
      if (!domNode.contains(event.target)) {
        this.close()
      }
    }
  }

  componentDidMount () {
    window.addEventListener('click', this.handleClickOutside)
  }

  componentWillUnmount () {
    window.removeEventListener('click', this.handleClickOutside)
  }

  renderInput () {
    return (
      <div className={styles.dropDownInputContairer}>
        <TextInput
          ref='dropDownInput'
          className={'drop-input ' + styles.dropDownInput}
          onSave={this.setCustomTitle}
          placeholder='Type a custom title'
        />
      </div>
    )
  }

  render () {
    const { goToEditor, title } = this.props

    const columnCount = this.getColumnCount()
    const menuItems = this.getMenuItems()
    const input = this.renderInput()
    const width = this.width

    let columns = menuItems
    if (columnCount > 1) columns = this.breakIntoColumns(menuItems)

    const dropdownStyle = {
      width: width * columnCount
    }

    return (
      <DropdownButton
        className={styles.dropDown}
        id={'dropdown-title-menu'}
        open={this.state.open}
        onClick={this.toggle}
        onDoubleClick={goToEditor}
        title={title}
        ref={'dropdown-title'}
      >

        <div style={dropdownStyle}>
          { input }
          { columns }
        </div>

      </DropdownButton>
    )
  }
}

DropdownTitle.propTypes = {
  chapter: React.PropTypes.object.isRequired,
  goToEditor: React.PropTypes.func.isRequired,
  title: React.PropTypes.string.isRequired,
  update: React.PropTypes.func.isRequired
}

export default DropdownTitle
