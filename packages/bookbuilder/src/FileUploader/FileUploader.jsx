import React from 'react'
import { each, get, keys, pickBy, sortBy } from 'lodash'

import styles from '../styles/bookBuilder.local.scss'

class FileUploader extends React.Component {
  constructor(props) {
    super(props)

    this.onChange = this.onChange.bind(this)

    this.state = {
      counter: {
        front: this.props.frontChapters.length,
        body: this.props.bodyChapters.length,
        back: this.props.backChapters.length,
      },
      uploading: {},
    }
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.bodyChapters !== nextProps.bodyChapters) {
       let counter = this.state.counter
       counter.body = nextProps.bodyChapters.length
       this.setState({ counter })
    }

    if (this.props.frontChapters !== nextProps.frontChapters) {
      let counter = this.state.counter
      counter.front = nextProps.frontChapters.length
      this.setState({ counter })
   }

   if (this.props.backChapters !== nextProps.backChapters) {
      let counter = this.state.counter
      counter.back = nextProps.backChapters.length
      this.setState({ counter })
   }
  }

  handleUploadStatusChange(fragmentId, bool) {
    const { uploading } = this.state
    uploading[fragmentId] = bool
    this.setState({
      uploading
    })
  }

  // Extracting Properties for fragment Based to Name
  // Preferably a Rule implementation should be created
  // moving this function to a better context a not to Uploading Component
  extractFragmentProperties (file) {
    const nameSpecifier = name.slice(0, 1) // get division from name

    let division
    if (nameSpecifier === "a") {
      division = 'front'
    } else if (nameSpecifier === "c") {
      division = "back"
    } else {
      division = "body"
    }

    let subCategory
    if (division !== 'body') {
      subCategory = 'component'
    } else if (name.slice(5, 9) === 'Part') {
      subCategory = 'part'
    } else {
      subCategory = 'chapter'
    }
    return {
      division,
      subCategory,
    }
  }

  makeFragments(fileList) {
    const { book, create } = this.props
    const frags = [] 
    let self = this
   
    return fileList.reduce(
      (promise, file, i) =>
        promise
          .then(() => {
            const name = file.name.replace(/\.[^/.]+$/, '') // remove file extension
            const { division, subCategory } = this.extractFragmentProperties(name)

            const index = self.state.counter[division]
            const nextIndex = index + 1

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
              number: nextIndex,

              status: 'unpublished',
              author: '',
              source: '',
              comments: {},
              trackChanges: false
            }

            return create(book, fragment)
              .then(response => {
                frags.push(response.fragment)
                return frags
              })
              .catch(error => {
                console.log(error)
              })
          })
          .catch(console.error),
      Promise.resolve()
    )
  }

  onChange(event) {
    event.preventDefault()

    const { book, convert, update, updateUploadStatus } = this.props

    const originalFiles = event.target.files
    const files = sortBy(originalFiles, 'name') // ensure order

    const self = this
    this.makeFragments(files)
      .then(frags => {
        each(files, (file, i) => {
          const fragment = frags[i]

           this.handleUploadStatusChange(fragment.id, true)
           updateUploadStatus(this.state.uploading)

          convert(file)
            .then((response) => {

              const patch = {
                id: fragment.id,
                rev: fragment.rev,
                source: response.converted
              }

              update(book, patch)

              self.handleUploadStatusChange(fragment.id, false)
              updateUploadStatus(self.state.uploading)
            })
            .catch(error => {
              self.handleUploadStatusChange(fragment.id, false)
              updateUploadStatus(self.state.uploading)
            })
        })
      })
      .catch((error) => {
        console.log(error)
      })
  }

  render() {
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
      <div className={`${styles.multipleUploadContainer}`}>
        <span>
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
        </span>
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
