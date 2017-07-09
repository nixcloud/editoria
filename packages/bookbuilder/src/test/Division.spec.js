import React from 'react'
import { shallow } from 'enzyme'
import sinon from 'sinon'

import { Division } from '../Division'
import Chapter from '../Chapter'

const { data } = global.mock
const type = 'front'
const chapters = data.chapters.filter((chapter) => {
  return chapter.division === type
})

let props = {
  add: sinon.spy(),
  book: data.book,
  chapters: chapters,
  ink: sinon.spy(),
  outerContainer: {},
  remove: sinon.spy(),
  roles: [],
  title: 'Some Division',
  type: type,
  update: sinon.spy()
}

const getWrapper = () => {
  return shallow(<Division {...props} />)
}

test('should render correctly', () => {
  const wrapper = getWrapper()
  expect(wrapper).toMatchSnapshot()
})

test('should render the title', () => {
  const division = shallow(<Division {...props} />)
  const header = division.find('h1')
  const title = header.text().trim()
  expect(title).toEqual('Some Division')
})

// test('should have an add button', () => {
//   const division = shallow(<Division {...props} />)
//   const button = division.find('a')
//   expect(button).not.toBe(undefined)
//   const buttonText = button.text().trim()
//   expect(buttonText).toEqual('add component')
// })

//   test('should change the add button text depending on the division type', () => {
//     props.type = 'body'
//     const division = shallow(<Division {...props} />)
//     const button = division.find('a')
//     expect(button).not.toBe(undefined)
//     const buttonText = button.text().trim()
//     expect(buttonText).toEqual('add chapter')
//     props.type = 'front'
//   })

test('should render a list of chapters', () => {
  const division = shallow(<Division {...props} />)
  const chapters = division.find(Chapter).nodes
  expect(chapters.length).toEqual(2)
})

//   test('it should render a message if no chapters are found', () => {
//     props.chapters = []
//
//     const division = shallow(<Division {...props} />)
//     const container = division.find('#displayed')
//     const message = container.text().trim()
//
//     expect(message).toEqual('There are no components in this division.')
//
//     props.chapters = [
//       { title: 'A chapter', index: 0 },
//       { title: 'Another chapter', index: 1 }
//     ]
//   })

//   test('should call the add prop function when the add button is clicked', () => {
//     const sandbox = sinon.sandbox.create()
//     const spy = sandbox.spy(Division.prototype, '_onAddClick')
//     const division = shallow(<Division {...props} />)
//
//     expect(spy.callCount).toBe(0)
//     expect(props.add.callCount).toBe(0)
//
//     // has the _onAddClick function been called
//     const button = division.find('a')
//     button.simulate('click')
//     expect(spy.callCount).toBe(1)
//
//     // has the add property function been called
//     // (which will call the redux createFragment action)
//     expect(props.add.callCount).toBe(1)
//
//     sandbox.restore()
//   })

//   test('should call the remove and update props if a chapter is deleted', () => {
//     const division = shallow(<Division {...props} />)
//
//     expect(props.remove.callCount).toBe(0)
//     expect(props.update.callCount).toBe(0)
//
//     const instance = division.instance()
//     instance._onRemove(props.chapters[0])
//
//     // remove the first, which will trigger an update on the second's position
//     expect(props.remove.callCount).toBe(1)
//     expect(props.update.callCount).toBe(1)
//
//     props.remove.reset()
//     props.update.reset()
//
//     props.chapters = [
//       { title: 'A chapter', index: 0 },
//       { title: 'Another chapter', index: 1 }
//     ]
//   })

//   test('should call the update prop on reorder of chapters', () => {
//     const division = shallow(<Division {...props} />)
//     const instance = division.instance()
//
//     expect(props.update.callCount).toBe(0)
//     instance._onMove(1, 0)
//     expect(props.update.callCount).toBe(2)
//   })
