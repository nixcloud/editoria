import PropTypes from 'prop-types'
import React from 'react'
import classnames from 'classnames'
import { map, includes, uniqueId, forEach, indexOf } from 'lodash'
import classes from './StateList.local.scss'
import StateItem from './StateItem'

const StateList = ({ chapter, roles, modalContainer, update, stateValues }) => {
  const progressIds = Object.keys(stateValues)
  const lastItem = progressIds[progressIds.length - 1]

  const isAdmin = includes(roles, 'admin')
  const isProductionEditor = includes(roles, 'production-editor')
  const isAuthor = includes(roles, 'author')
  const isCopyEditor = includes(roles, 'copy-editor')

  const canAct = type => {
    const isActive = chapter.progress[type] === 1
    const isReview = type === 'edit'
    const isEdit = type === 'review'

    if (isAdmin || isProductionEditor) return true

    if (isActive && ((isEdit && isCopyEditor) || (isReview && isAuthor))) {
      return true
    }

    return false
  }

  const patchAction = (type, index) => {
    const patch = {
      id: chapter.id,
      progress: chapter.progress,
      rev: chapter.rev,
    }
    patch.progress[type] = index
    console.log('patch', patch)
    update(patch)
  }

  const findProgressItem = value => {
    let type
    let index
    forEach(stateValues, (values, key) => {
      let found = indexOf(values, value)
      if (found !== -1) {
        type = key
        index = found
      }
    })
    return {type: type, index:index}
  }

  const handleUpdate = value => {
    if (isAdmin || isProductionEditor) {
      const progressItem = findProgressItem(value)
      console.log('handle', progressItem)
      patchAction(progressItem.type, progressItem.index)
    }
    // toggleModal()
  }

  // const toggleModal = () => {}

  const progressItems = map(stateValues, (values, key) => {
    let delimiter
    const currentValueIndex = chapter.progress[key]

    if (key !== lastItem) {
      delimiter = (
        <i className={classnames('fa fa-angle-right', classes.delimiter)} />
      )
    }

    return (
      <div className={classes.itemContainer} key={uniqueId()}>
        <StateItem
          disabled={!canAct(key)}
          update={handleUpdate}
          index={currentValueIndex}
          values={values}
        />
        {delimiter}
      </div>
    )
  })

  return <div className={classes.stateListContainer}>{progressItems}</div>
}

StateList.propTypes = {
  chapter: PropTypes.object.isRequired,
  modalContainer: PropTypes.object,
  roles: PropTypes.array,
  stateValues: PropTypes.object.isRequired,
  update: PropTypes.func.isRequired,
}

export default StateList
