import React from 'react'

import AlignmentTool from './AlignmentTool'
import ProgressList from './ProgressList'
import UploadButton from './UploadButton'

import styles from '../styles/bookBuilder.local.scss'

class ChapterSecondRow extends React.Component {
  render () {
    const { chapter, convertFile, outerContainer, roles, toggleUpload, update } = this.props

    // TODO -- surrounding divs should go inside the components

    return (
      <div className={styles.secondLineContainer}>

        <div className={styles.noPadding + ' col-lg-2 col-md-12 col-sm-12 col-xs-12'}>
          <UploadButton
            accept='.doc,.docx'
            chapter={chapter}
            convertFile={convertFile}
            modalContainer={outerContainer}
            title=' '
            toggleUpload={toggleUpload}
            type='file'
            update={update}
          />
        </div>

        <ProgressList
          chapter={chapter}
          modalContainer={outerContainer}
          roles={roles}
          update={update}
        />

        <div className={styles.noPadding + ' col-lg-3 col-md-12 col-sm-12 col-xs-12'}>
          <AlignmentTool
            chapter={chapter}
            update={update}
          />
        </div>

        <div className={styles.separator} />
      </div>
    )
  }
}

ChapterSecondRow.propTypes = {
  chapter: React.PropTypes.object.isRequired,
  convertFile: React.PropTypes.func.isRequired,
  outerContainer: React.PropTypes.object.isRequired,
  roles: React.PropTypes.array,
  toggleUpload: React.PropTypes.func.isRequired,
  update: React.PropTypes.func.isRequired
}

export default ChapterSecondRow
