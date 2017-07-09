import React from 'react'
import {
  // mount,
  shallow
} from 'enzyme'
import { shallowToJson } from 'enzyme-to-json'
import sinon from 'sinon'

// import { DropdownButton } from 'react-bootstrap'
// import { DragDropContext } from 'react-dnd'
// import TestBackend from 'react-dnd-test-backend'
// import { LinkContainer } from 'react-router-bootstrap'
// import TestUtils from 'react-addons-test-utils'
// import sinon from 'sinon'

// // grab the undecorated by dnd react component
import Chapter from '../Chapter'
const OriginalChapter = Chapter.DecoratedComponent

// import ProgressIndicator from '../ProgressIndicator'
// import TextInput from '../../../components/TextInput'

// const identity = function (el) { return el }
const identity = el => el
const { data } = global.mock
const type = 'front'
const chapters = data.chapters.filter((chapter) => {
  return chapter.division === type
})
const firstChapter = chapters[0]

let props = {
  book: data.book,
  chapter: firstChapter,
  id: firstChapter.id,
  ink: sinon.spy(),
  key: firstChapter.index,
  move: sinon.spy(),
  no: 0,
  outerContainer: {},
  remove: sinon.spy(),
  roles: [],
  title: firstChapter.title,
  type: firstChapter.subCategory,
  update: sinon.spy(),
  connectDragSource: identity,
  connectDropTarget: identity,
  isDragging: false
}

// function wrapInTestContext (Chapter) {
//   return DragDropContext(TestBackend)(
//     class TestContextContainer extends React.Component {
//       render () {
//         return <Chapter {...this.props} />
//       }
//     }
//   )
// }

const getWrapper = () => {
  return shallow(<OriginalChapter {...props} />)
}

test('should render correctly', () => {
  const wrapper = getWrapper()
  const tree = shallowToJson(wrapper)
  expect(tree).toMatchSnapshot()
})

