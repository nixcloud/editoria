import PropTypes from 'prop-types'
import React from 'react'
import classNames from 'classnames'
import classes from './StateItem.local.scss'

const StateItem = ({ disabled, update, values, index }) => {
  const handleStateItemInteraction = () => {
    if (disabled) return
    const nextIndex = arrayToggler(values, index)
    update(values[nextIndex])
  }

  const arrayToggler = (arrary, i) => (i === arrary.length - 1 ? 0 : i + 1)

  return (
    <span
      role="button"
      tabIndex="0"
      className={classNames(classes.root, {
        [classes.disabled]: disabled,
      })}
      onClick={handleStateItemInteraction}
      onKeyPress={handleStateItemInteraction}
      disabled={disabled}
    >
      {values[index]}
    </span>
  )
}

StateItem.propTypes = {
  disabled: PropTypes.bool,
  index: PropTypes.number.isRequired,
  update: PropTypes.func.isRequired,
  values: PropTypes.arrayOf(PropTypes.string).isRequired,
}

StateItem.defaultProps = {
  disabled: false,
}

export default StateItem
