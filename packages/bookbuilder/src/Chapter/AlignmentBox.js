import { includes } from 'lodash'
import React from 'react'

import styles from './AlignmentBox.local.scss'

// class AlignmentBox extends React.Component {
//   constructor (props) {
//     super(props)
//     this.onClick = this.onClick.bind(this)
//   }
//
//   onClick () {
//     const { chapter, position, update } = this.props
//
//     if (!includes(['left', 'right'], position)) return
//
//     const patch = {
//       alignment: chapter.alignment,
//       id: chapter.id
//     }
//
//     patch.alignment[position] = !chapter.alignment[position]
//
//     update(patch)
//   }
//
//   render () {
//     const { chapter, position } = this.props
//     const selected = chapter.alignment[position]
//
//     // TODO -- fix classes here
//     const outerClass = styles.leftRightBox + ' ' + styles[position + 'Box']
//     const innerClass = selected ? styles.boxActive : styles.boxInactiveHover
//
//     return (
//       <li onClick={this.onClick}>
//         <div className={outerClass}>
//           <div className={innerClass} />
//         </div>
//       </li>
//     )
//   }
// }
// const innerClass = selected ? styles.boxActive : styles.boxInactiveHover
// const borderLess = { top: true, right: true, bottom: true, left: true }

const AlignmentBox = ({ active, id, udpate }) => (
  <div className={styles.alignmentBox + ' ' + styles.active}></div>
 )

AlignmentBox.defaultProps = {
  active: false,
  id: '',
  update: () => null
}

export default AlignmentBox
