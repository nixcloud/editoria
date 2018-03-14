import { keys, map } from 'lodash'
import React from 'react'
import PropTypes from 'prop-types'

import AlignmentTool from './AlignmentTool'
import StateList from './StateList'
import UploadButton from './UploadButton'

import styles from '../styles/bookBuilder.local.scss'

class ChapterSecondRow extends React.Component {
  constructor(props) {
    super(props)

    this.onClickAlignmentBox = this.onClickAlignmentBox.bind(this)
    this.updateStateList = this.updateStateList.bind(this)
  }

  updateStateList(name, index) {
    const { chapter, update } = this.props

    const patch = {
      id: chapter.id,
      progress: chapter.progress,
      rev: chapter.rev,
    }

    patch.progress[name] = index
    update(patch)
  }

  onClickAlignmentBox(id) {
    const { chapter, update } = this.props

    const patch = {
      alignment: chapter.alignment,
      id: chapter.id,
      rev: chapter.rev,
    }

    patch.alignment[id] = !chapter.alignment[id]
    update(patch)
  }

  render() {
    const {
      chapter,
      convertFile,
      isUploadInProgress,
      outerContainer,
      toggleUpload,
      update,
    } = this.props

    const stateValues = {
      clean: ['To Clean', 'Cleaning', 'Cleaned'],
      edit: ['To Edit', 'Editing', 'Edited'],
      review: ['To Review', 'Reviewing', 'Reviewed'],
      style: ['To Style', 'Styling', 'Styled'],
    }

    const alignmentOptions = []
    map(keys(chapter.alignment), key => {
      const option = {
        active: chapter.alignment[key],
        id: key,
        label: key,
      }
      alignmentOptions.push(option)
    })

    return (
      <div className={styles.secondLineContainer}>
        <UploadButton
          accept=".doc,.docx"
          chapter={chapter}
          convertFile={convertFile}
          isUploadInProgress={isUploadInProgress}
          modalContainer={outerContainer}
          title=" "
          toggleUpload={toggleUpload}
          type="file"
          update={update}
        />

        <StateList
          currentValues={chapter.progress}
          update={this.updateStateList}
          values={stateValues}
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
  convertFile: PropTypes.func.isRequired,
  outerContainer: PropTypes.any.isRequired,
  isUploadInProgress: PropTypes.bool,
  toggleUpload: PropTypes.func.isRequired,
  update: PropTypes.func.isRequired,
}

ChapterSecondRow.defaultProps = {
  isUploadInProgress: false,
}

export default ChapterSecondRow
