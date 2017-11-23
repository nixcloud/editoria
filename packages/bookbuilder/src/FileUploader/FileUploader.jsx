import React from 'react'
import { each, keys, pickBy, sortBy } from 'lodash'

import styles from '../styles/bookBuilder.local.scss'

class FileUploader extends React.Component {
  constructor(props) {
    super(props)

    this.onChange = this.onChange.bind(this)

    this.state = {
      counter: {
        back: this.props.backChapters.length,
        body: this.props.bodyChapters.length,
        front: this.props.frontChapters.length,
      },
      uploading: {},
    }
  }

  // TODO -- do we need all these if's??
  componentWillReceiveProps(nextProps) {
    const { counter } = this.state
    if (this.props.bodyChapters !== nextProps.bodyChapters) {
      counter.body = nextProps.bodyChapters.length
      this.setState({ counter })
    }

    if (this.props.frontChapters !== nextProps.frontChapters) {
      counter.front = nextProps.frontChapters.length
      this.setState({ counter })
    }

    if (this.props.backChapters !== nextProps.backChapters) {
      counter.back = nextProps.backChapters.length
      this.setState({ counter })
    }
  }

  handleUploadStatusChange(fragmentId, bool) {
    const { uploading } = this.state
    uploading[fragmentId] = bool
    this.setState({
      uploading,
    })
  }

  // Extracting Properties for fragment Based to Name
  // Preferably a Rule implementation should be created
  // moving this function to a better context a not to Uploading Component
  static extractFragmentProperties(fileName) {
    const nameSpecifier = fileName.slice(0, 1) // get division from name

    let division
    if (nameSpecifier === 'a') {
      division = 'front'
    } else if (nameSpecifier === 'c') {
      division = 'back'
    } else {
      division = 'body'
    }

    let subCategory
    if (division !== 'body') {
      subCategory = 'component'
    } else if (fileName.slice(5, 9) === 'Part') {
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
    const self = this

    return fileList.reduce(
      (promise, file, i) =>
        promise
          .then(() => {
            // remove file extension
            const name = file.name.replace(/\.[^/.]+$/, '')

            const {
              division,
              subCategory,
            } = this.constructor.extractFragmentProperties(name)

            const index = self.state.counter[division]
            const nextIndex = index + 1

            const fragment = {
              alignment: {
                left: false,
                right: false,
              },
              author: '',
              book: book.id,
              comments: {},
              division,
              index,
              kind: 'chapter',
              lock: null,
              progress: {
                clean: 0,
                edit: 0,
                review: 0,
                style: 0,
              },
              source: '',
              status: 'unpublished',
              subCategory,
              title: name,
              trackChanges: false,
            }

            if (division === 'body' && subCategory === 'chapter') {
              const { bodyChapters } = this.props
              const numberedChapters = bodyChapters.filter(
                ch => ch.subCategory === 'chapter',
              )
              fragment.number = numberedChapters.length + 1
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
      Promise.resolve(),
    )
  }

  // Get latest fragment rev for when ink is done
  // (and update runs with a potentially changed rev)
  getFragmentRev(id, division) {
    const mapper = {
      back: this.props.backChapters,
      body: this.props.bodyChapters,
      front: this.props.frontChapters,
    }

    const divisionFragments = mapper[division]

    const fragment = divisionFragments.find(f => f.id === id)
    return fragment.rev
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
            .then(response => {
              const patch = {
                id: fragment.id,
                rev: this.getFragmentRev(fragment.id, fragment.division),
                source: response.converted,
              }

              update(book, patch)

              self.handleUploadStatusChange(fragment.id, false)
              updateUploadStatus(self.state.uploading)
            })
            .catch(error => {
              console.error(error)
              self.handleUploadStatusChange(fragment.id, false)
              updateUploadStatus(self.state.uploading)
            })
        })
      })
      .catch(error => {
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
          <label htmlFor="file-uploader" className={styles.uploadIcon} />

          <label htmlFor="file-uploader" className={styles.uploadMultipleText}>
            {labelText}
          </label>

          <input
            accept=".doc,.docx"
            id="file-uploader"
            multiple
            name="file-uploader"
            onChange={this.onChange}
            ref={c => {
              this.input = c
            }}
            type="file"
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
  updateUploadStatus: React.PropTypes.func.isRequired,
}

export default FileUploader
