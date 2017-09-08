import classNames from 'classnames'
import PropTypes from 'prop-types'
import React from 'react'

import classes from './AlignmentBoxWithLabel.local.scss'

import AlignmentBox from './AlignmentBox'

const AlignmentBoxWithLabel = ({ active, id, noBorder,
  onClick, labelPositionRight, labelText }) => {
  const styles = classNames(
    classes.alignmentBoxWithLabel,
    {
      [classes.reverseOrder]: labelPositionRight
    }
  )

  return (
    <div className={styles}>
      <span className={classes.label}>
        {labelText}
      </span>
      <AlignmentBox
        active={active}
        noBorder={noBorder}
        id={id}
        onClick={onClick}
      />
    </div>
  )
}

AlignmentBoxWithLabel.propTypes = {
  active: PropTypes.bool.isRequired,
  id: PropTypes.string.isRequired,
  labelPositionRight: PropTypes.bool,
  noBorder: PropTypes.shape({
    top: PropTypes.bool,
    bottom: PropTypes.bool,
    right: PropTypes.bool,
    left: PropTypes.bool
  }),
  onClick: PropTypes.func,
  labelText: PropTypes.string.isRequired
}

AlignmentBoxWithLabel.defaultProps = {
  active: false,
  labelPositionRight: false,
  noBorder: {
    top: false,
    bottom: false,
    right: false,
    left: false
  },
  onClick: () => null,
  reverse: false
}

export default AlignmentBoxWithLabel
