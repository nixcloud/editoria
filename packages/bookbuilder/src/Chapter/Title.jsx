import React from 'react'

import TextInput from 'editoria-common/src/TextInput'
import styles from '../styles/bookBuilder.local.scss'

class Title extends React.Component {
  save () {
    this.refs.chapterInput._save()
  }

  render () {
    const { isRenaming, goToEditor, onSaveRename, title } = this.props

    const input = (
      <TextInput
        className='edit'
        ref='chapterInput'
        onSave={onSaveRename}
        value={title}
      />
    )

    const plainTitle = (
      <div className={styles.bodyTitle}>
        <h3 onDoubleClick={goToEditor}>
          { title ? title : 'Untitled'}
        </h3>
      </div>
    )

    if (isRenaming) return input
    return plainTitle
  }
}

Title.propTypes = {
  goToEditor: React.PropTypes.func.isRequired,
  isRenaming: React.PropTypes.bool.isRequired,
  onSaveRename: React.PropTypes.func.isRequired,
  title: React.PropTypes.string.isRequired
}

export default Title
