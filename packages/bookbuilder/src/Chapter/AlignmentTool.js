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

AlignmentBoxWithLabel.propTypes = {
  active: PropTypes.bool.isRequired,
  id: PropTypes.string.isRequired,
  labelPositionRight: PropTypes.bool,
  labelText: PropTypes.string.isRequired,
  labelOptions: PropTypes.shape({
    labelTextLeft: PropTypes.string,
    labelTextRight: PropTypes.string
  }),
  noBorder: PropTypes.shape({
    top: PropTypes.bool,
    bottom: PropTypes.bool,
    right: PropTypes.bool,
    left: PropTypes.bool
  }),
  onClick: PropTypes.func,
  update: PropTypes.func.isRequired
}

AlignmentBoxWithLabel.defaultProps = {
  active: false,
  labelPositionRight: false,
  labelOptions: {
    labelTextLeft: 'left',
    labelTextRight: 'rgiht'
  },
  noBorder: {
    top: false,
    bottom: false,
    right: false,
    left: false
  },
  onClick: () => null,
  update: () => null
}

export default AlignmentTool
