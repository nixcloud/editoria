// import React from 'react'
// import { shallow } from 'enzyme'
// import expect from 'expect.js'
// import { Modal } from 'react-bootstrap'
// import sinon from 'sinon'
//
// import { BookBuilderModal } from '../BookBuilderModal'
//
// let props = {
//   title: 'Unlock component',
//   successText: 'Do it',
//   container: {},
//   type: 'component',
//   action: 'unlock',
//   chapter: {
//     title: 'A title'
//   },
//   show: sinon.spy(),
//   toggle: sinon.spy(),
//   successAction: sinon.spy()
// }
//
// describe('BookBuilderModal', () => {
//   it('should render the modal title', () => {
//     const modal = shallow(<BookBuilderModal {...props}/>)
//
//     const header = modal.find(Modal.Header)
//     expect(header.length).to.be(1)
//
//     const title = modal.find(Modal.Title)
//     expect(title.length).to.be(1)
//
//     const titleText = title.childAt(0)
//     expect(titleText.text()).to.equal('Unlock component')
//   })
//
//   it('should render the correct body', () => {
//     const modal = shallow(<BookBuilderModal {...props}/>)
//     const body = modal.find(Modal.Body)
//     expect(body.length).to.be(1)
//
//     const message = body.childAt(0).text()
//     const correctMessage = 'This action will unlock the chapter that is ' +
//                            'currently being edited. Use with caution.'
//     expect(message).to.equal(correctMessage)
//   })
//
//   it('should render the cancel button', () => {
//     const modal = shallow(<BookBuilderModal {...props}/>)
//     const cancel = modal.find('.bb-modal-cancel')
//     expect(cancel.is('a')).to.be(true)
//     expect(cancel.text()).to.be('Cancel')
//   })
//
//   it('should render the action button', () => {
//     const modal = shallow(<BookBuilderModal {...props}/>)
//     const button = modal.find('.bb-modal-act')
//     expect(button.is('a')).to.be(true)
//     expect(button.text()).to.equal(props.successText)
//   })
//
//   it('should close the modal on cancel', () => {
//     const modal = shallow(<BookBuilderModal {...props}/>)
//     const cancel = modal.find('.bb-modal-cancel')
//
//     expect(props.toggle.callCount).to.be(0)
//     cancel.simulate('click')
//     expect(props.toggle.callCount).to.be(1)
//
//     props.toggle.reset()
//   })
//
//   it('should call the action function on click', () => {
//     const modal = shallow(<BookBuilderModal {...props}/>)
//     const button = modal.find('.bb-modal-act')
//
//     expect(props.successAction.callCount).to.be(0)
//     button.simulate('click')
//     expect(props.successAction.callCount).to.be(1)
//
//     props.successAction.reset()
//   })
// })
