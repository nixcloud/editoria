import React from 'react'
import { shallow } from 'enzyme'
import { every } from 'lodash'

import { BookBuilder } from '../BookBuilder'
import Division from '../Division'

const { data, redux } = global.mock
const actions = redux.actions
const { book, chapters, user } = data

let props = {
  actions: actions,
  book: book,
  chapters: chapters,
  user: user
}

const getWrapper = () => {
  return shallow(<BookBuilder {...props} />)
}

function getDivisions () {
  const bookBuilder = getWrapper()
  return bookBuilder.find(Division).nodes
}

test('should render correctly', () => {
  const component = getWrapper()
  expect(component).toMatchSnapshot()
})

test('should render 3 division components', () => {
  const divisions = getDivisions()
  expect(divisions.length).toEqual(3)
})

test('the first division should be called front matter', () => {
  const firstDivision = getDivisions()[0]
  const firstName = firstDivision.props.title

  expect(firstName).toEqual('Front Matter')
})

test('the first division should only contain front matter components', () => {
  const firstDivision = getDivisions()[0]

  const firstChapters = firstDivision.props.chapters
  expect(firstChapters.length).toEqual(2)

  const correctDivisions = every(firstChapters, { division: 'front' })
  expect(correctDivisions).toBe(true)
})

test('the second division should be called body', () => {
  const secondDivision = getDivisions()[1]
  const secondName = secondDivision.props.title

  expect(secondName).toEqual('Body')
})

test('the second division should only contain body chapters', () => {
  const secondDivision = getDivisions()[1]

  const secondChapters = secondDivision.props.chapters
  expect(secondChapters.length).toEqual(2)

  const correctDivisions = every(secondChapters, { division: 'body' })
  expect(correctDivisions).toBe(true)
})

test('the third division should be called back matter', () => {
  const thirdDivision = getDivisions()[2]
  const thirdName = thirdDivision.props.title

  expect(thirdName).toEqual('Back Matter')
})

test('the third division should only contain back matter components', () => {
  const thirdDivision = getDivisions()[2]

  const thirdChapters = thirdDivision.props.chapters
  expect(thirdChapters.length).toEqual(2)

  const correctDivisions = every(thirdChapters, { division: 'back' })
  expect(correctDivisions).toBe(true)
})
