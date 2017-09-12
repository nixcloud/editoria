import React from 'react'

import AlignmentTool from './AlignmentTool'
import ProgressList from './ProgressList'
import UploadButton from './UploadButton'

import styles from '../styles/bookBuilder.local.scss'

class ChapterSecondRow extends React.Component {
  constructor (props) {
    super(props)

    this.onClickAllign = this.onClickAllign.bind(this)
  }

  onClickAllign (data) {
    const { update } = this.props
    update(data)
  }

  render () {
    const { chapter, convertFile, outerContainer, roles, toggleUpload, update, isUploadInProgress } = this.props

    // TODO -- surrounding divs should go inside the components
    const labelOptions = { labelTextLeft: 'left', labelTextRight: 'right' }
    return (
      <div className={styles.secondLineContainer}>
          <UploadButton
            accept='.doc,.docx'
            chapter={chapter}
            convertFile={convertFile}
            isUploadInProgress={isUploadInProgress}
            modalContainer={outerContainer}
            title=' '
            toggleUpload={toggleUpload}
            type='file'
            update={update}
          />

        <ProgressList
          chapter={chapter}
          modalContainer={outerContainer}
          roles={roles}
          update={update}
        />

          <AlignmentTool
            chapter={chapter}
            update={update}
            labelOptions={labelOptions}
            onClickAllign={this.onClickAllign}
          />

        <div className={styles.separator} />
      </div>
    )
  }
}

ChapterSecondRow.propTypes = {
  chapter: React.PropTypes.object.isRequired,
  convertFile: React.PropTypes.func.isRequired,
  outerContainer: React.PropTypes.object.isRequired,
  isUploadInProgress: React.PropTypes.bool.isRequired,
  roles: React.PropTypes.array,
  toggleUpload: React.PropTypes.func.isRequired,
  update: React.PropTypes.func.isRequired
}

export default ChapterSecondRow
