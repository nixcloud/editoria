import React from 'react'

import TextInput from 'editoria-common/src/TextInput'
import styles from '../styles/bookBuilder.local.scss'

class Title extends React.Component {
  save() {
    this.refs.chapterInput._save()
  }

  render() {
    const {
      isRenaming,
      goToEditor,
      onSaveRename,
      title,
      showNumber,
      number,
    } = this.props

    const content = showNumber
      ? `${number ? `${number}. ` : ''} ${title || 'Untitled'}`
      : `${title || 'Untitled'}`

    const input = (
      <TextInput
        className="edit"
        ref="chapterInput"
        onSave={onSaveRename}
        value={title}
      />
    )

    const plainTitle = (
      <div className={styles.bodyTitle}>
        <h3 onDoubleClick={goToEditor}>{content}</h3>
      </div>
    )

    if (isRenaming) return input
    return plainTitle
  }
}

Title.propTypes = {
  goToEditor: React.PropTypes.func.isRequired,
  isRenaming: React.PropTypes.bool.isRequired,
  number: React.PropTypes.number,
  onSaveRename: React.PropTypes.func.isRequired,
  showNumber: React.PropTypes.bool,
  title: React.PropTypes.string.isRequired,
}

Title.defaultProps = {
  number: null,
  showNumber: false,
}

export default Title