// describe('Chapter', () => {
//   it('should render the chapter type title', () => {
//     const chapter = shallow(<OriginalChapter {...props} />)
//     const title = chapter.find('h3')
//     const text = title.text().trim()
//     expect(text).to.equal('This title')
//   })
//
//   it('should render the component type title', () => {
//     props.type = 'component'
//     const chapter = shallow(<OriginalChapter {...props} />)
//
//     const dropDown = chapter.find(DropdownButton).nodes[0]
//     const title = dropDown.props.title
//     expect(title).to.equal('This title')
//
//     props.type = 'chapter'
//   })
//
//   it('should render the action buttons for chapters', () => {
//     const chapter = shallow(<OriginalChapter {...props} />)
//     const buttons = chapter.find('a').nodes
//     expect(buttons.length).to.equal(3)
//
//     const rename = buttons[0].props.children[0]
//     expect(rename).to.equal('Rename')
//
//     const edit = buttons[1].props.children.trim()
//     expect(edit).to.equal('Edit')
//
//     const deleteButton = buttons[2].props.children.trim()
//     expect(deleteButton).to.equal('Delete')
//   })
//
//   it('should render the upload word button', () => {
//     const chapter = shallow(<OriginalChapter {...props} />)
//     const upload = chapter.find('#bb-upload')
//     expect(upload.text().trim()).to.equal('Upload Word')
//   })
//
//   it('should render the different progress states of the chapter', () => {
//     const chapter = shallow(<OriginalChapter {...props} />)
//     const indicators = chapter.find(ProgressIndicator)
//     expect(indicators.length).to.equal(4)
//   })
//
//   // it('should render the alignment boxes', () => {})
//
//   it('should open an input area if rename is clicked', () => {
//     const chapter = shallow(<OriginalChapter {...props} />)
//
//     let input = chapter.find(TextInput)
//     expect(input.length).to.equal(0)
//
//     const renameButton = chapter.find('#bb-rename')
//     renameButton.simulate('click')
//
//     input = chapter.find(TextInput)
//     expect(input.length).to.equal(1)
//   })
//
//   it('should open an input area if the chapter title is double clicked', () => {
//     const chapter = shallow(<OriginalChapter {...props} />)
//
//     let input = chapter.find(TextInput)
//     expect(input.length).to.equal(0)
//
//     const title = chapter.find('h3')
//     title.simulate('dblclick')
//
//     input = chapter.find(TextInput)
//     expect(input.length).to.equal(1)
//   })
//
//   it('should show a save button if the chapter title is being edited', () => {
//     const chapter = shallow(<OriginalChapter {...props} />)
//
//     const title = chapter.find('h3')
//     title.simulate('dblclick')
//
//     const renameButton = chapter.find('#bb-rename')
//     expect(renameButton.text().trim()).to.equal('Save')
//   })
//
//   it('should close the input area on click of save', () => {
//     const chapter = mount(<OriginalChapter {...props} />)
//
//     let input = chapter.find(TextInput)
//     expect(input.length).to.equal(0)
//
//     const title = chapter.find('h3')
//     title.simulate('dblclick')
//
//     input = chapter.find(TextInput)
//     expect(input.length).to.equal(1)
//
//     const saveButton = chapter.find('#bb-rename')
//     saveButton.simulate('click')
//
//     input = chapter.find(TextInput)
//     expect(input.length).to.equal(0)
//
//     props.update.reset()
//   })
//
//   it('should call the _onSaveRename function if save is clicked', () => {
//     const spy = sinon.spy(OriginalChapter.prototype, '_onSaveRename')
//     const chapter = mount(<OriginalChapter {...props} />)
//
//     expect(spy.callCount).to.be(0)
//     expect(chapter.state('isRenamingTitle')).to.be(false)
//
//     // open title input
//     let button = chapter.find('#bb-rename')
//     button.simulate('click')
//     expect(chapter.state('isRenamingTitle')).to.be(true)
//
//     // close title input
//     button = chapter.find('#bb-rename')
//     button.simulate('click')
//
//     expect(spy.callCount).to.be(1)
//
//     props.update.reset()
//     spy.restore()
//   })
//
//   it('should not accept empty input when renaming', () => {
//     const spy = sinon.spy(OriginalChapter.prototype, '_onSaveRename')
//     const chapter = shallow(<OriginalChapter {...props} />)
//
//     expect(spy.callCount).to.be(0)
//     expect(chapter.state('isRenamingTitle')).to.be(false)
//     expect(chapter.state('isRenameEmpty')).to.be(false)
//
//     const renameButton = chapter.find('#bb-rename')
//     renameButton.simulate('click')
//
//     // call input component's save function
//     const input = chapter.find('TextInput')
//     input.props().onSave('')
//
//     // called the method, but never called the prop / action
//     expect(spy.callCount).to.be(1)
//     expect(props.update.callCount).to.be(0)
//     expect(chapter.state('isRenamingTitle')).to.be(true)
//     expect(chapter.state('isRenameEmpty')).to.be(true)
//
//     spy.restore()
//   })
//
//   it('should open the delete modal on click of the delete button', () => {
//     const chapter = shallow(<OriginalChapter {...props} />)
//
//     expect(chapter.state('showDeleteModal')).to.be(false)
//     const deleteButton = chapter.find('#bb-delete')
//     deleteButton.simulate('click')
//     expect(chapter.state('showDeleteModal')).to.be(true)
//   })
//
//   it('should open the unlock modal when the unlock area is clicked', () => {
//     props.chapter.lock = {
//       editor: {
//         username: 'Yannis'
//       },
//       timestamp: 1
//     }
//     props.roles = ['admin']
//
//     const chapter = shallow(<OriginalChapter {...props} />)
//     expect(chapter.state('showUnlockModal')).to.be(false)
//
//     const unlock = chapter.find('#bb-unlock')
//     const message = unlock.text().split('1/1/1970')[0].trim()
//     expect(message).to.equal('Yannis has been editing since')
//
//     unlock.simulate('click')
//     expect(chapter.state('showUnlockModal')).to.be(true)
//
//     delete props.chapter.lock
//     props.roles = []
//   })
//
//   it('should not unlock the chapter if the user does not have admin rights', () => {
//     props.chapter.lock = {
//       editor: {
//         username: 'Yannis'
//       },
//       timestamp: 1
//     }
//
//     const chapter = shallow(<OriginalChapter {...props} />)
//     expect(chapter.state('showUnlockModal')).to.be(false)
//
//     const unlock = chapter.find('#bb-unlock')
//     const message = unlock.text()
//     expect(message).to.equal('Yannis is editing')
//
//     unlock.simulate('click')
//     expect(chapter.state('showUnlockModal')).to.be(false)
//
//     delete props.chapter.lock
//   })
//
//   it('should have a link to the editor on the edit button', () => {
//     const chapter = shallow(<OriginalChapter {...props}/>)
//
//     const edit = chapter.find('#bb-edit')
//     expect(edit.is(LinkContainer)).to.be(true)
//
//     const link = edit.prop('to')
//     expect(link).to.equal('/manage/editor/123')
//   })
//
//   it('should open a system dialogue on click of upload', () => {
//     const chapter = shallow(<OriginalChapter {...props}/>)
//
//     const upload = chapter.find('#bb-upload')
//     const input = upload.childAt(1)
//
//     expect(input.prop('type')).to.equal('file')
//     expect(input.prop('accept')).to.equal('.docx')
//   })
//
//   it('should call the upload action when _onClickAlignment is called', () => {
//     const chapter = shallow(<OriginalChapter {...props}/>)
//     const instance = chapter.instance()
//
//     instance._onClickAlignment('hello')
//     expect(props.update.callCount).to.be(0)
//
//     instance._onClickAlignment('left')
//     expect(props.update.callCount).to.be(1)
//
//     props.update.reset()
//   })
//
//   it('should call the remove action when _onClickDelete is called', () => {
//     const chapter = shallow(<OriginalChapter {...props}/>)
//     const instance = chapter.instance()
//
//     expect(props.remove.callCount).to.be(0)
//     instance._onClickDelete()
//     expect(props.remove.callCount).to.be(1)
//   })
//
//   it('should return if the user is admin when _isAdmin is called', () => {
//     // is admin
//     props.roles = ['admin']
//
//     let chapter = shallow(<OriginalChapter {...props}/>)
//     let instance = chapter.instance()
//
//     let val = instance._isAdmin()
//     expect(val).to.be(true)
//
//     // is not admin
//     props.roles = []
//
//     chapter = shallow(<OriginalChapter {...props}/>)
//     instance = chapter.instance()
//
//     val = instance._isAdmin()
//     expect(val).to.be(false)
//   })
//
//   it('should update the chapter is _onClickUnlock is called by an admin', () => {
//     props.roles = ['admin']
//     const chapter = shallow(<OriginalChapter {...props}/>)
//     let instance = chapter.instance()
//
//     expect(props.update.callCount).to.be(0)
//     instance._onClickUnlock()
//     expect(props.update.callCount).to.be(1)
//
//     props.update.reset()
//     props.roles = []
//   })
//
//   it('should update the component title if a new item is selected from the dropdown', () => {
//     const chapter = shallow(<OriginalChapter {...props}/>)
//     let instance = chapter.instance()
//
//     expect(props.update.callCount).to.be(0)
//     instance._onClickTitleDropdown()
//     expect(props.update.callCount).to.be(1)
//
//     props.update.reset()
//   })
//
//   it('should change the chapter opacity when dragging', () => {
//     const ChapterContext = wrapInTestContext(Chapter)
//     const root = TestUtils.renderIntoDocument(<ChapterContext {...props} />)
//     const backend = root.getManager().getBackend()
//
//     let ch = TestUtils.findRenderedDOMComponentWithClass(root, 'bb-chapter')
//     expect(ch.props.style.opacity).to.be(1)
//
//     const chapter = TestUtils.findRenderedComponentWithType(root, Chapter)
//     backend.simulateBeginDrag([ chapter.getDecoratedComponentInstance().getHandlerId() ])
//
//     ch = TestUtils.findRenderedDOMComponentWithClass(root, 'bb-chapter')
//     expect(ch.props.style.opacity).to.be(0)
//   })
// })
