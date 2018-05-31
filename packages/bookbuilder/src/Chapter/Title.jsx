import React from 'react'
import PropTypes from 'prop-types'

import TextInput from 'editoria-common/src/TextInput'
import styles from '../styles/bookBuilder.local.scss'

class Title extends React.Component {
  // save() {
  //   this.refs.chapterInput._save()
  // }

  render() {
    const {
      isRenaming,
      goToEditor,
      onSaveRename,
      title,
      showNumber,
      number,
      isLocked,
    } = this.props

    const content = showNumber
      ? `${number ? `${number}. ` : ''} ${title || 'Untitled'}`
      : `${title || 'Untitled'}`

    const input = (
      <TextInput
        className="edit"
        onSave={onSaveRename}
        // ref="chapterInput"
        value={title}
      />
    )

    let plainTitle = (
      // <div className={styles.bodyTitle}>
      <div>
        <h3 className={styles.cursorPointer} onDoubleClick={goToEditor}>
          {content}
        </h3>
      </div>
    )
    if (isLocked) {
      plainTitle = (
        <div className={styles.bodyTitle}>
          <h3>{content}</h3>
        </div>
      )
    }

    if (isRenaming) return input
    return plainTitle
  }
}

Title.propTypes = {
  goToEditor: PropTypes.func.isRequired,
  isRenaming: PropTypes.bool.isRequired,
  number: PropTypes.number,
  onSaveRename: PropTypes.func.isRequired,
  showNumber: PropTypes.bool,
  title: PropTypes.string,
}

Title.defaultProps = {
  number: null,
  showNumber: false,
  title: null,
}

export default Title
