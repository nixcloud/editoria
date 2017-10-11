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

    this.divisionMapper = {
      a: {
        chapterList: this.props.frontChapters,
        division: 'front'
      },
      b: {
        chapterList: this.props.bodyChapters,
        division: 'body'
      },
      c: {
        chapterList: this.props.backChapters,
        division: 'back'
      }
    }
  }

  handleUploadStatusChange (fragmentId, bool) {
    const { uploading } = this.state
    uploading[fragmentId] = bool
    this.setState({
      uploading
    })
  }

  setCounters () {
    each(keys(this.divisionMapper), (key) => {
      const division = this.divisionMapper[key]
      const { counter } = this.state

      const baseCounter = get(division, 'chapterList.length') || 0
      counter[division.division] = baseCounter

      this.setState(counter)
    })
  }

  onChange (event) {
    event.preventDefault()

    const { book, convert, create, update, updateUploadStatus } = this.props

    const originalFiles = event.target.files
    const files = sortBy(originalFiles, 'name') // ensure order

    this.setCounters()

    const self = this
    const frags = []

    function makeFragments (fileList) {
      return fileList.reduce(
        (promise, file, i) =>
          promise
            .then((result) => {
              const name = file.name.replace(/\.[^/.]+$/, '') // remove file extension
              const nameSpecifier = name.slice(0, 1) // get division from name

              // mark last file
              let last
              if (i + 1 === files.length) last = true

              // // default to body
              let division
              if (!self.divisionMapper[nameSpecifier]) {
                division = 'body'
              } else {
                division = self.divisionMapper[nameSpecifier].division
              }

              let subCategory
              if (division !== 'body') {
                subCategory = 'component'
              } else if (name.slice(5, 9) === 'Part') {
                subCategory = 'part'
              } else {
                subCategory = 'chapter'
              }

              const index = self.state.counter[division]
              const nextIndex = index + 1
              const { counter } = self.state
              counter[division] = nextIndex
              self.setState({ counter })

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

              return create(book, fragment)
                .then((response) => {
                  const fragmentId = response.fragment.id
                  frags.push(fragmentId)

                  if (last) self.input.value = '' // reset input
                })
                .catch((error) => {
                  console.log(error)
                })
            })
            .catch(console.error),
        Promise.resolve()
      )
    }

    makeFragments(files)
      .then(() => {
        each(files, (file, i) => {
          const fragmentId = frags[i]

          this.handleUploadStatusChange(fragmentId, true)
          updateUploadStatus(this.state.uploading)

          convert(file)
            .then((response) => {
              const patch = {
                id: fragmentId,
                source: response.converted
              }

              update(book, patch)

              self.handleUploadStatusChange(fragmentId, false)
              updateUploadStatus(self.state.uploading)
            })
            .catch((error) => {
              console.log(error)

              self.handleUploadStatusChange(fragmentId, false)
              updateUploadStatus(self.state.uploading)
            })
        })
      })
      .catch((error) => {
        console.log(error)
      })
  }

  render () {
    const { uploading } = this.state
    const uploadingOnly = pickBy(uploading, (value, key) => value === true)
    const currentlyUploading = keys(uploadingOnly).length

    let labelText
    if (currentlyUploading > 0) {
      labelText = `converting ${currentlyUploading} files`
    } else {
      labelText = 'upload multiple word files'
    }

    return (
      <div className={`${styles.MultipleUploadContainer} col-lg-4 col-md-8 col-sm-7 col-xs-7`}>
        <label htmlFor='file-uploader' className={styles.uploadIcon} />

        <label htmlFor='file-uploader' className={styles.uploadMultipleText}>
          {labelText}
        </label>

        <input
          accept='.doc,.docx'
          id='file-uploader'
          multiple
          name='file-uploader'
          onChange={this.onChange}
          ref={(c) => {
            this.input = c
          }}
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
