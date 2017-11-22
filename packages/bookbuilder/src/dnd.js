import { findDOMNode } from 'react-dom'

const itemTypes = { CHAPTER: 'chapter' }

const chapterSource = {
  beginDrag(props) {
    const { chapter, id, no } = props

    return {
      division: chapter.division,
      id,
      no,
    }
  },

  isDragging(props, monitor) {
    return props.id === monitor.getItem().id
  },

  endDrag(props, monitor, component) {
    // console.log('end drag')
    // if (monitor.didDrop()) console.log('did drop')
    props.onEndDrag()
  },
}

const chapterTarget = {
  // for an explanation of how this works go to
  // https://github.com/gaearon/react-dnd/blob/master/examples/04%20Sortable/Simple/Card.js

  hover(props, monitor, component) {
    // console.log(monitor)
    // can only reorder within the same division
    const dragDivision = monitor.getItem().division
    const hoverDivision = props.chapter.division

    if (dragDivision !== hoverDivision) return

    const dragIndex = monitor.getItem().no
    const hoverIndex = props.no

    if (dragIndex === hoverIndex) return

    const hoverBoundingRect = findDOMNode(component).getBoundingClientRect()
    const hoverMiddleY = (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2
    const clientOffset = monitor.getClientOffset()
    const hoverClientY = clientOffset.y - hoverBoundingRect.top

    if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) return
    if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) return

    props.onMove(dragIndex, hoverIndex)
    monitor.getItem().no = hoverIndex
  }
}

const collectDrag = (connect, monitor) => {
  return {
    connectDragSource: connect.dragSource(),
    isDragging: monitor.isDragging()
  }
}

const collectDrop = (connect, monitor) => {
  return {
    connectDropTarget: connect.dropTarget()
  }
}

export { chapterSource, chapterTarget, collectDrag, collectDrop, itemTypes }
