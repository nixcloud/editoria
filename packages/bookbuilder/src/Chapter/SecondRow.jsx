import { keys, map } from 'lodash'
import React from 'react'

import AlignmentTool from './AlignmentTool'
import StateList from './StateList'
import UploadButton from './UploadButton'

import styles from '../styles/bookBuilder.local.scss'

class ChapterSecondRow extends React.Component {
  constructor (props) {
    super(props)

    this.onClickAlignmentBox = this.onClickAlignmentBox.bind(this)
  }

  onClickAlignmentBox (id) {
    const { chapter, update } = this.props

    const patch = {
      alignment: chapter.alignment,
      id: chapter.id,
      rev: chapter.rev,
    }

    patch.alignment[id] = !chapter.alignment[id]
    update(patch)
  }

  render () {
    const {
      chapter,
      convertFile,
      isUploadInProgress,
      outerContainer,
      roles,
      toggleUpload,
      update
    } = this.props
    
    const stateValues = {
      clean: ['To Clean', 'Cleaning', 'Cleaned'],
      edit: ['To Edit', 'Editing', 'Edited'],
      review: ['To Review', 'Reviewing', 'Reviewed'],
      style: ['To Style', 'Styling', 'Styled'],
    }

    const alignmentOptions = []
    map(keys(chapter.alignment), (key) => {
      const option = {
        active: chapter.alignment[key],
        id: key,
        label: key
      }
      alignmentOptions.push(option)
    })

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

        <StateList
          chapter={chapter}
          stateValues={stateValues}
          modalContainer={outerContainer}
          roles={roles}
          update={update}
        />
        <AlignmentTool
          data={alignmentOptions}
          onClickAlignmentBox={this.onClickAlignmentBox}
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
  isUploadInProgress: React.PropTypes.bool,
  roles: React.PropTypes.array,
  toggleUpload: React.PropTypes.func.isRequired,
  update: React.PropTypes.func.isRequired
}

export default ChapterSecondRow
