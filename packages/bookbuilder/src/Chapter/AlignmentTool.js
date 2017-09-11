import React from 'react'
import PropTypes from 'prop-types'

import AlignmentBoxWithLabel from './AlignmentBoxWithLabel'
import classes from './AlignmentTool.local.scss'

const AlignmentTool = ({ chapter, labelOptions, update }) => {
  const onClick = () => {
    console.log('position clicked')
  }

  const noBorderRight = { right: true }
  const noBorderLeft = { left: true }

  return (
    <div className={classes.alignmentTool}>
      <AlignmentBoxWithLabel
        active={false}
        id={'left'}
        labelText={labelOptions.labelTextLeft}
        noBorder={noBorderRight}
        onClick={onClick}
      />
      <div className={classes.middleLine} />
      <AlignmentBoxWithLabel
        active
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
  chapter: PropTypes.obj.isRequired,
  labelOptions: PropTypes.shape({
    labelTextLeft: PropTypes.string,
    labelTextRight: PropTypes.string
  }),
  update: PropTypes.func.isRequired
}

AlignmentTool.defaultProps = {
  labelPositionRight: false,
  labelOptions: {
    labelTextLeft: 'left',
    labelTextRight: 'rgiht'
  },
  update: () => null
}

export default AlignmentTool
