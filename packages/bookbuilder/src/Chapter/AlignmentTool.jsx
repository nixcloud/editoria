import React from 'react'

import AlignmentBox from './AlignmentBox'
import styles from '../styles/bookBuilder.local.scss'

export class AlignmentTool extends React.Component {
  render () {
    const { chapter, update } = this.props

    // TODO -- what is boxDiver? divider?

    return (
      <ul className={styles.pagePosition}>
        <li>left &nbsp;</li>

        <AlignmentBox
          chapter={chapter}
          position='left'
          update={update}
        />

        <AlignmentBox
          chapter={chapter}
          position='right'
          update={update}
        />

        <li>
          <div className={styles.boxDiver} />
        </li>

        <li>&nbsp; right</li>
      </ul>
    )
  }
}

AlignmentTool.propTypes = {
  chapter: React.PropTypes.object.isRequired,
  update: React.PropTypes.func.isRequired
}

export default AlignmentTool
