// import React from 'react'
// import { shallow } from 'enzyme'
// import expect from 'expect.js'
// import sinon from 'sinon'
//
// import { ProgressIndicator } from '../ProgressIndicator'
//
// let props = {
//   type: 'style',
//   update: sinon.spy(),
//   chapter: {
//     progress: {
//       style: 0,
//       edit: 0,
//       review: 0,
//       clean: 0
//     }
//   }
// }
//
// describe('ProgressIndicator', () => {
//   it('should render the indicator text', () => {
//     const indicator = shallow(<ProgressIndicator {...props}/>)
//     const text = indicator.text().trim()
//     expect(text).to.equal('To Style')
//   })
//
//   it('should render an icon only if it is specified in the props', () => {
//     props.hasIcon = true
//     let indicator = shallow(<ProgressIndicator {...props} />)
//     let icon = indicator.find('i')
//     expect(icon.length).to.be(1)
//
//     delete props.hasIcon
//     indicator = shallow(<ProgressIndicator {...props} />)
//     icon = indicator.find('i')
//     expect(icon.length).to.be(0)
//   })
//
//   it('should call its _onClick method if clicked', () => {
//     const spy = sinon.spy(ProgressIndicator.prototype, '_onClick')
//     const indicator = shallow(<ProgressIndicator {...props} />)
//
//     expect(spy.callCount).to.be(0)
//     indicator.simulate('click')
//     expect(spy.callCount).to.be(1)
//
//     props.chapter.progress.style = 0
//     props.update.reset()
//     spy.restore()
//   })
//
//   it('should move to the next value on click', () => {
//     const indicator = shallow(<ProgressIndicator {...props}/>)
//     const instance = indicator.instance()
//
//     expect(props.update.callCount).to.be(0)
//     instance._onClick()
//     expect(props.update.callCount).to.be(1)
//
//     const args = props.update.firstCall.args
//     const updatedChapter = args[0]
//     expect(updatedChapter.progress.style).to.be(1)
//
//     props.chapter.progress.style = 0
//     props.update.reset()
//   })
//
//   it('should cycle back to first value when it reaches the end', () => {
//     const indicator = shallow(<ProgressIndicator {...props}/>)
//     const instance = indicator.instance()
//
//     expect(props.update.callCount).to.be(0)
//
//     // first two times move forward in the array
//     instance._onClick()
//     instance._onClick()
//     expect(props.update.callCount).to.be(2)
//
//     let args = props.update.lastCall.args
//     let updatedChapter = args[0]
//     expect(updatedChapter.progress.style).to.be(2)
//
//     // third time cycles back to the beginning
//     instance._onClick()
//     expect(props.update.callCount).to.be(3)
//
//     args = props.update.lastCall.args
//     updatedChapter = args[0]
//     expect(updatedChapter.progress.style).to.be(0)
//
//     props.chapter.progress.style = 0
//     props.update.reset()
//   })
// })
