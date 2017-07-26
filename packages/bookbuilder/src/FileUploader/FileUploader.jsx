import React from 'react'
import { each, get, keys } from 'lodash'

import styles from '../styles/bookBuilder.local.scss'

class FileUploader extends React.Component {
  constructor (props) {
    super(props)

    this.onChange = this.onChange.bind(this)

    this.state = {
      counter: {
        front: null,
        body: null,
        back: null
      },
      uploading: {}
    }
  }

  handleUploadStatusChange (fragmentId, bool) {
    const { uploading } = this.state
    uploading[fragmentId] = bool
    this.setState({
      uploading
    })
  }

  onChange (event) {
    event.preventDefault()
    const { backChapters, bodyChapters, book, convert, create, frontChapters, update, updateUploadStatus } = this.props
    const files = event.target.files

    const divisionMapper = {
      a: {
        chapterList: frontChapters,
        division: 'front'
      },
      b: {
        chapterList: bodyChapters,
        division: 'body'
      },
      c: {
        chapterList: backChapters,
        division: 'back'
      }
    }

    each(keys(divisionMapper), (key) => {
      const division = divisionMapper[key]
      // console.log(division)
      const { counter } = this.state

      const baseCounter = get(division, 'chapterList.length') || 0
      counter[division.division] = baseCounter

      this.setState(counter)
    })

    each(files, (file, i) => {
      const name = file.name.replace(/\.[^/.]+$/, '')
      const nameSpecifier = name.slice(0, 1)

      const division = divisionMapper[nameSpecifier].division
      // const chapterList = divisionMapper[nameSpecifier].chapterList
      let subCategory

      if (division !== 'body') {
        subCategory = 'component'
      } else {
        if (name.slice(5, 9) === 'Part') {
          subCategory = 'part'
        } else {
          subCategory = 'chapter'
        }
      }

      // console.log(this.state.counter)
      const index = this.state.counter[division]
      const nextIndex = index + 1
      const { counter } = this.state
      counter[division] = nextIndex
      this.setState({ counter })

      // console.log('index', index)

      // if (isNumber(this.state.counter[division])) {
      //   index = this.state.counter[division] + 1
      //   this.setState({
      //     counter[division]: this.state.counter[division] + 1
      //   })
      // } else {
      //   index = 0
      // }

      const fragment = {
        book: book.id,
        subCategory,
        division,
        alignment: {
          left: false,
          right: false
        },
        progress: {
          style: 0,
          edit: 0,
          review: 0,
          clean: 0
        },
        lock: null,

        index,
        kind: 'chapter',
        title: name,

        status: 'unpublished',
        author: '',
        source: '',
        comments: {},
        trackChanges: false
      }

      setTimeout(() => {
        create(book, fragment).then((res) => {
          const fragmentId = res.fragment.id

          // console.log('one')
          this.handleUploadStatusChange(fragmentId, true)
          updateUploadStatus(this.state.uploading)
          // console.log('two')

          convert(file).then((response) => {
            const patch = {
              id: fragmentId,
              source: response.converted
            }

            update(book, patch)

            this.handleUploadStatusChange(fragmentId, false)
            updateUploadStatus(this.state.uploading)
          }).catch((error) => {
            console.log(error)

            this.handleUploadStatusChange(fragmentId, false)
            updateUploadStatus(this.state.uploading)
          })
        })
      }, i * 100)
    })
  }

  render () {
    const containerStyles = {
      padding: '0'
    }

    const inputStyles = {
      display: 'none'
    }

    const labelStyles = {
      color: '#fff',
      cursor: 'pointer',
      fontWeight: '500',
      // marginBottom: 0,
      margin: 'auto 0',
      width: '170px'
    }

    return (
      <div style={containerStyles}
        className={styles.teamManagerBtn}
      >
        <label htmlFor='file-uploader' style={labelStyles}>
          upload files
        </label>
        <input
          accept='.doc,.docx'
          id='file-uploader'
          multiple
          name='file-uploader'
          onChange={this.onChange}
          style={inputStyles}
          type='file'
        />
      </div>
    )
  }
}

FileUploader.propTypes = {
  backChapters: React.PropTypes.array.isRequired,
  bodyChapters: React.PropTypes.array.isRequired,
  book: React.PropTypes.object.isRequired,
  convert: React.PropTypes.func.isRequired,
  create: React.PropTypes.func.isRequired,
  frontChapters: React.PropTypes.array.isRequired,
  update: React.PropTypes.func.isRequired,
  updateUploadStatus: React.PropTypes.func.isRequired
}

export default FileUploader
