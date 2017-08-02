import React from 'react'
import { each, get, keys, pickBy, sortBy } from 'lodash'

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

    const {
      backChapters,
      bodyChapters,
      book,
      convert,
      create,
      frontChapters,
      update,
      updateUploadStatus
    } = this.props

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

    const originalFiles = event.target.files
    const files = sortBy(originalFiles, 'name')  // ensure order

    each(keys(divisionMapper), (key) => {
      const division = divisionMapper[key]
      const { counter } = this.state

      const baseCounter = get(division, 'chapterList.length') || 0
      counter[division.division] = baseCounter

      this.setState(counter)
    })

    each(files, (file, i) => {
      const name = file.name.replace(/\.[^/.]+$/, '')  // remove file extension
      const nameSpecifier = name.slice(0, 1)  // get division from name

      // mark last file
      let last
      if ((i + 1) === files.length) last = true

      // default to body
      let division
      if (!divisionMapper[nameSpecifier]) {
        division = 'body'
      } else {
        division = divisionMapper[nameSpecifier].division
      }

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

      const index = this.state.counter[division]
      const nextIndex = index + 1
      const { counter } = this.state
      counter[division] = nextIndex
      this.setState({ counter })

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

      // setTimeout(() => {

      create(book, fragment).then((res) => {
        const fragmentId = res.fragment.id

        if (last) this.input.value = ''  // reset input

        this.handleUploadStatusChange(fragmentId, true)
        updateUploadStatus(this.state.uploading)

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
      }).catch((error) => {
        console.log('create fragment error', error)
      })

      // }, i * 50)
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
      margin: 'auto 0',
      padding: ' 0 30px'
    }

    const { uploading } = this.state
    const uploadingOnly = pickBy(uploading, (value, key) => {
      return (value === true)
    })
    const currentlyUploading = keys(uploadingOnly).length

    let labelText
    if (currentlyUploading > 0) {
      labelText = `converting ${currentlyUploading} files`
    } else {
      labelText = 'upload files'
    }

    return (
      <div
        className={styles.teamManagerBtn}
        style={containerStyles}
      >
        <label
          htmlFor='file-uploader'
          style={labelStyles}
        >
          { labelText }
        </label>
        <input
          accept='.doc,.docx'
          id='file-uploader'
          multiple
          name='file-uploader'
          onChange={this.onChange}
          ref={(c) => { this.input = c }}
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
