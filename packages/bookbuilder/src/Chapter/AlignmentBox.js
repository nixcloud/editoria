import { includes } from 'lodash'
import React from 'react'

import classNames from 'classnames'
import styles from './AlignmentBox.local.scss'

const AlignmentBox = ({ chapter, position, update }) => {
  const borderLess = { top: false, right: true, bottom: false, left: false }

  const boxStyles = classNames(
    styles.alignmentBox,
    {
      [styles.borderTop]: borderLess.top,
      [styles.borderRight]: borderLess.right,
      [styles.borderBottom]: borderLess.bottom,
      [styles.borderLeft]: borderLess.left
    })

  return (
    <div
      role='presentation'
      className={boxStyles}
    />
  )
}

AlignmentBox.defaultProps = {
  active: false,
  id: '',
  update: () => null
}

export default AlignmentBox
