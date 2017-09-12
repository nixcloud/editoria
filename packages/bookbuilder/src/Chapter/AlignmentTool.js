import React from 'react'
import PropTypes from 'prop-types'

import AlignmentBoxWithLabel from './AlignmentBoxWithLabel'
import classes from './AlignmentTool.local.scss'

const AlignmentTool = ({ chapter, labelOptions, onClickAllign }) => {
  const onClick = (e) => {
    const boxId = e.currentTarget.id

    const patch = {
      alignment: chapter.alignment,
      id: chapter.id
    }

    patch.alignment[boxId] = !chapter.alignment[boxId]
    onClickAllign(patch)
  }

  const noBorderRight = { right: true }
  const noBorderLeft = { left: true }

  const leftActive = (chapter.alignment.left)
  const rightActive = (chapter.alignment.right)

  return (
    <div className={classes.alignmentTool}>
      <AlignmentBoxWithLabel
        active={leftActive}
        id={'left'}
        labelText={labelOptions.labelTextLeft}
        noBorder={noBorderRight}
        onClick={onClick}
      />

      <div className={classes.middleLine} />

      <AlignmentBoxWithLabel
        active={rightActive}
        id={'right'}
        labelText={labelOptions.labelTextRight}
        labelPositionRight
        noBorder={noBorderLeft}
        onClick={onClick}
      />
    </div>
  )
}

AlignmentTool.propTypes = {
  chapter: PropTypes.object,
  labelOptions: PropTypes.shape({
    labelTextLeft: PropTypes.string,
    labelTextRight: PropTypes.string
  }),
  onClickAllign: PropTypes.func.isRequired
}

AlignmentTool.defaultProps = {
  labelPositionRight: false,
  labelOptions: {
    labelTextLeft: 'left',
    labelTextRight: 'rgiht'
  },
  onClickAllign: () => null
}

export default AlignmentTool
