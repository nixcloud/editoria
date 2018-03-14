import React from 'react'
import PropTypes from 'prop-types'
import { each, groupBy, has, isEmpty, keys, pickBy, sortBy } from 'lodash'

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

            const divisionFragments = this.getFragmentsForDivision(division)
            const groupFragmentsByDivision = groupBy(
              divisionFragments,
              'division',
            )
            const groupedFragmentsBySubcategory = groupBy(
              groupFragmentsByDivision[division],
              'subCategory',
            )
            const hasPartsOrChapters = has(
              groupedFragmentsBySubcategory,
              subCategory,
            )

            if (!isEmpty(groupedFragmentsBySubcategory)) {
              fragment.number = hasPartsOrChapters
                ? groupedFragmentsBySubcategory[subCategory].length + 1
                : 1
            } else {
              fragment.number = 1
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
    const divisionFragments = this.getFragmentsForDivision(division)

    const fragment = divisionFragments.find(f => f.id === id)
    return fragment.rev
  }

  getFragmentsForDivision(division) {
    const mapper = {
      back: this.props.backChapters,
      body: this.props.bodyChapters,
      front: this.props.frontChapters,
    }

    return mapper[division]
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
          <label className={styles.uploadIcon} htmlFor="file-uploader" />

          <label className={styles.uploadMultipleText} htmlFor="file-uploader">
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
  backChapters: PropTypes.arrayOf(
    PropTypes.shape({
      alignment: PropTypes.objectOf(PropTypes.bool),
      author: PropTypes.string,
      book: PropTypes.string,
      division: PropTypes.string,
      id: PropTypes.string,
      index: PropTypes.number,
      kind: PropTypes.string,
      lock: PropTypes.shape({
        editor: PropTypes.shape({
          username: PropTypes.string,
        }),
        timestamp: PropTypes.string,
      }),
      number: PropTypes.number,
      owners: PropTypes.arrayOf(
        PropTypes.shape({
          id: PropTypes.string,
          username: PropTypes.string,
        }),
      ),
      progress: PropTypes.objectOf(PropTypes.number),
      rev: PropTypes.string,
      source: PropTypes.string,
      status: PropTypes.string,
      subCategory: PropTypes.string,
      title: PropTypes.string,
      trackChanges: PropTypes.bool,
      type: PropTypes.string,
    }),
  ).isRequired,
  bodyChapters: PropTypes.arrayOf(
    PropTypes.shape({
      alignment: PropTypes.objectOf(PropTypes.bool),
      author: PropTypes.string,
      book: PropTypes.string,
      division: PropTypes.string,
      id: PropTypes.string,
      index: PropTypes.number,
      kind: PropTypes.string,
      lock: PropTypes.shape({
        editor: PropTypes.shape({
          username: PropTypes.string,
        }),
        timestamp: PropTypes.string,
      }),
      number: PropTypes.number,
      owners: PropTypes.arrayOf(
        PropTypes.shape({
          id: PropTypes.string,
          username: PropTypes.string,
        }),
      ),
      progress: PropTypes.objectOf(PropTypes.number),
      rev: PropTypes.string,
      source: PropTypes.string,
      status: PropTypes.string,
      subCategory: PropTypes.string,
      title: PropTypes.string,
      trackChanges: PropTypes.bool,
      type: PropTypes.string,
    }),
  ).isRequired,
  book: PropTypes.shape({
    id: PropTypes.string,
    rev: PropTypes.string,
    title: PropTypes.string,
  }).isRequired,
  convert: PropTypes.func.isRequired,
  create: PropTypes.func.isRequired,
  frontChapters: PropTypes.arrayOf(
    PropTypes.shape({
      alignment: PropTypes.objectOf(PropTypes.bool),
      author: PropTypes.string,
      book: PropTypes.string,
      division: PropTypes.string,
      id: PropTypes.string,
      index: PropTypes.number,
      kind: PropTypes.string,
      lock: PropTypes.shape({
        editor: PropTypes.shape({
          username: PropTypes.string,
        }),
        timestamp: PropTypes.string,
      }),
      number: PropTypes.number,
      owners: PropTypes.arrayOf(
        PropTypes.shape({
          id: PropTypes.string,
          username: PropTypes.string,
        }),
      ),
      progress: PropTypes.objectOf(PropTypes.number),
      rev: PropTypes.string,
      source: PropTypes.string,
      status: PropTypes.string,
      subCategory: PropTypes.string,
      title: PropTypes.string,
      trackChanges: PropTypes.bool,
      type: PropTypes.string,
    }),
  ).isRequired,
  update: PropTypes.func.isRequired,
  updateUploadStatus: PropTypes.func.isRequired,
}

export default FileUploader
