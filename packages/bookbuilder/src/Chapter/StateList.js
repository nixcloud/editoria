import PropTypes from 'prop-types'
import React from 'react'
import classnames from 'classnames'
import Authorize from 'pubsweet-client/src/helpers/Authorize'
import { map, uniqueId, keys, last } from 'lodash'

import classes from './StateList.local.scss'
import StateItem from './StateItem'

const stateList = ({ bookId, currentValues, update, values }) => {
  const progressIds = keys(values)
  const lastItem = last(progressIds)

  // TODO: Placeholder -- to be implemented with authsome
  // const canAct = key => true

  const handleUpdate = (name, index) => {
    update(name, index)
  }
  const renderStateItem = (
    disabled,
    currentValueIndex,
    name,
    handleUpdate,
    valueList,
  ) => (
    <StateItem
      disabled={disabled}
      index={currentValueIndex}
      name={name}
      update={handleUpdate}
      values={valueList}
    />
  )
  const items = map(values, (valueList, name) => {
    let delimiter
    const currentValueIndex = currentValues[name]

    if (name !== lastItem) {
      delimiter = (
        <i className={classnames('fa fa-angle-right', classes.delimiter)} />
      )
    }

    return (
      <div className={classes.itemContainer} key={uniqueId()}>
        <Authorize
          object={{ bookId, name, currentValueIndex }}
          operation="can change progressList"
          unauthorized={renderStateItem(
            true,
            currentValueIndex,
            name,
            handleUpdate,
            valueList,
          )}
        >
          {renderStateItem(
            false,
            currentValueIndex,
            name,
            handleUpdate,
            valueList,
          )}
        </Authorize>
        {delimiter}
      </div>
    )
  })

  return <div className={classes.stateListContainer}>{items}</div>
}

stateList.propTypes = {
  bookId: PropTypes.string.isRequired,
  currentValues: PropTypes.objectOf(PropTypes.number).isRequired,
  update: PropTypes.func.isRequired,
  values: PropTypes.objectOf(PropTypes.arrayOf(PropTypes.string)).isRequired,
}

export default stateList
